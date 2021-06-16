module.exports = (request, response, next) => {
    const apiKey = request.headers['x-api-key'] || null
    if(apiKey !== process.env.API_KEY) {
        return response.status(403).json({
            status: false,
            message: 'Access denied, API KEY not valid'
        })
    }
    next()
}