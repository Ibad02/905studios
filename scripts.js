
// PARTICLES BACKGROUND
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];
const numParticles = 100;
const colors = ["#facc15", "#64748b", "#ffffff"];

class Particle {
  constructor(x, y, size, speedX, speedY, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < numParticles; i++) {
  let size = Math.random() * 5 + 2;
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  let speedX = (Math.random() - 0.5) * 2;
  let speedY = (Math.random() - 0.5) * 2;
  let color = colors[Math.floor(Math.random() * colors.length)];
  particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let particle of particlesArray) {
    particle.update();
    particle.draw();
  }

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// 3D CAMERA LOADING
const container = document.getElementById("three-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;

camera.position.z = 5;

const mtlLoader = new THREE.MTLLoader();
mtlLoader.load('10124_SLR_Camera_SG_V1_Iteration2.mtl', function(materials) {
  materials.preload();
  const objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('10124_SLR_Camera_SG_V1_Iteration2.obj', function(object) {
    object.scale.set(0.02, 0.02, 0.02);
    object.rotation.y = Math.PI;
    scene.add(object);
  });
});

function animateModel() {
  requestAnimationFrame(animateModel);
  controls.update();
  renderer.render(scene, camera);
}
animateModel();

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
