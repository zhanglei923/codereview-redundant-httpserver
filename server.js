let fs = require('fs')
const express = require('express')
var URL = require('url');
let loadData = require('./util/loadData')



const app = express()
const port = 3005

let taskId = 'tasks_20181212_031656-871897924093_report'
app.get('/data/load-all-linesdata', function (req, res) {
    let arr = loadData.loadTask(taskId)
    let fmap = loadData.loadFileMap(taskId)
    res.json({
      data: arr,
      fmap,
      taskId
    })
  })

  app.get('/query/get-pair-by-linenum', function (req, res) {
    var url = req.url;
    var urlInfo = URL.parse(url, true);
    var linenum = urlInfo.query.linenum;
    var taskId = urlInfo.query.taskId;

    let pairs = loadData.loadPairsByLineNum(taskId, linenum);
    console.log(taskId, linenum, pairs)
    res.json({
      data: pairs
    })
  })
app.use(express.static('website'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


// fs.writeFileSync('./a.json', JSON.stringify(arr))

