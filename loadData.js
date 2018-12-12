let eachcontent = require('eachcontent-js')
let _ = require('lodash')
let pathutil = require('path')

let taskRootPath = pathutil.resolve(__dirname, '../codereview-redundant-tasks')
let folders = eachcontent.getAllFolders(taskRootPath)
const thisUtil = {
    load: (taskId) =>{

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
        arr = _.sortBy(arr, 'linenum');
        arr.reverse()
        return arr;
    }
}
module.exports = thisUtil;