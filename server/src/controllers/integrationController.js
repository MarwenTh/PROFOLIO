const { pool } = require('../config/db');
const axios = require('axios');

const saveIntegration = async (req, res) => {
    const { service_name, api_key, metadata } = req.body;
    const user_id = req.user.id;

    if (!service_name || !api_key) {
        return res.status(400).json({ success: false, message: 'Service name and API key are required' });
    }

    try {
        const query = `
            INSERT INTO user_integrations (user_id, service_name, api_key, metadata, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, service_name)
            DO UPDATE SET 
                api_key = EXCLUDED.api_key,
                metadata = EXCLUDED.metadata,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, service_name, status, updated_at;
        `;
        
        const result = await pool.query(query, [user_id, service_name, api_key, metadata || {}]);
        res.json({ success: true, integration: result.rows[0] });
    } catch (err) {
        console.error('Error saving integration:', err);
        res.status(500).json({ success: false, message: 'Server error saving integration' });
    }
};

const getIntegrations = async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'SELECT id, service_name, status, updated_at, metadata FROM user_integrations WHERE user_id = $1',
            [user_id]
        );
        res.json({ success: true, integrations: result.rows });
    } catch (err) {
        console.error('Error fetching integrations:', err);
        res.status(500).json({ success: false, message: 'Server error fetching integrations' });
    }
};

const deleteIntegration = async (req, res) => {
    const { service_name } = req.params;
    const user_id = req.user.id;

    try {
        await pool.query(
            'DELETE FROM user_integrations WHERE user_id = $1 AND service_name = $2',
            [user_id, service_name]
        );
        res.json({ success: true, message: 'Integration removed' });
    } catch (err) {
        console.error('Error deleting integration:', err);
        res.status(500).json({ success: false, message: 'Server error deleting integration' });
    }
};

const testIntegration = async (req, res) => {
    const { service_name } = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'SELECT api_key FROM user_integrations WHERE user_id = $1 AND service_name = $2',
            [user_id, service_name]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Integration not found. Please connect your API key first.' });
        }

        const apiKey = result.rows[0].api_key;
        let aiResponse = "";
        let modelUsed = "";
        const testPrompt = "System Synchronization Test: Reply with 'AI Agent [ID] is online and operational.'";

        if (service_name === 'gemini') {
            // 1. Fetch available models - Try v1 first, then v1beta
            let model = null;
            let apiVersion = 'v1';
            
            try {
                const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
                const listResponse = await axios.get(listUrl, { timeout: 10000 });
                model = listResponse.data.models?.find(m => m.supportedMethods?.includes('generateContent'));
            } catch (v1Err) {
                console.warn('Gemini v1 models fetch failed:', v1Err.response?.data || v1Err.message);
            }

            if (!model) {
                try {
                    const listUrlBeta = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                    const listResponseBeta = await axios.get(listUrlBeta, { timeout: 10000 });
                    model = listResponseBeta.data.models?.find(m => m.supportedMethods?.includes('generateContent'));
                    if (model) apiVersion = 'v1beta';
                } catch (betaErr) {
                    console.warn('Gemini v1beta models fetch failed:', betaErr.response?.data || betaErr.message);
                }
            }
            
            // Hardcoded Fallback if listing fails but we want to try a direct hit
            if (!model) {
                console.log('No models discovered. Falling back to hardcoded gemini-1.5-flash for diagnostic...');
                modelUsed = 'gemini-1.5-flash';
                apiVersion = 'v1';
            } else {
                modelUsed = model.name.split('/').pop();
            }

            // 2. Run diagnostic on selected or fallback model
            const modelQualifier = model ? model.name : `models/${modelUsed}`;
            const testUrl = `https://generativelanguage.googleapis.com/${apiVersion}/${modelQualifier}:generateContent?key=${apiKey}`;
            const response = await axios.post(testUrl, {
                contents: [{ parts: [{ text: testPrompt.replace('[ID]', modelUsed.toUpperCase()) }] }]
            }, { timeout: 15000 });
            
            aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response content.";
        } else if (service_name === 'openai') {
            // 1. Fetch available models (optional verification, or just pick best)
            const listUrl = 'https://api.openai.com/v1/models';
            const listResponse = await axios.get(listUrl, { 
                headers: { 'Authorization': `Bearer ${apiKey}` },
                timeout: 10000 
            });

            // Look for gpt-4o, gpt-4, or gpt-3.5-turbo in order
            const availableModels = listResponse.data.data.map(m => m.id);
            modelUsed = ["gpt-4o", "gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"].find(m => availableModels.includes(m)) || availableModels[0];

            if (!modelUsed) {
                return res.status(400).json({ success: false, message: 'No available OpenAI models found.' });
            }

            // 2. Run diagnostic
            const testUrl = 'https://api.openai.com/v1/chat/completions';
            const response = await axios.post(testUrl, {
                model: modelUsed,
                messages: [{ role: "user", content: testPrompt.replace('[ID]', modelUsed.toUpperCase()) }],
                max_tokens: 50
            }, { 
                headers: { 'Authorization': `Bearer ${apiKey}` },
                timeout: 15000 
            });
            
            aiResponse = response.data?.choices?.[0]?.message?.content || "No response content.";
        } else {
            return res.status(400).json({ success: false, message: 'Service testing not supported.' });
        }

        res.json({ success: true, aiResponse, modelUsed });
    } catch (err) {
        console.error(`AI Testing Error (${service_name}):`, err.response?.data || err.message);
        const errorMessage = err.response?.data?.error?.message || err.message || "Connection failed.";
        res.status(400).json({ success: false, message: `Handshake Failed: ${errorMessage}` });
    }
};

module.exports = { saveIntegration, getIntegrations, deleteIntegration, testIntegration };
