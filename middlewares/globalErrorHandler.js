function globalErrorHandler(error, req, res, next) {
    res.status(error.status || 500).send({
        error: error.message || "Something went wrong"
    })
}

export default globalErrorHandler