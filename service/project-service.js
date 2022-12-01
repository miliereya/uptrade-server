const ProjectDto = require("../dtos/project-dto")
const ApiError = require("../exceptions/api-error")
const projectModel = require("../models/project-model")
const taskService = require("./task-service")

class ProjectService {
    async createProject(title, image) {
        const project = new projectModel({
            title,
            image
        })
        await project.save()
        return new ProjectDto(project)
    }

    async getProject(id) {
        const project = await projectModel.findById(id)
        if (!project) {
            throw ApiError.NoProjectOnRequest()
        }
        const { queue, development, done } = project
        const tasks = await taskService.getTasks(queue, development, done)
        return { tasks, project }
    }

    async updateProject(id, title, image) {
        const project = await projectModel.findById(id)
        if (!project) {
            throw ApiError.NoProjectOnRequest()
        }
        project.title = title
        project.image = image
        await project.save()

        return new ProjectDto(project)
    }

    async deleteProject(id) {
        const deletedProject = await projectModel.findByIdAndDelete(id)
        if (!deletedProject) {
            throw ApiError.NoProjectOnRequest()
        }
        return deletedProject._id
    }
}

module.exports = new ProjectService()