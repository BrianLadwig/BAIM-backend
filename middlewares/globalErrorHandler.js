function globalErrorHandler(error, req, res, next) {
    console.log('from globalErrorHandler', error);
    if(error.status === 413) {
        return res.status(413).send({ errors: [{ image: 'File is too large'}]})
    }
    res.status(error.status || 500).send({
        errors: [error.errors] || ["Oops Something went wrong"]
    })
}

export default globalErrorHandler