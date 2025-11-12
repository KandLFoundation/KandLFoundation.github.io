const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particlesArray = [];
let mouse = { x: null, y: null, radius: 150 };

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Mouse movement
window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener("mouseout", function() {
  mouse.x = null;
  mouse.y = null;
});

// Particle class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  update() {
    // Bounce off edges
    if(this.x + this.size > canvas.width || this.x - this.size < 0)
      this.directionX = -this.directionX;
    if(this.y + this.size > canvas.height || this.y - this.size < 0)
      this.directionY = -this.directionY;

    this.x += this.directionX;
    this.y += this.directionY;

    // Mouse interaction
    if(mouse.x && mouse.y) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if(distance < mouse.radius + this.size) {
        this.x -= dx/20;
        this.y -= dy/20;
      }
    }

    this.draw();
  }
}

// Initialize particles
function initParticles() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 8000;
  for(let i=0; i<numberOfParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * (canvas.width - size*2) + size;
    let y = Math.random() * (canvas.height - size*2) + size;
    let directionX = (Math.random() * 1) - 0.5;
    let directionY = (Math.random() * 1) - 0.5;
    let color = "rgba(26,115,232,0.7)";
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}
initParticles();

// Connect particles with lines
function connectParticles() {
  for(let a=0; a<particlesArray.length; a++) {
    for(let b=a; b<particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      if(distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(26,115,232,${1 - distance/150})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Create new particles on click
canvas.addEventListener("click", function(event) {
  const clickParticles = 8;
  for(let i=0; i<clickParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = event.x + (Math.random()*20 - 10);
    let y = event.y + (Math.random()*20 - 10);
    let directionX = (Math.random() * 1) - 0.5;
    let directionY = (Math.random() * 1) - 0.5;
    let color = "rgba(26,115,232,0.9)";
    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particlesArray.forEach(particle => particle.update());
  connectParticles();
}
animate();
