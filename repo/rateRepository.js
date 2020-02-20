class RateRepository {
    constructor() {
        this.knex = require('knex')({
            client : "mysql",
            version : "8.0.18",
            connection: {
                host : "127.0.0.1",
                user : "curse",
                password :"knex",
                database : "exchange_rate"
            }
        })
    }
    getRate(fromDate, toDate) {
        return new Promise((resolve, reject) => {
            this.knex('rate').whereBetween('date',[fromDate, toDate]).then(result => {
                const updatedResult = result.map(elem => {
                    let day = elem.date.getDate()
                    let month = elem.date.getMonth() + 1
                    if(day < 10) {
                        day = '0' + day
                    }
                    if(month < 10) {
                       month = '0' + month
                   }
                    const newDate =day + '-' + month + '-' + elem.date.getUTCFullYear()
                    return [newDate, elem.value]
                })
                resolve(updatedResult)
            })
        })
    }
    getAllRate() {
        return new Promise((resolve, reject) => {
            this.knex('rate').select().then(result => {
             const updatedResult = result.map(elem => {
                 let day = elem.date.getDate()
                 let month = elem.date.getMonth() + 1
                 if(day < 10) {
                     day = '0' + day
                 }
                 if(month < 10) {
                    month = '0' + month
                }
                 const newDate =day + '-' + month + '-' + elem.date.getUTCFullYear()
                 return [ newDate, elem.value]
             })
             resolve(updatedResult)
        })
        })
    }
}
module.exports = RateRepository