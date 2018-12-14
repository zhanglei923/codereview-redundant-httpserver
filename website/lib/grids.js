let showGrids=(ratio_y)=>{
    let arr = [100, 300, 500, 1000, 1500]
    let html = ''
    arr.forEach((item)=>{
        let h = item/ratio_y;
        if(h<1) h=1;
        html += `<div class="gridx heightof${item}" style="bottom:${h}px;"></div>`
        
    })
    let chart = document.getElementById('chart')
    chart.innerHTML += html
}