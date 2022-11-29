const userController = require('../controllers/user-controller')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')
const projectController = require('../controllers/project-controller')
const taskController = require('../controllers/task-controller')

const Router = require('express').Router
const router = new Router

// user
router.post('/user/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 24 }),
    userController.registration)
router.post('/user/login', userController.login)
router.post('/user/logout', userController.logout)
router.post('/user/refresh', userController.refresh)

// project
router.post('/project/create', authMiddleware, projectController.createProject)
router.get('/project', authMiddleware, projectController.getProject)
router.put('/project/update', authMiddleware, projectController.updateProject)
router.post('/project/delete', authMiddleware, projectController.deleteProject)

//tasks
router.post('/project/tasks/get', authMiddleware, taskController.getTasks)
router.put('/project/tasks/update_columns', authMiddleware, taskController.updateTaskColumns)
router.post('/project/tasks/create', authMiddleware, taskController.createTask)
router.post('/project/tasks/delete', authMiddleware, taskController.deleteTask)
router.put('/project/tasks/update_task', authMiddleware, taskController.updateTask)

module.exports = router