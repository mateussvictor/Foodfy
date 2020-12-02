// module.exports = {
  
//   date(timestamp) {
//     const date = new Date(timestamp)

//     const year = date.getFullYear()
//     const month = `0${date.getMonth() + 1}`.slice(-2)
//     const day = `0${date.getDate()}`.slice(-2)
//     const hour = date.getHours()
//     const minutes = date.getMinutes()

//     return {
//         day,
//         month,
//         year,
//         hour,
//         minutes,
//         iso: `${year}-${month}-${day}`,
//         format: `${day}/${month}/${year}`,
//     }
//   }
// }

module.exports = {

    date(timestamp) {
    const date = new Date(timestamp)

    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    const hour = date.getHours()
    const minutes = date.getMinutes()

    return {
        day,
        month,
        year,
        hour,
        minutes,
        iso: `${year}-${month}-${day}`,
        format: `${day}/${month}/${year}`,
    }
  },

  randomPassword(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }  
}