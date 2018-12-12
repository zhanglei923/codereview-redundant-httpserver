axios.get('/data/load-all-linesdata')
  .then(function (response) {
    console.log(response.data.data.length);
    // console.log(response.status);
    // console.log(response.statusText);
    // console.log(response.headers);
    // console.log(response.config);
    do_display(response.data)
  });
let rpt = ''
let itemwidth = 0;
let gtaskId;
let gfmap;
let do_display = (data)=>{
    let arr = data.data;
    let fmap = data.fmap;
    let taskId = data.taskId;
    gtaskId=taskId;
    gfmap = fmap;
    console.log(taskId)
    let html = '';
    let totalleft = 0;
    let maxheight = 0;
    for(let i=0, len=arr.length;i<len;i++){
        let item = arr[i];
        if(i< 100) {
            itemwidth = 8;
        }
        if(i >= 100 && i< 1000) itemwidth = 3;
        if(i< 200) {
            rpt += `<a href="javascript:void(0);" linenum="${item.linenum}" onclick="checkLinenum(event)">${item.linenum}</a>,`
        }
        let width = item.count * 1;
        let left = totalleft;
        let height = item.linenum;
        if(height>maxheight)maxheight = height + 100;
        totalleft += width;
        html = html + `<div class="line" style="width:${width+itemwidth}px;left:${left}px;bottom:${height}px;"></div>`

        let stopnum = 50;
        if(item.linenum<stopnum) {
          html = html + `<div class="line" style="width:${width+itemwidth}px;left:${left}px;bottom:${height}px;background-color:yellow;height:130px;">小于${stopnum}的不显示了</div>`
          break;
        }
    }
    let chartElem = document.getElementById('chart')
    chartElem.innerHTML = html;
    chartElem.style.height = maxheight+'px'
    chartElem.style.width = totalleft+'px'

    document.getElementById('info').innerHTML = rpt
}
let checkLinenum = (e)=>{
  let a = e.target;
  let linenum = a.getAttribute('linenum');
  
  axios.get(`/query/get-pair-by-linenum?linenum=${linenum}&taskId=${gtaskId}`)
  .then(function (response) {
    let pairs = response.data.data;
    console.log('linenum='+linenum+':')

    pairs.forEach((pair)=>{
      console.log('a:'+gfmap[pair.a].fpath);
      console.log('b:'+gfmap[pair.b].fpath);
    })
    
  });
}