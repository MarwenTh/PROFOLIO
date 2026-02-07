const { pool } = require('../config/db');

/**
 * Get all projects for a user or portfolio
 */
const getProjects = async (req, res) => {
  const { portfolioId } = req.query;
  const userId = req.user.id;

  try {
    let query, params;
    
    if (portfolioId) {
      // Get projects for specific portfolio
      query = `
        SELECT * FROM projects 
        WHERE portfolio_id = $1 AND user_id = $2 
        ORDER BY order_index ASC, created_at DESC
      `;
      params = [portfolioId, userId];
    } else {
      // Get all projects for user
      query = `
        SELECT * FROM projects 
        WHERE user_id = $1 
        ORDER BY order_index ASC, created_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      projects: result.rows
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ success: false, message: 'Server error fetching projects' });
  }
};

/**
 * Create a new project
 */
const createProject = async (req, res) => {
  const { 
    portfolioId, 
    title, 
    description, 
    imageUrl, 
    projectUrl, 
    githubUrl, 
    tags, 
    featured 
  } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  try {
    // Get the highest order_index for this portfolio/user
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(order_index), -1) as max_order FROM projects WHERE user_id = $1',
      [userId]
    );
    const nextOrder = orderResult.rows[0].max_order + 1;

    const result = await pool.query(
      `INSERT INTO projects 
       (user_id, portfolio_id, title, description, image_url, project_url, github_url, tags, featured, order_index) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [userId, portfolioId || null, title, description, imageUrl, projectUrl, githubUrl, tags || [], featured || false, nextOrder]
    );

    res.status(201).json({
      success: true,
      project: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, message: 'Server error creating project' });
  }
};

/**
 * Get a single project by ID
 */
const getProjectById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      project: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Update a project
 */
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    imageUrl, 
    projectUrl, 
    githubUrl, 
    tags, 
    featured,
    status 
  } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE projects 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           image_url = COALESCE($3, image_url),
           project_url = COALESCE($4, project_url),
           github_url = COALESCE($5, github_url),
           tags = COALESCE($6::jsonb, tags),
           featured = COALESCE($7, featured),
           status = COALESCE($8, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [title, description, imageUrl, projectUrl, githubUrl, tags ? JSON.stringify(tags) : null, featured, status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      project: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, message: 'Server error updating project' });
  }
};

/**
 * Delete a project
 */
const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, message: 'Server error deleting project' });
  }
};

/**
 * Reorder projects
 */
const reorderProjects = async (req, res) => {
  const { projectIds } = req.body; // Array of project IDs in new order
  const userId = req.user.id;

  if (!Array.isArray(projectIds) || projectIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid project IDs array' });
  }

  try {
    // Update order_index for each project
    const updatePromises = projectIds.map((projectId, index) => 
      pool.query(
        'UPDATE projects SET order_index = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3',
        [index, projectId, userId]
      )
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Projects reordered successfully'
    });
  } catch (err) {
    console.error('Error reordering projects:', err);
    res.status(500).json({ success: false, message: 'Server error reordering projects' });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  reorderProjects
};
