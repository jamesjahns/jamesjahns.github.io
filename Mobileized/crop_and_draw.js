let module;

import('./secret_code_no_looky.js').then( (m) => module=m);

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'darkgray';

const WIDTH = 200;
const HEIGHT = 300;

function drawFour(imgs)
{
    drawImgAt(imgs[0],0,0,WIDTH/2,HEIGHT/2);
    drawImgAt(imgs[1],WIDTH/2,0,WIDTH/2,HEIGHT/2);
    drawImgAt(imgs[2],0,HEIGHT/2,WIDTH/2,HEIGHT/2);
    drawImgAt(imgs[3],WIDTH/2,HEIGHT/2,WIDTH/2,HEIGHT/2);
}
function drawFive(imgs)
{
    drawImgAt(imgs[0],0,0,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[1],WIDTH/2,0,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[2],0,HEIGHT/3,WIDTH,HEIGHT/3);
    drawImgAt(imgs[3],0,2 * HEIGHT/3,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[4],WIDTH/2,2 * HEIGHT/3,WIDTH/2,HEIGHT/3);
}
function drawSix(imgs)
{
    drawImgAt(imgs[0],0,0,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[1],WIDTH/2,0,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[2],0,HEIGHT/3,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[3],WIDTH/2,HEIGHT/3,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[4],0,2 * HEIGHT/3,WIDTH/2,HEIGHT/3);
    drawImgAt(imgs[5],WIDTH/2,2 * HEIGHT/3,WIDTH/2,HEIGHT/3);
}

function drawImgAt(img,x,y,width,height)
{
    ctx.drawImage(img,x,y,width,height,x,y,width,height);
}

function clearImg()
{
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    ctx.fillRect(0,0,WIDTH,HEIGHT);
}

function loadImg(url) {
    return new Promise((success) => {
            let imageObj = new Image();
            imageObj.onload = () => success(imageObj);
            imageObj.src = url;
        }
    );
}

document.getElementById("opening").volume = 0.3;

function reroll() {
    document.getElementById("opening").play();
    document.getElementById("blurb").innerText="What could it be???";
    document.getElementById("name").innerText = "";

    document.getElementById("rolling").style.display = "block";
    document.getElementById("canvas").style.display = "none";
    document.getElementById("reroll").style.display = "none";

    setTimeout(newChar, 2000);
}

function newChar() {
    const imgs=[];
    const charName = module.rollNewChar(imgs);

    document.getElementById("name").innerText = charName;

    const promises = imgs.map(img => loadImg(img));

    Promise.all(promises).then( (images) => {
        document.getElementById("rolling").style.display = "none";
        document.getElementById("canvas").style.display = "block";
        document.getElementById("reroll").style.display = "block";

        clearImg();
        document.getElementById("blurb").innerText="Congrats! You found...";
        if(images.length === 4) {
            drawFour(images);
        }
        else if(images.length === 5)
        {
            drawFive(images);
        }
        else 
        {
            drawSix(images);
        }
    
    });
}