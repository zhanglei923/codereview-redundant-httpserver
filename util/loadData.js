let eachcontent = require('eachcontent-js')
let fs = require('fs')
let _ = require('lodash')
let pathutil = require('path')

let taskRootPath = pathutil.resolve(__dirname, '../../codereview-redundant-tasks')
let folders = eachcontent.getAllFolders(taskRootPath)
const thisUtil = {
    loadPairsByLineNumList:(taskId, linenumlist)=>{
        let taskPath = thisUtil.getTaskPath(taskId);
        let result = []
        //console.log('linenum', linenum)
        eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
            let pathinfo = pathutil.parse(path);

            let arr = txt.split(',');
            arr.forEach((str)=>{
                let item = thisUtil.parseItem(str)
                let a = item.a;
                let b = item.b;
                //console.log(linenum, item.linenum)
                linenumlist.forEach((linenum)=>{
                    if(parseInt(item.linenum) === parseInt(linenum)) result.push({
                        linenum: parseInt(linenum),
                        result: {a, b}
                    })
                })
            })
        })
        result = _.sortBy(result, 'linenum').reverse()
        return result;

        let arr = [];
        linenumlist.forEach((linenum)=>{
            let result = thisUtil.loadPairsByLineNum(taskId, linenum);
            arr.push({
                linenum,
                result
            })
        })
        return arr;
    },
    loadPairsByLineNum: (taskId, linenum)=>{
        let taskPath = thisUtil.getTaskPath(taskId);
        let result = []
        console.log('linenum', linenum)
        eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
            let pathinfo = pathutil.parse(path);

            let arr = txt.split(',');
            arr.forEach((str)=>{
                let item = thisUtil.parseItem(str)
                let a = item.a;
                let b = item.b;
                //console.log(linenum, item.linenum)
                if(parseInt(item.linenum) === parseInt(linenum)) result.push({a, b})
            })
        })
        return result;
    },
    getTaskPath:(taskId)=>{
        return pathutil.resolve(taskRootPath, `./${taskId}`);
    },
    loadFileMap:(taskId)=>{
        let taskPath = thisUtil.getTaskPath(taskId);
        let fmap = fs.readFileSync(pathutil.resolve(taskPath, `./fmap`),'utf8')
        fmap = JSON.parse(fmap);
        return fmap;
    },
    parseItem:(item)=>{
        let a = item.split(':')[0];
        let b = item.split(':')[1];
        let linenum = b.split('=')[1]
        b = b.split('=')[0];
        return {
            a,b,linenum
        }
    },
    loadTaskIds: () =>{
        return eachcontent.getAllFolders(taskRootPath)
    },
    loadTask: (taskId) =>{
        let taskPath = thisUtil.getTaskPath(taskId);
        let linenumMap = {}
        eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
            let pathinfo = pathutil.parse(path);
            let filename = pathinfo.name;
            let taskname = filename;

            let arr = txt.split(',');
            arr.forEach((str)=>{
                let item = thisUtil.parseItem(str)
                let a = item.a;
                let b = item.b;
                let linenum = item.linenum;
                if(typeof linenumMap[''+linenum] === 'undefined') linenumMap[''+linenum] = 0;
                linenumMap[''+linenum]++
            })
        })
        let arr = []
        for(let linenum in linenumMap){
            arr.push({
                linenum: parseInt(linenum),
                count: linenumMap[linenum]
            })
        }
        arr = _.sortBy(arr, 'linenum');
        arr.reverse()
        return arr;
    }
}
module.exports = thisUtil;