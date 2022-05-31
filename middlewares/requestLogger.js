function requestLogger(req, res, next) {
    console.log(`[Req] ${req.method} ${req.originalUrl}`)
    next()
}


export default requestLogger 