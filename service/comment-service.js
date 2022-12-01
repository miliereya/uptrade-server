const commentModel = require("../models/comment-model")
const taskModel = require("../models/task-model")

class CommentService {
    async create(text, email, parrentId, isChildOfTask) {
        const comment = new commentModel({
            text,
            email
        })
        await comment.save()
        if (isChildOfTask) {
            await taskModel.findByIdAndUpdate(
                parrentId,
                { $push: { comments: comment._id } }
            )
        } else {
            await commentModel.findByIdAndUpdate(
                parrentId,
                { $push: { children: comment._id } }
            )
        }
        return comment
    }

    async getMany(ids) {
        const comments = await commentModel.find({
            '_id': {
                $in: ids
            }
        })
        return comments
    }

    async delete(id, parrentId, isChildOfTask) {
        const deletedNestedComments = async (id) => {
            const comment = await commentModel.findById(id)
            for (let i = 0; i < comment.children.length; i++) {
                deletedNestedComments(comment.children[i])
            }
            await commentModel.findByIdAndDelete(id)
        }
        deletedNestedComments(id)
        if (isChildOfTask) {
            await taskModel.findByIdAndUpdate(
                parrentId,
                { $pull: { comments: id } }
            )
        } else {
            await commentModel.findByIdAndUpdate(
                parrentId,
                { $pull: { children: id } }
            )
        }
    }
}

module.exports = new CommentService()