const express = require('express')
const app = express()
const RateRepository = require('./repo/rateRepository')
const rateRepository = new RateRepository()

app.use(express.json())
app.use('/', express.static('public'))

app.get('/api/rate', (request, responce) => {
    let from = request.query.from
    let to = request.query.to
    let step = request.query.step
    if(step) {
        return rateRepository.getAverageRate(step, from, to).then(result => {
            addSMA(result, 10)
            addSMA(result, 100)
            responce.status(200).json({data : result})
        }).catch(e => {responce.status(500).json({ msg : 'Что-то пошло не так'}); console.log(e.message)})
    }
    if(from && to) {
        rateRepository.getRate(from, to).then(result => {
            addSMA(result, 10)
            addSMA(result, 100)
            responce.status(200).json({data : result})
        }).catch(e => {
            console.log(e.message)
            responce.status(500).json({msg : "somethig went wrong"})
        })
    } else {
        rateRepository.getAllRate().then(result => {
            addSMA(result, 10)
            addSMA(result, 100)
            responce.status(200).json({data : result})
        })
    }
})

const addSMA = (data, value) => {
        if(data.length <= value)
            return
        for (let i = 0; i < value - 1 ; i++) {
            data[i].push(null)
        }
        for(let i = value - 1; i < data.length; i++) {
            let sum = 0;
            for(let j = i - value + 1; j < i+1; j++) {
                sum += data[j][1]
            }
            data[i].push(sum / value).toFixed(3)
        }
}

app.listen(8080, () => console.log('Run'))