"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePortfolio } from '@/hooks/usePortfolio';
import { FreeFormEditor } from '@/components/editor/FreeFormEditor';

export default function EditorPage() {
    const params = useParams();
    const id = params.id as string;
    const { getPortfolioById, loading, error } = usePortfolio();
    const [portfolioData, setPortfolioData] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getPortfolioById(id).then((data: any) => {
                console.log("DEBUG: getPortfolioById response:", data);
                if (data && data.success && data.portfolio) { 
                    setPortfolioData(data.portfolio); 
                } else if (data && data.data) {
                    setPortfolioData(data.data);
                } else if (data) {
                    setPortfolioData(data);
                }
            }).catch(err => {
                console.error("DEBUG: Catch error", err);
            });
        }
    }, [id, getPortfolioById]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-[#121212] text-white">Loading Editor...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen bg-[#121212] text-red-500">Error: {error}</div>;
    }

    if (!portfolioData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#121212] text-neutral-400 gap-4">
                <p>Loading portfolio data...</p>
                <div className="text-xs font-mono bg-black/50 p-4 rounded max-w-lg overflow-auto">
                    <p>ID: {id}</p>
                    <p>Loading: {String(loading)}</p>
                    <p>Error: {String(error)}</p>
                    <p>Portfolio Data: {portfolioData === null ? 'null' : 'present'}</p>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    // Transform legacy data to sections
    let initialSections: any[] = [];
    if (Array.isArray(portfolioData.content)) {
        // If it's an array, check if it's an array of sections or flat components
        if (portfolioData.content.length > 0 && portfolioData.content[0].components) {
            // Already has sections
            initialSections = portfolioData.content;
        } else {
            // Flat list of components -> Wrap in a body section
            initialSections = [
                { 
                    id: 'header-section', type: 'header', height: 100, styles: { backgroundColor: '#ffffff' }, components: [] 
                },
                { 
                    id: 'main-section', type: 'body', height: 800, styles: { backgroundColor: '#f9f9f9' }, 
                    components: portfolioData.content.map((item: any) => ({
                        ...item,
                        x: item.x || 50,
                        y: item.y || 50,
                        width: item.width || 200,
                        height: item.height || 100
                    }))
                },
                { 
                    id: 'footer-section', type: 'footer', height: 200, styles: { backgroundColor: '#333333' }, components: [] 
                }
            ];
        }
    } else if (portfolioData.content && typeof portfolioData.content === 'object') {
        const header = portfolioData.content.header || [];
        const body = portfolioData.content.body || [];
        const footer = portfolioData.content.footer || [];
        
        initialSections = [
            { id: 'header-section', type: 'header', height: 200, styles: { backgroundColor: '#ffffff' }, components: header },
            { id: 'body-section', type: 'body', height: 800, styles: { backgroundColor: '#f9f9f9' }, components: body },
            { id: 'footer-section', type: 'footer', height: 200, styles: { backgroundColor: '#333333' }, components: footer }
        ];
    }

    return (
        <FreeFormEditor initialSections={initialSections} />
    );
}
