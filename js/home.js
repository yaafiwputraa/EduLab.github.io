// Enhanced JavaScript with better performance and error handling
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                navLinks.classList.contains('active'));
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && 
            !e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Scroll handling for header
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && currentScroll < 100) {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }

    // Throttle scroll event for better performance
    let ticking = false;
    document.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add intersection observer for animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe course cards for animation
    document.querySelectorAll('.course-card').forEach(card => {
        observer.observe(card);
    });
});

// Particle background animation
class ParticleBackground {
constructor() {
this.canvas = document.createElement('canvas');
this.ctx = this.canvas.getContext('2d');
this.particles = [];
this.particleCount = 50;

this.init();
}

init() {
this.canvas.style.position = 'fixed';
this.canvas.style.top = '0';
this.canvas.style.left = '0';
this.canvas.style.width = '100%';
this.canvas.style.height = '100%';
this.canvas.style.pointerEvents = 'none';
this.canvas.style.zIndex = '0';
document.querySelector('.background').appendChild(this.canvas);

this.resize();
this.createParticles();
this.animate();

window.addEventListener('resize', () => this.resize());
}

resize() {
this.canvas.width = window.innerWidth;
this.canvas.height = window.innerHeight;
}

createParticles() {
for (let i = 0; i < this.particleCount; i++) {
    this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.2
    });
}
}

animate() {
this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

this.particles.forEach(particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
    
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(125, 211, 252, ${particle.opacity})`;
    this.ctx.fill();
});

requestAnimationFrame(() => this.animate());
}
}


class CourseCardEffects {
constructor() {
this.cards = document.querySelectorAll('.course-card');
this.init();
}

init() {
this.cards.forEach(card => {
    card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
    card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
    card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
});
}

handleMouseMove(e, card) {
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;

const centerX = rect.width / 2;
const centerY = rect.height / 2;

const rotateX = (y - centerY) / 10;
const rotateY = -(x - centerX) / 10;

card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
}

handleMouseLeave(e, card) {
card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
}

handleMouseEnter(card) {
card.style.transition = 'transform 0.3s ease';
}
}


class ScrollProgress {
constructor() {
this.progressBar = document.createElement('div');
this.init();
}

init() {
this.progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(to right, #7dd3fc, #93c5fd);
    z-index: 1001;
    transition: width 0.1s ease;
`;

document.body.appendChild(this.progressBar);
window.addEventListener('scroll', () => this.updateProgress());
}

updateProgress() {
const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
const progress = (window.scrollY / windowHeight) * 100;
this.progressBar.style.width = `${progress}%`;
}
}


class LoadingAnimation {
constructor() {
this.loader = document.createElement('div');
this.init();
}

init() {
this.loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background-color);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    transition: opacity 0.5s ease;
`;

this.loader.innerHTML = `
    <div style="
        width: 50px;
        height: 50px;
        border: 3px solid transparent;
        border-top-color: var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    "></div>
`;

document.body.appendChild(this.loader);

window.addEventListener('load', () => {
    setTimeout(() => {
        this.loader.style.opacity = '0';
        setTimeout(() => this.loader.remove(), 500);
    }, 500);
});
}
}


document.addEventListener('DOMContentLoaded', function() {



const particles = new ParticleBackground();
const cardEffects = new CourseCardEffects();
const scrollProgress = new ScrollProgress();
const loadingAnimation = new LoadingAnimation();


const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search courses...';
searchInput.className = 'course-search';
searchInput.style.cssText = `
display: block;
margin: 0 auto 2rem auto;
padding: 0.8rem 1.5rem;
width: 100%;
max-width: 500px;
border: 1px solid var(--glass-border);
border-radius: 2rem;
background: var(--glass-background);
color: var(--text-color);
backdrop-filter: blur(10px);
transition: all 0.3s ease;
`;

const coursesSection = document.querySelector('.courses h2');
coursesSection.parentNode.insertBefore(searchInput, coursesSection.nextSibling);

searchInput.addEventListener('input', (e) => {
const searchTerm = e.target.value.toLowerCase();
const cards = document.querySelectorAll('.course-card');

cards.forEach(card => {
    const title = card.querySelector('.course-title').textContent.toLowerCase();
    const description = card.querySelector('.course-description').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.5s ease';
    } else {
        card.style.display = 'none';
    }
});
});
});


const style = document.createElement('style');
style.textContent = `
@keyframes spin {
to { transform: rotate(360deg); }
}

@keyframes fadeIn {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}

.course-search:focus {
box-shadow: 0 0 0 2px var(--accent-color);
outline: none;
}
`;
document.head.appendChild(style);