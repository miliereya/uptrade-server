module.exports = class UserDto {
    email
    projects

    constructor(model) {
        this.email = model.email
        this.projects = model.projects
    }
}