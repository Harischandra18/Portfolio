// Particle animation for hero section
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.3;
        this.color = Math.random() > 0.5 ? '6, 182, 212' : '129, 140, 248'; // Secondary or accent color
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.opacity < 0.3) this.opacity += 0.01;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particle animation
const initParticles = () => {
    const hero = document.querySelector('.hero');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    };

    const createParticles = () => {
        const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            // Add subtle attraction to mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
                particle.speedX += dx * 0.0001;
                particle.speedY += dy * 0.0001;
            }
            
            particle.update();
            particle.draw(ctx);
            
            // Reset particles when they go off screen
            if (particle.x < 0 || particle.x > canvas.width || 
                particle.y < 0 || particle.y > canvas.height) {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
                particle.speedX = Math.random() * 2 - 1;
                particle.speedY = Math.random() * 2 - 1;
            }
        });
        animationFrameId = requestAnimationFrame(animate);
    };

    // Track mouse movement
    hero.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        particles = [];
        createParticles();
    });

    return () => {
        cancelAnimationFrame(animationFrameId);
        hero.removeChild(canvas);
    };
};

// Enhanced typing animation with cursor
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.animation = 'blink 1s infinite';
    element.appendChild(cursor);

    const type = () => {
        if (i < text.length) {
            if (cursor.previousSibling) {
                cursor.previousSibling.textContent += text.charAt(i);
            } else {
                const textNode = document.createTextNode(text.charAt(i));
                element.insertBefore(textNode, cursor);
            }
            i++;
            setTimeout(type, speed);
        } else {
            // Keep cursor blinking at the end
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
            }, 2000);
        }
    };
    type();
};

// Mobile menu functionality with smooth animation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger spans
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Enhanced smooth scroll with intersection observer
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '-50px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.classList.contains('skill-category')) {
                animateSkills(entry.target);
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .skill-category, .education-card').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Enhanced skill animation
const animateSkills = (skillCategory) => {
    const skills = skillCategory.querySelectorAll('li');
    skills.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'translateX(0)';
        }, index * 100);
    });
};

// Initialize skills with initial state
document.querySelectorAll('.skill-category li').forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateX(-20px)';
    skill.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Enhanced contact form handling with modern feedback
const contactForm = document.getElementById('contact-form');
const formFeedback = document.createElement('div');
formFeedback.className = 'form-feedback';
contactForm.appendChild(formFeedback);

const showFeedback = (message, type = 'info') => {
    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.opacity = '1';
    formFeedback.style.transform = 'translateY(0)';
    
    setTimeout(() => {
        formFeedback.style.opacity = '0';
        formFeedback.style.transform = 'translateY(-10px)';
    }, 3000);
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;

    // Modern processing feedback
    showFeedback('Processing your message...', 'info');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!name || !email || !message) {
        showFeedback('Please fill in all fields', 'error');
        return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        showFeedback('Please enter a valid email address', 'error');
        return;
    }

    showFeedback('Message sent successfully! I will respond soon.', 'success');
    contactForm.reset();
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start particle animation
    initParticles();

    // Animate hero text
    const heroTitle = document.querySelector('.hero-content h1');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText);

    // Add enhanced CSS for animations and feedback
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }

        .form-feedback {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: var(--card-bg);
            border: 1px solid var(--glass-border);
            transform: translateY(-10px);
            opacity: 0;
        }
        .form-feedback.error {
            border-color: #FF4444;
            color: #FF4444;
            background: rgba(255, 68, 68, 0.1);
        }
        .form-feedback.success {
            border-color: #06B6D4;
            color: #06B6D4;
            background: rgba(6, 182, 212, 0.1);
        }
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-in.in-view {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});