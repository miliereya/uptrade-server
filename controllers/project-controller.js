const projectService = require('../service/project-service')
const userService = require('../service/user-service')

class ProjectController {
    async createProject(req, res, next) {
        try {
            const { title, image } = req.body
            const email = req.user.email

            const project = await projectService.createProject(title, image)
            const projectsData = await userService.addProject(email, project)
            return res.json(projectsData)
        } catch (e) {
            next(e)
        }
    }

    async getProject(req, res, next) {
        try {
            const { id } = req.query
            const project = await projectService.getProject(id)
            return res.json(project)
        } catch (e) {
            next(e)
        }
    }

    async updateProject(req, res, next) {
        try {
            const { id, title, image } = req.body
            const email = req.user.email
            const project = await projectService.updateProject(id, title, image)
            const projectsData = await userService.updateProject(email, project)
            return res.json(projectsData)
        } catch (e) {
            next(e)
        }
    }

    async deleteProject(req, res, next) {
        try {
            const { id } = req.body
            const email = req.user.email
            const deletedProjectId = await projectService.deleteProject(id)
            const projectsData = await userService.removeProject(email, deletedProjectId)
            return res.json(projectsData)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProjectController()