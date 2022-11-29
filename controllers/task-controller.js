const projectService = require("../service/project-service")
const taskService = require("../service/task-service")

class TaskController {
    async getTasks(req, res, next) {
        try {
            const { queue, development, done, val, searchType } = req.body
            const tasks = await taskService.getTasks(queue, development, done, val, searchType)
            return res.json(tasks)
        } catch (e) {
            next(e)
        }
    }
    async updateTaskColumns(req, res, next) {
        try {
            const { id, columns } = req.body
            const columnsData = await taskService.updateColumns(id, columns)
            return res.json(columnsData)
        } catch (e) {
            next(e)
        }
    }

    async createTask(req, res, next) {
        try {
            const { projectId, task } = req.body
            const data = await taskService.createTask(projectId, task)
            return res.json(data)
        } catch (e) {
            next(e)
        }
    }

    async updateTask(req, res, next) {
        try {
            const { props, projectId } = req.body
            await taskService.updateTask(props)
            const data = await projectService.getProject(projectId)
            return res.json(data)
        } catch (e) {
            next(e)
        }
    }

    async deleteTask(req, res, next) {
        try {
            const { projectId, id } = req.body
            const data = await taskService.deleteTask(projectId, id)
            return res.json(data)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new TaskController()