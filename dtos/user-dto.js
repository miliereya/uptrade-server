module.exports = class UserDto {
    id
    email
    projects

    constructor(model) {
        this.id = model._id
        this.email = model.email
        this.projects = model.projects
    }
}