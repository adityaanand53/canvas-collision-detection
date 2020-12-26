import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = ["#2185C5", "#7ECEFD", "red", "#FF7F66"];

addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

class Particle {
  constructor(x, y, mass, opacity, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.mass= mass;
    this.opacity = opacity;
    this.velocity = {
      x: utils.randomIntFromRange(-2.5, 2.5),
      y: utils.randomIntFromRange(-2.5, 2.5)
    };
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update() {
    for (let i = 0; i < particles.length; i++) {
      if(this !== particles[i]) {
        if((utils.distance(this.x, this.y, particles[i].x, particles[i].y) - (2 * this.radius)) <= 0) {
          utils.resolveCollision(this, particles[i])
        }
      }
    }
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y;
    }
    if(utils.distance(mouse.x, mouse.y, this.x, this.y) <=100 && this.opacity < 0.2) {
     this.opacity += 0.02;
    } else if(this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

let particles;
function init() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    const radius = 20;
    const mass=1;
    let x = utils.randomIntFromRange(radius, innerWidth - radius);
    let y = utils.randomIntFromRange(radius, innerHeight - radius);
    const color = utils.randomColor(colors);
    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          utils.distance(x, y, particles[j].x, particles[j].y) - 2 * radius <=
          0
        ) {
          x = utils.randomIntFromRange(radius, innerWidth - radius);
          y = utils.randomIntFromRange(radius, innerHeight - radius);
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, mass, 0 , radius, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
  });
}

init();
animate();
