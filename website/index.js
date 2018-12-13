let loadChart = (taskId) =>{
  axios.get(`/data/load-all-linesdata?taskId=${taskId}`)
    .then(function (response) {
      console.log(response.data.data.length);
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(response.headers);
      // console.log(response.config);
      do_display(response.data)
    });

}
let rpt = []
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
        if(i< 200) {
            rpt.push(`<a href="javascript:void(0);" linenum="${item.linenum}" onclick="checkLinenum(event)">${item.linenum}</a>`)
        }
        let bottom = currentBottom;
        let top = item.linenum;
        let height = top - bottom;
        currentBottom = top;


        let width = item.count * 1;
        let left = totalleft;

        let totalheigh = bottom + height;
        let linenum = item.linenum;
        if(totalheigh>screenHeight)screenHeight = totalheigh;
        totalleft += width;
        //infoArr.push(`<div class="line" linenum="${item.linenum}" style="width:${width+itemwidth}px;left:${left}px;height:${height}px;bottom:${bottom}px;"></div>`);
        infoArr.push({
            linenum: item.linenum,
            width,
            left,
            height,
            bottom,
        })
    }
    infoArr = infoArr.reverse()
    infoArr.forEach((item, i)=>{
        if(i< 100) item.width += 18;
        if(i >= 100 && i< 1000) item.width += 9;
        item.left = Math.abs(totalleft - item.left)//反转
        item.left += dataOffsetX;
        if(item.height < 10) item.height = 10
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
    chartElem.style.height = (screenHeight+10)+'px'
    chartElem.style.width = totalleft+'px'

    dataOffsetX += 20;

    document.getElementById('info').innerHTML = rpt.reverse().join(',')
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
//let gtaskId = ;
loadChart('tasks_web2017-11_report')
loadChart('tasks_web2018-12_report')