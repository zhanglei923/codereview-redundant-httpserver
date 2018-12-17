let eachcontent = require('eachcontent-js')
let fs = require('fs')
let _ = require('lodash')
let pathutil = require('path')

let taskRootPath = pathutil.resolve(__dirname, '../../codereview-redundant-tasks')
let folders = eachcontent.getAllFolders(taskRootPath)
const thisUtil = {
    loadPairsByLineNumList:(taskId, linenumlist)=>{        
        linenumlist = _.uniq(linenumlist)
        let taskPath = thisUtil.getTaskPath(taskId);
        let result = []
        //console.log('linenum', linenum)
        eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
            let pathinfo = pathutil.parse(path);
            let ok = false;
            for(let i=0;i<linenumlist.length;i++){
                if(txt.indexOf('='+linenumlist[i])>=0) {
                    ok = true;
                    break;
                }
            }
            if(ok){
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
            }
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
        let cachedfilepath = pathutil.resolve(taskPath, './_cacheof_loadTask')
        if(fs.existsSync(cachedfilepath)){
            return JSON.parse(fs.readFileSync(cachedfilepath))
        }
        let linenumMap = {}
        let distributionMap = {}
        eachcontent.eachContent(taskPath, [/^task/], (txt, path)=>{
            let pathinfo = pathutil.parse(path);
            let filename = pathinfo.name;
            let taskname = filename;
            let tasknum = parseInt(taskname.replace(/task/g, ''))
            let tasknum32 = tasknum.toString(32)

            let arr = txt.split(',');
            arr.forEach((str)=>{
                let item = thisUtil.parseItem(str)
                let a = item.a;
                let b = item.b;
                let linenum = item.linenum;
                if(typeof linenumMap[''+linenum] === 'undefined') linenumMap[''+linenum] = 0;
                linenumMap[''+linenum]++
                if(typeof distributionMap[''+linenum] === 'undefined') distributionMap[''+linenum] = [];
                if(linenum>12)distributionMap[''+linenum].push(tasknum32)
            })
        })
        let arr = []
        for(let linenum in linenumMap){
            arr.push({
                linenum: parseInt(linenum),
                count: linenumMap[linenum],
                files32: _.uniq(distributionMap[linenum]).join(',')
            })
        }
        arr = _.sortBy(arr, 'linenum');
        arr.reverse()
        fs.writeFileSync(cachedfilepath, JSON.stringify(arr))
        return arr;
    }
}
module.exports = thisUtil;