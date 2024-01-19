//import modules
    //import model
const project = require('../models/projectModel')
    //import mongoose
const mongoose = require('mongoose')

//getAllProjects
const getAllProjects = async (req,res) => {
    //create a new Project model using find() and sort in descending order
    const Project = await project.find({}).sort({createdAt: -1})
    res.status(200).json(Project)
}

//getSingleProject
const getSingleProject = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Project = await project.findById(id)

    if (!Project) {
        res.status(400).json({mssg: "No such project"})
    }

    else {
        res.status(200).json(Project)
    }
}


//createNewProject
const createNewProject = async (req,res) => {
    const { Project_ID, Project_Name, P_Address_Street, P_Address_Suburb, 
        P_Address_Postcode, P_Address_State, P_Contacts } = req.body
        
    try {
        const Project = await project.create({Project_ID, Project_Name, P_Address_Street, P_Address_Suburb, 
            P_Address_Postcode, P_Address_State, P_Contacts})
            res.status(200).json(Project)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
    
}

//deleteSingleProject
const deleteSingleProject = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Project = await project.findOneAndDelete({_id: id})

    if (!Project) {
        res.status(400).json({mssg: "No such project"})
    }

    else {
        res.status(200).json(Project)
    }
}


//updateSingleProject
const updateSingleProject = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({mssg: "ID is invalid"})
    }

    const Project = await project.findOneAndUpdate({_id: id}, {...req.body})

    if (!Project) {
        res.status(400).json({mssg: "No such project"})
    }

    else {
        res.status(200).json(Project)
    }
    
}

//export module
module.exports = { getAllProjects, getSingleProject, updateSingleProject, deleteSingleProject, createNewProject}