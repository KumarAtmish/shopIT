const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message

        // Wrong Mongoose object ID Error
        if(err.name === 'CastError') {
            const message = `Resourse not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Error
        if(err.name === 'validationError') {
            const message = Object.values(err.values).map(value => value.message);
            error = new ErrorHandler(message, 400)
        }

        // Handling Mongoose duplicate key Errors
        if(err.code === 11000){
            const message = `Dupilcate ${Object.keys(err.keyValue)} entered`
            error = new ErrorHandler(message, 400)
        }

        // Handling wrong JWT error
        if(err.name === 'jsonWebTokenError') {
            const message = 'JSON web Token is invalid. Try Again !!!';
            error = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if(err.name === 'TokenExpiredError') {
            const message = 'JSON web Token is expired. Try Again !!!';
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            error: error.message || 'Internal Server Error'
        })
    }
}