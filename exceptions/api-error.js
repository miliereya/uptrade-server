module.exports = class ApiError extends Error {
    status
    errors

    constructor( status, message, errors = [] ){
        super(message)
        this.status = status
        this.errors = errors
    }

    static BadRequest(message, errors = []) {
        return new ApiError( 400, message, errors)
    }

    static UnauthorizedError() {
        return new ApiError( 401, 'User is not authorized')
    }

    static NoAccessRequetError() {
        return new ApiError( 403, 'User is not admin')
    }
    
    static NoProjectOnRequest() {
        return new ApiError( 404, 'No project was found by requested id')
    }
}