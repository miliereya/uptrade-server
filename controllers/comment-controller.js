const commentService = require("../service/comment-service")
const taskService = require("../service/task-service")

class CommentController {
    async create(req, res, next) {
        try {
            const { email } = req.user
            const { parrentId, text, isChildOfTask } = req.body

            const comment = await commentService.create(text, email, parrentId, isChildOfTask)
            return res.json(comment)
        } catch (e) {
            next(e)
        }
    }

    async getMany(req, res, next) {
        try {
            const { ids } = req.body
            const comments = await commentService.getMany(ids)
            return res.json(comments)
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const { _id, parrentId, project, isChildOfTask } = req.body
            const { queue, development, done } = project

            await commentService.delete(_id, parrentId, isChildOfTask)
            return res.status(200).json()
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CommentController()