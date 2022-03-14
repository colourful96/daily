const lis = $('li');
let flag = false;

getData();
function getData(){
    if(!flag){
        flag = true;
        $.ajax({
            type: 'GET',
            url: './data.txt',
            success: function(res){
                setTimeout(() => {
                    addDom(res)
                }, 1000)
            },
            beforeSend:function(){
                $('.loading').show();
            }
        })
    }
}
function addDom(res){
    if(res){
        $('.loading').hide();
        const data = JSON.parse(res);
        data.forEach(ele => {
        const item = $('<div class="item"></div>');
        const imgBox = $('<div class="imgBox"></div>');
        const img = new Image();
        const p = $('<p></p>');
        img.src = ele.preview;
        p.text = ele.title;
        img.onload = function(){
            imgBox.append(img);
            item.append(imgBox).append(p);
            const index = getMinIndex(lis);
            $(lis[index]).append(item);
        }
        })
    }
    flag = false;
}

function getMinIndex(doms){
    let minHeight = parseInt($(doms[0]).css('height'));
    let index = 0;
    for(let i = 1; i < doms.length; i++){
        let height = parseInt($(doms[i]).css('height'));
        if(height < minHeight){
            minHeight = height;
            index = i;
        }
    }
    return index;
}

$(window).scroll(function(){
    const scrollTop = $(window).scrollTop();
    const clientHeight = $(window).height();
    const index = getMinIndex(lis);
    const pageHeight = parseInt($(lis[index]).css('height'));
    if(pageHeight < scrollTop + clientHeight){
        getData();
    }
})