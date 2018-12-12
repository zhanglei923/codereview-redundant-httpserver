let fs = require('fs')
const express = require('express')
let loadData = require('./loadData')



const app = express()
const port = 3005

app.get('/data/load-all-linesdata', function (req, res) {
    let arr = loadData.load(taskId)
    res.json(arr)
  })
app.use(express.static('website'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

let taskId = 'tasks_20181212_031656-871897924093_report'

// fs.writeFileSync('./a.json', JSON.stringify(arr))

