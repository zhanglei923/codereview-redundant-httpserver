axios.get('/data/load-all-linesdata')
  .then(function (response) {
    console.log(response.data.length);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
    do_display(response.data)
  });

let itemwidth = 0;
let do_display = (arr)=>{
    let html = '';
    let totalleft = 0;
    let maxheight = 0;
    arr.forEach((item, i)=>{
        if(i< 100) itemwidth = 8;
        if(i >= 100 && i< 1000) itemwidth = 3;
        let width = item.count * 1;
        let left = totalleft;
        let height = item.linenum;
        if(height>maxheight)maxheight = height + 100;
        totalleft += width;
        html = html + `<div class="line" style="width:${width+itemwidth}px;left:${left}px;bottom:${height}px;"></div>`
    })
    let chartElem = document.getElementById('chart')
    chartElem.innerHTML = html;
    chartElem.style.height = maxheight+'px'
    chartElem.style.width = totalleft+'px'

}