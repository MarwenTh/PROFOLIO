const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject,
  reorderProjects 
} = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/reorder', reorderProjects);

module.exports = router;
