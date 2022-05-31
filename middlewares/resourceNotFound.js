import createError from 'http-errors'

function resourceNotFound(req, res, next) {
    next(
        createError(404, `Resource ${req.method} ${req.url} not found`)
    )
}

export default resourceNotFound 