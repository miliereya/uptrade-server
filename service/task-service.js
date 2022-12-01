const projectModel = require("../models/project-model")
const taskModel = require("../models/task-model")

class TaskService {
    async getTasks(queue, development, done, val = '', searchType = '') {
        const taskIds = [...queue, ...development, ...done]
        const props = {
            '_id': {
                $in: taskIds
            }
        }
        if (searchType === 'title') {
            val = new RegExp(`${val}`)
            props.title = { $regex: val }
        }

        if (searchType === 'num') {
            props.num = val
        }
        const tasks = await taskModel.find(props)
        return tasks
    }

    async updateColumns(id, columns) {
        await projectModel.findByIdAndUpdate(
            id,
            { $set: { queue: columns.queue, development: columns.development, done: columns.done } }
        )
        const updatedProject = await projectModel.findById(id)
        return updatedProject
    }
    async createTask(projectId, task) {
        const oldProject = await projectModel.findById(projectId)
        const newTask = new taskModel({
            ...task,
            num: oldProject.taskNum + 1
        })
        await newTask.save()
        oldProject.taskNum += 1
        await oldProject.save()

        await projectModel.findByIdAndUpdate(
            projectId,
            { $push: { queue: newTask._id } }
        )
        const project = await projectModel.findById(projectId)

        const { queue, development, done } = project
        const tasks = await this.getTasks(queue, development, done)

        return { tasks, project }
    }

    async updateTask(task) {
        let { title, description, priority, status, subtasks } = task

        const oldTask = await taskModel.findById(task._id)

        await taskModel.findByIdAndUpdate(task._id, {
            $set: {
                title: title,
                description: description,
                priority: priority,
                status: status,
                subtasks: subtasks
            }
        })
        if (oldTask.status !== 'done' && status === 'done') {
            await taskModel.findByIdAndUpdate(task._id, {
                $set: {
                    dateDone: new Date()
                }
            })
        } else {
            if (oldTask.dateDone && status !== 'done') {
                await taskModel.findByIdAndUpdate(task._id, {
                    $unset: {
                        dateDone: ""
                    }
                })
            }
        }

        if (oldTask.status !== 'development' && status === 'development') {
            await taskModel.findByIdAndUpdate(task._id, {
                $set: {
                    movedToDevelopment: new Date()
                }
            })
        }
        if (oldTask.status === 'development' && status !== 'development') {
            await taskModel.findByIdAndUpdate(task._id, {
                $set: {
                    developmentTime: oldTask.developmentTime + new Date().getTime() - oldTask.movedToDevelopment.getTime()
                }
            })
            await taskModel.findByIdAndUpdate(task._id, {
                $unset: {
                    movedToDevelopment: new Date()
                }
            })
        }

    }

    async deleteTask(projectId, id) {
        await taskModel.findByIdAndDelete(id)
        await projectModel.updateOne(
            { _id: projectId },
            { $pull: { queue: id } }
        )
        await projectModel.updateOne(
            { _id: projectId },
            { $pull: { development: id } }
        )
        await projectModel.updateOne(
            { _id: projectId },
            { $pull: { done: id } }
        )

        const project = await projectModel.findById(projectId)

        const { queue, development, done } = project
        const tasks = await this.getTasks(queue, development, done)

        return { tasks, project }
    }
}
module.exports = new TaskService()