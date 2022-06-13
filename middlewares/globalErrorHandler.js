function globalErrorHandler(error, req, res, next) {
    res.status(error.status || 500).send({
        errors: [error.errors] || ["Oops Something went wrong"]
    })
}

export default globalErrorHandler