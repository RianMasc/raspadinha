// =============================
// PEGANDO ELEMENTOS DO HTML
// =============================
const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");
const messageBox = document.getElementById("messageBox");
const nextBtn = document.getElementById("nextBtn");
const scratchSound = document.getElementById("scratchSound");

// =============================
// CONTROLE DE TENTATIVA
// =============================
let tentativa = 1;

// =============================
// ARRAYS CONTROLADOS DE EMOJIS
// =============================
const tentativa1 = ["❤️","❤️","❌","❌","❌","🌸","💐","💋","🌸"];
const tentativa2 = ["💋","💋","💋","❤️","❌","🌸","💐","❤️","🌸"];
const tentativa3 = ["❤️","❤️","❤️","💋","🌸","💐","💋","🌸","💐"];

// =============================
// FUNÇÃO PARA EMBARALHAR ARRAY
// =============================
function shuffle(array){
  return array.sort(()=>Math.random()-0.5);
}

// =============================
// CRIA A GRADE 3x3
// =============================
function createGrid(){
  grid.innerHTML = "";

  let emojis;

  if(tentativa === 1) emojis = shuffle([...tentativa1]);
  if(tentativa === 2) emojis = shuffle([...tentativa2]);
  if(tentativa === 3) emojis = shuffle([...tentativa3]);

  emojis.forEach(emoji => {

    const card = document.createElement("div");
    card.classList.add("card");

    const span = document.createElement("span");
    span.textContent = emoji;
    card.appendChild(span);

    const canvas = document.createElement("canvas");
    canvas.width = 110;
    canvas.height = 110;
    card.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    // =============================
    // CRIA TEXTURA REALISTA
    // =============================

    const gradient = ctx.createLinearGradient(0,0,110,110);
    gradient.addColorStop(0,"#bbbbbb");
    gradient.addColorStop(1,"#888888");

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i=0;i<600;i++){
      ctx.fillStyle="rgba(255,255,255,0.15)";
      ctx.fillRect(Math.random()*110,Math.random()*110,2,2);
    }

    // =============================
    // CONTROLE DE RASPAGEM
    // =============================

    let isDrawing = false;      // controla se está raspando
    let raspagemFinalizada = false; // bloqueia após 70%

    function scratch(x,y){
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x,y,18,0,Math.PI*2);
      ctx.fill();
    }

    // =============================
    // FUNÇÃO PARA CALCULAR %
    // =============================

    function calcularRaspagem(){

      // Pega os pixels do canvas
      const pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
      const totalPixels = pixels.data.length / 4; // cada pixel tem 4 valores (RGBA)

      let transparentes = 0;

      // Percorre apenas o canal alpha (opacidade)
      for(let i=3; i<pixels.data.length; i+=4){
        if(pixels.data[i] === 0){
          transparentes++;
        }
      }

      const porcentagem = (transparentes / totalPixels) * 100;

      // Se passou de 70% e ainda não foi finalizado
      if(porcentagem > 70 && !raspagemFinalizada){

        raspagemFinalizada = true; // bloqueia novas raspagens

        // Remove o restante do canvas automaticamente
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Mostra mensagem após pequena pausa dramática
        setTimeout(()=>{
          showMessage();
        },600);
      }
    }

    // =============================
    // EVENTOS MOUSE
    // =============================

    canvas.addEventListener("mousedown",()=>{
      if(raspagemFinalizada) return;
      isDrawing = true;
    });

    canvas.addEventListener("mouseup",()=>{
      isDrawing = false;
      calcularRaspagem(); // verifica ao soltar
    });

    canvas.addEventListener("mousemove",(e)=>{
      if(!isDrawing || raspagemFinalizada) return;
      scratchSound.play();
      scratch(e.offsetX,e.offsetY);
    });

    // =============================
    // EVENTOS TOUCH (CELULAR)
    // =============================

    canvas.addEventListener("touchstart",(e)=>{
      if(raspagemFinalizada) return;
      isDrawing = true;
    });

    canvas.addEventListener("touchend",()=>{
      isDrawing = false;
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

    grid.appendChild(card);
  });
}

// =============================
// MOSTRAR MENSAGEM FINAL
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
    message="Parabéns!!! 💖 Você ganhou meu coração, não só hoje, mas para tooodo o sempre ✨";
    confetti();

    // =============================
    // VIBRAÇÃO NO CELULAR
    // =============================
    // Só funciona se o navegador permitir
    if(navigator.vibrate){
      navigator.vibrate([200,100,200,100,400]);
    }
  }

  overlay.classList.add("active");
  messageBox.textContent = message;

  if(tentativa < 3){
    nextBtn.style.display="inline-block";
  }
}

// =============================
// CONFETE
// =============================
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

// =============================
// BOTÃO PRÓXIMA TENTATIVA
// =============================
nextBtn.addEventListener("click",()=>{
  tentativa++;
  overlay.classList.remove("active");
  nextBtn.style.display="none";
  createGrid();
});

// Inicializa
createGrid();