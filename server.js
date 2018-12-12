let eachcontent = require('eachcontent-js')
let fs = require('fs')
let pathutil = require('path')

eachcontent.eachContent('D:/workspaces/codereview-redundant-reports/tasks_20181212_031656-871897924093_report',[/./], (str, path)=>{
    //console.log(str, path)
})
let taskRootPath = pathutil.resolve(__dirname, '../codereview-redundant-tasks')
let folders = eachcontent.getAllFolders(taskRootPath)

let taskId = 'tasks_20181212_031656-871897924093_report'
let taskPath = pathutil.resolve(taskRootPath, `./${taskId}`)
let tasklist = {}
eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
    let pathinfo = pathutil.parse(path);
    let filename = pathinfo.name;
    let taskname = filename;

    let arr = txt.split(',');
    arr.forEach((item)=>{
        let a = item.split(':')[0];
        let b = item.split(':')[1];
        let linenum = b.split('=')[1]
        b = item.split('=')[0];
        //console.log(a,b,linenum)
        if(typeof tasklist[''+linenum] === 'undefined') tasklist[''+linenum] = 0;
        tasklist[''+linenum]++
    })
})
let arr = []
for(let linenum in tasklist){
    arr.push({
        linenum: parseInt(linenum),
        count: tasklist[linenum]
    })
}
arr.sort().reverse();
fs.writeFileSync('./a.json', JSON.stringify(arr))
console.log(folders)