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
    async getAverageRate(step, fromDate, toDate) {
        let data = []
        if(fromDate && toDate) {
           data = await  this.knex('rate').whereBetween('date',[fromDate, toDate])
           console.log(data)
        } else {
            data = await this.knex('rate').select()
        }
        if (step == 'week') {
            return this.sortAverageByWeek(data)
        }
        if (step == 'month') {
            return this.sortAverageByMonth(data)
        }
        if (step == 'year') {
            return this.sortAverageByYear(data)
        } else {
            return []
        }
    }
    sortAverageByYear(data) {
        let newData = []
        let i = 0
        while (i < data.length - 1) {
            let year = data[i].date.getFullYear()
            let sum = 0
            let count = 0
            while(data[i].date.getFullYear() == year && i < data.length-1){
                sum += data[i].value
                count++
                i++
            }
            newData.push([ year.toString(), sum/count])
        }
        return newData
    }
    sortAverageByWeek(data) {
        let newData = []
        let i = 0
        while (i < data.length - 1) {
            let week = data[i].date.getWeekNumber()
            let year = data[i].date.getFullYear()
            let sum = 0
            let count = 0
            do {
                sum += data[i].value
                count++
                i++
            }while(data[i].date.getWeekNumber() == week && i < data.length - 1)
            newData.push([week + ' неделя ' + year, sum/count])
        }
        return newData
    }

    sortAverageByMonth(data) {
        let newData = []
        let i = 0
        while (i < data.length-1) {
        let month = data[i].date.getMonth()
        let year = data[i].date.getFullYear() 
        let sum = 0
        let count = 0
        while(data[i].date.getMonth() == month && i < data.length-1){
            sum += data[i].value
            count++
            i++
        }
        newData.push([(month +1)  + '-' + year, sum/count])
    } 
    return newData
    }
}

Date.prototype.getWeekNumber = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
  }

module.exports = RateRepository