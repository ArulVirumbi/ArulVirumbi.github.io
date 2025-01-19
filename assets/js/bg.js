class SmallBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.element = document.createElement('div');
        this.element.className = 'bubble';
        
        // Random movement parameters
        this.angle = Math.random() * Math.PI * 2;
        this.speed = 0.3 + Math.random() * 0.3;
        this.wobbleSpeed = 0.02 + Math.random() * 0.02;
        this.wobbleSize = 30 + Math.random() * 20;
        this.timeOffset = Math.random() * Math.PI * 2;
        
        // Starting position
        this.baseX = x;
        this.baseY = y;
        
        this.update();
    }

    update() {
        const time = Date.now() / 1000;
        
        // Create smooth random movement using sine waves
        this.x = this.baseX + Math.sin(time * this.wobbleSpeed + this.timeOffset) * this.wobbleSize;
        this.y = this.baseY + Math.cos(time * this.wobbleSpeed + this.timeOffset) * this.wobbleSize;
        
        // Update position
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    // Check distance to mouse
    checkMouse(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            this.element.classList.add('highlight');
            
            // Move away from mouse
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 100;
            this.baseX -= Math.cos(angle) * force * 2;
            this.baseY -= Math.sin(angle) * force * 2;
        } else {
            this.element.classList.remove('highlight');
            
            // Slowly return to original position
            this.baseX += (this.originalX - this.baseX) * 0.02;
            this.baseY += (this.originalY - this.baseY) * 0.02;
        }
    }
}

// Initialize bubbles
const bubbles = [];
const container = document.querySelector('.background-container');

function createBubbles() {
    const numBubbles = 150; // Adjust number of bubbles
    
    for (let i = 0; i < numBubbles; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const bubble = new SmallBubble(x, y);
        bubble.originalX = x;
        bubble.originalY = y;
        container.appendChild(bubble.element);
        bubbles.push(bubble);
    }
}

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseTimer;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
    
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

// Animation loop
function animate() {
    bubbles.forEach(bubble => {
        bubble.update();
        if (isMouseMoving) {
            bubble.checkMouse(mouseX, mouseY);
        }
    });
    requestAnimationFrame(animate);
}

// Mouse movement effect
const createMouseEffect = () => {
    const container = document.querySelector('.background-container');
    let shapes = [];
    const maxShapes = 3;

    document.addEventListener('mousemove', (e) => {
        const shape = document.createElement('div');
        shape.className = 'accent-shape';
        shape.style.left = e.clientX + 'px';
        shape.style.top = e.clientY + 'px';
        shape.style.width = '50px';
        shape.style.height = '50px';
        container.appendChild(shape);
        shapes.push(shape);

        // Remove old shapes
        if (shapes.length > maxShapes) {
            container.removeChild(shapes.shift());
        }

        // Animate size
        requestAnimationFrame(() => {
            shape.style.width = '200px';
            shape.style.height = '200px';
            shape.style.opacity = '0';
        });

        // Remove after animation
        setTimeout(() => {
            if (container.contains(shape)) {
                container.removeChild(shape);
                shapes = shapes.filter(s => s !== shape);
            }
        }, 1000);
    });
};

// Initialize
createBubbles();
createMouseEffect();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    // Remove existing bubbles
    bubbles.forEach(bubble => {
        bubble.element.remove();
    });
    bubbles.length = 0;
    
    // Create new bubbles
    createBubbles();
});

