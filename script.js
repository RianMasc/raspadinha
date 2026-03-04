// =============================
// ELEMENTOS
// =============================
const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const messageBox = document.getElementById("messageBox");
const nextBtn = document.getElementById("nextBtn");
const scratchSound = document.getElementById("scratchSound");

let tentativa = 1;
let raspagemFinalizada = false;

// =============================
// ARRAYS
// =============================
const tentativa1 = ["❤️","❤️","❌","❌","❌","🌸","💐","💋","🌸"];
const tentativa2 = ["💋","💋","💋","❤️","❌","🌸","💐","❤️","🌸"];
const tentativa3 = ["❤️","❤️","❤️","💋","🌸","💐","💋","🌸","💐"];

function shuffle(array){
  return array.sort(()=>Math.random()-0.5);
}

// =============================
// CRIA GRADE
// =============================
function createGrid(){

  raspagemFinalizada = false;
  grid.innerHTML = "";

  let emojis;

  if(tentativa === 1) emojis = shuffle([...tentativa1]);
  if(tentativa === 2) emojis = shuffle([...tentativa2]);
  if(tentativa === 3) emojis = shuffle([...tentativa3]);

  // Cria emojis primeiro
  emojis.forEach(emoji=>{
    const card = document.createElement("div");
    card.classList.add("card");

    const span = document.createElement("span");
    span.textContent = emoji;

    card.appendChild(span);
    grid.appendChild(card);
  });

  // =============================
  // CRIA UM CANVAS GIGANTE POR CIMA
  // =============================
  const canvas = document.createElement("canvas");
  canvas.width = grid.offsetWidth;
  canvas.height = grid.offsetHeight;
  canvas.style.position = "absolute";
  canvas.style.top = grid.offsetTop + "px";
  canvas.style.left = grid.offsetLeft + "px";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Textura realista
  const gradient = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  gradient.addColorStop(0,"#bbbbbb");
  gradient.addColorStop(1,"#888888");

  ctx.fillStyle = gradient;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<2000;i++){
    ctx.fillStyle="rgba(255,255,255,0.1)";
    ctx.fillRect(Math.random()*canvas.width,Math.random()*canvas.height,2,2);
  }

  let isDrawing = false;

  function scratch(x,y){
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x,y,25,0,Math.PI*2);
    ctx.fill();
  }

  function calcularRaspagem(){

    const pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
    const totalPixels = pixels.data.length / 4;

    let transparentes = 0;

    for(let i=3;i<pixels.data.length;i+=4){
      if(pixels.data[i] === 0){
        transparentes++;
      }
    }

    const porcentagem = (transparentes / totalPixels) * 100;

    if(porcentagem > 70 && !raspagemFinalizada){

      raspagemFinalizada = true;

      ctx.clearRect(0,0,canvas.width,canvas.height);

      setTimeout(()=>{
        showMessage();
      },600);
    }
  }

  // MOUSE
  canvas.addEventListener("mousedown",()=> isDrawing=true);
  canvas.addEventListener("mouseup",()=>{
    isDrawing=false;
    calcularRaspagem();
  });

  canvas.addEventListener("mousemove",(e)=>{
    if(!isDrawing || raspagemFinalizada) return;
    scratchSound.play();
    scratch(e.offsetX,e.offsetY);
  });

  // TOUCH
  canvas.addEventListener("touchstart",()=> isDrawing=true);
  canvas.addEventListener("touchend",()=>{
    isDrawing=false;
    calcularRaspagem();
  });

  canvas.addEventListener("touchmove",(e)=>{
    if(!isDrawing || raspagemFinalizada) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    scratch(x,y);
  });
}

// =============================
// MOSTRA MENSAGEM
// =============================
function showMessage(){

  let message="";

  if(tentativa === 1){
    message="Não foi dessa vez meu amor 💕 Tente novamente.";
  }

  if(tentativa === 2){
    message="Ops 😅 Também não foi dessa vez... mas dizem que a 3ª tentativa é a da sorte 🙃";
  }

  if(tentativa === 3){
    message="Parabéns!!! 💖 Você ganhou meu coração para sempre ✨";
    confetti();

    if(navigator.vibrate){
      navigator.vibrate([200,100,200,400]);
    }
  }

  overlay.classList.add("active");
  messageBox.textContent=message;

  if(tentativa < 3){
    nextBtn.style.display="inline-block";
  }
}

function confetti(){
  for(let i=0;i<60;i++){
    let heart=document.createElement("div");
    heart.textContent="❤️";
    heart.style.position="fixed";
    heart.style.left=Math.random()*100+"%";
    heart.style.top="-20px";
    heart.style.fontSize="20px";
    heart.style.animation="fall 3s linear forwards";
    document.body.appendChild(heart);
    setTimeout(()=>heart.remove(),3000);
  }
}

nextBtn.addEventListener("click",()=>{
  tentativa++;
  overlay.classList.remove("active");
  nextBtn.style.display="none";
  createGrid();
});

createGrid();