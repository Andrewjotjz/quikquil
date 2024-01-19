//import modules
    //import express
const express = require('express');
    //import projectController and destructure functions
const { getAllProjects, createNewProject, getSingleProject,
     updateSingleProject, deleteSingleProject } = require('../controllers/projectController')
    
//create router (mini app)
const router = express.Router();

//GET - Get all projects
router.get('/', getAllProjects)

//POST - Create a new project
router.post('/create', createNewProject)

//GET - Get a single project
router.get('/:id', getSingleProject)

//PATCH - Update a single project
router.patch('/:id', updateSingleProject)

//DELETE - Delete a single project
router.delete('/:id', deleteSingleProject)


//export router module
module.exports = router;