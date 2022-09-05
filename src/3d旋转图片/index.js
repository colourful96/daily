init()
function init(){
    const box = document.querySelector('.box');
    const imgs = box.children;
    const length = imgs.length;
    const deg = 360 / length;
    for(let i = 0; i < length; i++){
        imgs[i].style.transform = `rotateY(${i * deg}deg) translateZ(350px)`;
        imgs[i].style.transition = `transform 1s ${(length - 1 - i) * 0.1}s`;
    }
    bindEvent();
}

function bindEvent(){
    const box = document.querySelector('.box');
    let lastX, lastY, nowX, nowY, disX = 0, disY = 0, roY = 0, roX = -10;
    const body = document.body;
    let timer = null;
    body.onmousedown = function(event){
        clearInterval(timer);
        lastX = event.clientX;
        lastY = event.clientY;
        body.onmousemove = function(event){
            nowX = event.clientX;
            nowY = event.clientY;
            disX = nowX - lastX;
            disY = nowY - lastY;
            roY += disX * 0.2;
            roX -= disY * 0.2;
            box.style.transform = `rotateX(${roX}deg) rotateY(${roY}deg)`;
            box.style.cursor = 'move';
            lastX = nowX;
            lastY = nowY;
        }
        body.onmouseup = function(){
            body.onmousemove = null;
            clearInterval(timer);
            timer = setInterval(() => {
                disX *= 0.98;
                disY *= 0.98;
                roX -= disY * 0.2;
                roY += disX * 0.2;
                box.style.transform = `rotateX(${roX}deg) rotateY(${roY}deg)`;
                box.style.cursor = 'pointer';
                if(Math.abs(disX) < 0.1 && Math.abs(disY) < 0.1){
                    clearInterval(timer);
                }
            }, 20)
        }
        return false;
    }
}