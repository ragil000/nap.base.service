exports.shortMonth = (numberMonth, languageMonth = 'en') => {
    let nameMonth
    if(languageMonth === 'en') {
        nameMonth = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "June", "July", "Aug",
            "Sept", "Nov", "Oct", "Dec"
        ]
    }
    return nameMonth[numberMonth-1]
}

exports.mongooseTimestampToGMT = (mongooseTimestamp, type = 'short', timezone = 'Asia/Jakarta') => {
    let newDateTime = mongooseTimestamp.toLocaleString('en-US', {timeZone: timezone})
    let newDate = newDateTime.split(',')[0].split('/')
    let newTime = newDateTime.split(',')[1].split(' ')
    if(type === 'short') {
        return `${exports.shortMonth(parseInt(newDate[0]))} ${newDate[1]}, ${newDate[2]}|${newTime[1]}`
    }
}

exports.javascriptTimestampToDate = (timestamp, increment = 2) => {
    let newDate
    newDate = new Date(timestamp)

    return `${exports.shortMonth(newDate.getMonth()+increment)} ${newDate.getDate()}, ${newDate.getFullYear()}|${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`
}