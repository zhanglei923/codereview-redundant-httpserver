axios.get(`/query/all-tasks-id`)
.then(function (response) {
  console.log(response.data);
  let html = ''
  let data = response.data.data.reverse();
  data.forEach((taskId)=>{
    html +=  `<option value="${taskId}">${taskId}</option>`
  })
  document.getElementById('reports').innerHTML = html;
});
document.getElementById('showChartBtn').addEventListener('click', function() {
    let taskId = document.getElementById('reports').value;
    loadChart(taskId)
});

let loadChart = (taskId) =>{
  axios.get(`/query/task-report?taskId=${taskId}`)
    .then(function (response) {
      console.log(response.data.data.length);
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(response.headers);
      // console.log(response.config);
      do_display(response.data)
    });

}
let ZOOM_RATIO_X = 20;
let ZOOM_RATIO_Y = 7;

let unAcceptableLines = []
let itemwidth = 0;
let gfmap={};
let dataOffsetX = 0;
let do_display = (data)=>{
    let arr = data.data;
    let fmap = data.fmap;
    let taskId = data.taskId;
    gfmap[taskId] = fmap;
    console.log(taskId)
    let totalleft = 0;
    let screenHeight = 0;

    let ignoreLinenum = 50;
    let currentBottom = ignoreLinenum;
    let infoArr = []
    for(let i=arr.length-1, len=0;i>=len;i--){
        let item = arr[i];
        if(item.linenum<ignoreLinenum) {continue;}        
        if(i < 15) {
            unAcceptableLines.push(item.linenum)
        }
        
        let fakeCount = item.count;
        let width = fakeCount / ZOOM_RATIO_X;
        if(width < 1) width = 1;
        let fakeLinenum = item.linenum;
        fakeLinenum = fakeLinenum / ZOOM_RATIO_Y
        if(fakeLinenum < 1) fakeLinenum = 1;
        let bottom = currentBottom;
        let top = fakeLinenum;
        let height = top - bottom;
        currentBottom = top;
        

        let left = totalleft;

        let totalheigh = bottom + height;
        if(totalheigh>screenHeight)screenHeight = totalheigh;
        totalleft += width;
        //infoArr.push(`<div class="line" linenum="${item.linenum}" style="width:${width+itemwidth}px;left:${left}px;height:${height}px;bottom:${bottom}px;"></div>`);
        infoArr.push({
            fakeLinenum,
            fakeCount,
            linenum: item.linenum,
            width,
            left,
            height,
            bottom,
        })
    }
    infoArr = infoArr.reverse()
    infoArr.forEach((item, i)=>{
        // if(i< 100) item.width += 18;
        // if(i >= 100 && i< 1000) item.width += 9;
        item.left = Math.abs(totalleft - item.left)//反转
        item.left += dataOffsetX;
        //if(item.height < 10) item.height = 10
    })
    let html = '';
    infoArr.forEach((item, i)=>{
        let warnclass = ''
        if(item.linenum>1000) {
          warnclass = 'fatal10';
        }else if(item.linenum <=1000 && item.linenum>600) {
          warnclass = 'fatal6';
        }else if(item.linenum <=600 && item.linenum>300) {
          warnclass = 'fatal3';
        }else if(item.linenum <=300 && item.linenum>100) {
          warnclass = 'fatal1';
        }
        html += `<div class="line ${warnclass}" linenum="${item.linenum}" style="width:${item.width}px;left:${item.left}px;height:${item.height}px;bottom:${item.bottom}px;"></div>`
    })

    let chartElem = document.getElementById('chart')
    chartElem.innerHTML += html;
    let newheight = (screenHeight+10)
    let oldheight = parseInt(chartElem.style.height);
    //console.log(oldheight, newheight)
    if(!isNaN(oldheight) && oldheight < newheight){
      chartElem.style.height = newheight +'px'
    }else
    if(isNaN(oldheight)) chartElem.style.height = newheight +'px'
    // if(parseInt(chartElem.style.width)< totalleft)chartElem.style.width = totalleft+'px'
    //chartElem.style.height = (screenHeight+10)+'px'
    chartElem.style.width = totalleft+'px'
    dataOffsetX += 2;

    //document.getElementById('info').innerHTML = unAcceptableLines.reverse().join(',')
    do_showUnAcceptables(taskId, unAcceptableLines.reverse(), fmap)
}
do_showUnAcceptables=(taskId, lines, fmap)=>{
  
  axios.get(`/query/get-pairs-by-linenumlist?linenumlist=${lines.join(',')}&taskId=${taskId}`)
  .then(function (response) {
    let pairlist = response.data.data;
    //console.log('pairs='+':', pairlist.length)

    let html = '<table border="1"><tbody>';
    pairlist.forEach((one, i)=>{
      let linenum = one.linenum;
      //console.log('one', one)
      let pair = one.result;
      //one.result.forEach((pair)=>{
        //console.log(linenum, pairs)
        html += `
          <tr>
            <td>${i})${linenum}</td>
            <td>
              <div class="pathname">${fmap[pair.a].fpath}</div>
              <div class="pathname">${fmap[pair.b].fpath}</div>
            </td>
          </tr>
        `
    })
    html+='</tbody></table>'
    //console.log(html)
    let summaryTables = document.getElementById('summaryTables');
    summaryTables.innerHTML = summaryTables.innerHTML + html;
    
  });

}
let checkLinenum = (e)=>{
  let a = e.target;
  let linenum = a.getAttribute('linenum');
  
  axios.get(`/query/get-pair-by-linenum?linenum=${linenum}&taskId=${gtaskId}`)
  .then(function (response) {
    let pairs = response.data.data;
    console.log('linenum='+linenum+':')

    let fmap = gfmap[taskId]
    pairs.forEach((pair)=>{
      console.log('a:'+fmap[pair.a].fpath);
      console.log('b:'+fmap[pair.b].fpath);
    })
    
  });
}
showGrids(ZOOM_RATIO_Y)
//let gtaskId = ;
// loadChart('tasks_web2017-11_report')
// loadChart('tasks_web2018-12_report')