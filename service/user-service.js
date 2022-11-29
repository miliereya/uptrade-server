const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user-dto')
const tokenService = require('./token-service')
const ApiError = require('../exceptions/api-error')

require('dotenv').config()

class UserService {
    async registr(email, password) {
        const candidate = await UserModel.find({ email })
        if (candidate.length !== 0) {
            throw ApiError.BadRequest(`User with the specified email ${email} is already exist`)
        }
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT))
        const newUser = new UserModel({
            email,
            password: hashedPassword
        })
        newUser.save()
        return await this.sendUserResponse(newUser)
    }

    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest(`No user was found with email ${email}`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Wrong password')
        }

        return await this.sendUserResponse(user)
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validationRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findOne({email: userData.email})
        return await this.sendUserResponse(user)
    }

    async sendUserResponse(user) {
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async addProject(email, project) {
        await UserModel.findOneAndUpdate(
            { email },
            { $push: { projects: project } }
        )
        const user = await UserModel.findOne({ email })
        return user.projects
    }

    async updateProject(email, project) {
        await UserModel.updateOne(
            { email, "projects._id": project._id},
            { $set: { 'projects.$': project }}
        )
        const user = await UserModel.findOne({ email })
        return user.projects
    }

    async removeProject(email, deletedProjectId) {
        await UserModel.updateOne(
            { email },
            { $pull: { projects: { _id: deletedProjectId } } }
        )
        const user = await UserModel.findOne({ email })
        return user.projects
    }
}

module.exports = new UserService()