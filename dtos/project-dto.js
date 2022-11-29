module.exports = class ProjectDto {
    _id
    title
    image

    constructor(model) {
        this._id = model.id
        this.title = model.title
        this.image = model.image
    }
}