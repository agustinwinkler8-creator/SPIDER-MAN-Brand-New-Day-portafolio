/**
 * SPIDER-MAN: BRAND NEW DAY - Interactive Script
 * Handles: loading, cursor, navigation, animations, game, effects
 */

// ========================================
// GLOBAL STATE
// ========================================
const state = {
    loaded: false,
    scrollY: 0,
    mouseX: 0,
    mouseY: 0,
    gameActive: false,
    gameScore: 0,
    gameSpeed: 1,
    suitIntegrity: 100
};

// ========================================
// LOADING SCREEN
// ========================================
function initLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time for effect
    setTimeout(() => {
        loadingScreen.classList.add('loaded');
        state.loaded = true;
        initNavigation();
        initHeroRings();
        
        // Remove from DOM after animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }, 2000);
}

// ========================================
// CUSTOM CURSOR
// ========================================
function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }
    
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
    });
    
    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .villano-card, .gallery-item, .video-frame');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
    });
    
    // Smooth cursor follow
    function updateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const hudStatus = document.getElementById('hud-status');
    
    // Show nav after loading
    setTimeout(() => {
        nav.classList.add('visible');
    }, 300);
    
    // Scroll behavior
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Update nav transparency based on scroll
        if (currentScroll > 100) {
            nav.style.background = 'rgba(8, 9, 10, 0.95)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(8, 9, 10, 0.9), transparent)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // HUD status animation
    setInterval(() => {
        const statuses = ['ONLINE', 'SCANNING', 'TRACKING', 'ACTIVE'];
        hudStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
    }, 3000);
}

// ========================================
// TEXT WEB BACKGROUND
// ========================================
function initTextWeb() {
    const container = document.getElementById('text-web');
    if (!container) return;
    
    const phrases = [
        'PETER PARKER SPIDER-MAN BRAND NEW DAY ',
        'WE ARE THE NEW YORK ECOSYSTEM ',
        'SCORPION TOMBSTONE TARANTULA THE HAND ',
        'WITH GREAT POWER COMES GREAT RESPONSIBILITY ',
        'MUTATION EVOLUTION ADAPTATION ',
        'FRIENDLY NEIGHBORHOOD SPIDER-MAN ',
        'MARVEL STUDIOS 2026 ',
    ];
    
    const linesNeeded = Math.ceil(window.innerHeight / 12) + 20;
    let html = '';
    
    for (let i = 0; i < linesNeeded; i++) {
        const phrase = phrases[i % phrases.length];
        const repeated = phrase.repeat(12);
        html += `<div class="text-line" style="animation-delay: -${i * 2}s">${repeated}</div>`;
    }
    
    container.innerHTML = html;
}

// ========================================
// HERO RINGS
// ========================================
function initHeroRings() {
    const ringGroup = document.getElementById('ring-group');
    if (!ringGroup) return;
    
    const RING_COUNT = 8;
    const svgNS = 'http://www.w3.org/2000/svg';
    const centerX = 500;
    const centerY = 500;
    
    // Clear existing
    ringGroup.innerHTML = '';
    
    // Create rings
    for (let i = 0; i < RING_COUNT; i++) {
        const radius = (i + 1) * 50;
        const ring = document.createElementNS(svgNS, 'circle');
        
        ring.setAttribute('cx', centerX);
        ring.setAttribute('cy', centerY);
        ring.setAttribute('r', '0');
        ring.setAttribute('class', `ring-item ring-${i}`);
        
        ringGroup.appendChild(ring);
        
        // Animate radius with delay
        setTimeout(() => {
            ring.style.transition = 'r 1.5s cubic-bezier(0.87, 0, 0.13, 1)';
            ring.setAttribute('r', radius);
        }, i * 150);
    }
    
    // Continuous rotation animation
    let rotation = 0;
    function animateRings() {
        rotation += 0.05;
        ringGroup.style.transform = `rotate(${rotation}deg)`;
        ringGroup.style.transformOrigin = `${centerX}px ${centerY}px`;
        requestAnimationFrame(animateRings);
    }
    animateRings();
}

// ========================================
// SCROLL ANIMATIONS (Intersection Observer)
// ========================================
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.villano-card, .gallery-item, .sinopsis-content, .sinopsis-video, .villanos-header, .galeria-header, .data-panel');
    
    // Add fade-in class to elements
    fadeElements.forEach((el, i) => {
        el.classList.add('fade-in');
        el.classList.add(`stagger-${(i % 5) + 1}`);
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
}

// ========================================
// SPIDER WEB MESH ON CARDS
// ========================================
function initSpiderWebMesh() {
    const cards = document.querySelectorAll('.villano-card');
    
    cards.forEach(card => {
        const svg = card.querySelector('.spider-web-mesh');
        if (!svg) return;
        
        const width = 400;
        const height = 500;
        const cols = 8;
        const rows = 10;
        const cellW = width / cols;
        const cellH = height / rows;
        
        let pathsHTML = '';
        let circlesHTML = '';
        
        // Create grid lines (horizontal + vertical)
        for (let r = 0; r <= rows; r++) {
            const y = r * cellH;
            pathsHTML += `<path d="M 0 ${y} L ${width} ${y}" stroke="rgba(10, 132, 255, 0.2)" stroke-width="0.5" fill="none"/>`;
        }
        for (let c = 0; c <= cols; c++) {
            const x = c * cellW;
            pathsHTML += `<path d="M ${x} 0 L ${x} ${height}" stroke="rgba(10, 132, 255, 0.2)" stroke-width="0.5" fill="none"/>`;
        }
        
        // Create diagonal lines (web pattern)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x1 = c * cellW;
                const y1 = r * cellH;
                const x2 = (c + 1) * cellW;
                const y2 = (r + 1) * cellH;
                // Diagonal \
                pathsHTML += `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="rgba(10, 132, 255, 0.15)" stroke-width="0.5" fill="none"/>`;
                // Diagonal /
                pathsHTML += `<path d="M ${x2} ${y1} L ${x1} ${y2}" stroke="rgba(10, 132, 255, 0.15)" stroke-width="0.5" fill="none"/>`;
            }
        }
        
        // Create intersection points (knots)
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                const x = c * cellW;
                const y = r * cellH;
                circlesHTML += `<circle cx="${x}" cy="${y}" r="1.5" fill="rgba(10, 132, 255, 0.4)" class="web-knot" data-cx="${x}" data-cy="${y}"/>`;
            }
        }
        
        svg.innerHTML = svg.innerHTML + pathsHTML + circlesHTML;
        
        // Interactive glow on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Scale mouse position to SVG coordinates
            const svgX = (mouseX / rect.width) * width;
            const svgY = (mouseY / rect.height) * height;
            
            const knots = svg.querySelectorAll('.web-knot');
            knots.forEach(knot => {
                const kx = parseFloat(knot.getAttribute('data-cx'));
                const ky = parseFloat(knot.getAttribute('data-cy'));
                const dist = Math.hypot(kx - svgX, ky - svgY);
                const intensity = Math.max(0, 1 - dist / 100);
                
                knot.setAttribute('r', 1.5 + intensity * 4);
                knot.style.fill = `rgba(10, 132, 255, ${0.3 + intensity * 0.7})`;
            });
        });
        
        card.addEventListener('mouseleave', () => {
            const knots = svg.querySelectorAll('.web-knot');
            knots.forEach(knot => {
                knot.setAttribute('r', '1.5');
                knot.style.fill = 'rgba(10, 132, 255, 0.4)';
            });
        });
    });
}

// ========================================
// SPIDER-TRAVERSE GAME (Canvas)
// ========================================
function initGame() {
    const canvas = document.getElementById('spider-traverse');
    const container = document.getElementById('game-container');
    const overlay = document.getElementById('game-overlay');
    const gameOver = document.getElementById('game-over');
    const startBtn = document.getElementById('start-game');
    const restartBtn = document.getElementById('restart-game');
    const scoreDisplay = document.getElementById('score-display');
    const speedDisplay = document.getElementById('speed-display');
    const integrityDisplay = document.getElementById('integrity-display');
    const finalScore = document.getElementById('final-score');
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    let animationId = null;
    
    // Set canvas size
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Game objects
    const player = {
        x: 100,
        y: 0,
        radius: 12,
        speed: 3,
        color: '#0A84FF',
        trail: []
    };
    
    let obstacles = [];
    let particles = [];
    let frameCount = 0;
    
    // Input handling
    let targetY = canvas.height / 2;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        targetY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        targetY = e.touches[0].clientY - rect.top;
    });
    
    function createObstacle() {
        const types = ['ring', 'barrier', 'zigzag'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        obstacles.push({
            x: canvas.width + 50,
            y: Math.random() * (canvas.height - 100) + 50,
            width: type === 'barrier' ? 20 : 60,
            height: type === 'barrier' ? 100 : 60,
            type: type,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 0.05,
            passed: false
        });
    }
    
    function createParticle(x, y, color) {
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                color: color || '#0A84FF'
            });
        }
    }
    
    function drawGrid() {
        ctx.strokeStyle = 'rgba(10, 132, 255, 0.08)';
        ctx.lineWidth = 0.5;
        
        // Vertical lines with perspective
        const offsetX = (frameCount * 2) % 50;
        for (let x = -offsetX; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        const offsetY = (frameCount * 0.5) % 50;
        for (let y = -offsetY; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    function drawPlayer() {
        // Trail
        player.trail.push({ x: player.x, y: player.y });
        if (player.trail.length > 15) player.trail.shift();
        
        player.trail.forEach((pos, i) => {
            const alpha = i / player.trail.length;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, player.radius * alpha * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(10, 132, 255, ${alpha * 0.3})`;
            ctx.fill();
        });
        
        // Glow
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 132, 255, 0.2)';
        ctx.fill();
        
        // Main body
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        
        // Inner highlight
        ctx.beginPath();
        ctx.arc(player.x - 3, player.y - 3, player.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
    }
    
    function drawObstacles() {
        obstacles.forEach(obs => {
            ctx.save();
            ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
            ctx.rotate(obs.rotation);
            
            switch (obs.type) {
                case 'ring':
                    ctx.beginPath();
                    ctx.arc(0, 0, obs.width / 2, 0, Math.PI * 2);
                    ctx.strokeStyle = '#FF453A';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(0, 0, obs.width / 2 - 8, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 69, 58, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    break;
                    
                case 'barrier':
                    ctx.fillStyle = 'rgba(255, 69, 58, 0.3)';
                    ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
                    ctx.strokeStyle = '#FF453A';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
                    // X pattern
                    ctx.beginPath();
                    ctx.moveTo(-obs.width / 2, -obs.height / 2);
                    ctx.lineTo(obs.width / 2, obs.height / 2);
                    ctx.moveTo(obs.width / 2, -obs.height / 2);
                    ctx.lineTo(-obs.width / 2, obs.height / 2);
                    ctx.stroke();
                    break;
                    
                case 'zigzag':
                    ctx.beginPath();
                    ctx.moveTo(-obs.width / 2, -obs.height / 2);
                    for (let i = 0; i < 4; i++) {
                        ctx.lineTo(
                            i % 2 === 0 ? obs.width / 2 : -obs.width / 2,
                            -obs.height / 2 + (obs.height / 4) * (i + 1)
                        );
                    }
                    ctx.strokeStyle = '#BF5AF2';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
        });
    }
    
    function drawParticles() {
        particles.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();
            ctx.globalAlpha = 1;
        });
    }
    
    function checkCollisions() {
        obstacles.forEach(obs => {
            const dx = player.x - (obs.x + obs.width / 2);
            const dy = player.y - (obs.y + obs.height / 2);
            const dist = Math.hypot(dx, dy);
            
            if (dist < player.radius + obs.width / 3 && !obs.passed) {
                obs.passed = true;
                state.suitIntegrity -= 20;
                createParticle(player.x, player.y, '#FF453A');
                
                // Screen shake effect
                canvas.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                setTimeout(() => canvas.style.transform = '', 100);
                
                if (state.suitIntegrity <= 0) {
                    endGame();
                }
            }
        });
    }
    
    function updateGame() {
        if (!state.gameActive) return;
        
        frameCount++;
        
        // Update player position (smooth follow)
        player.y += (targetY - player.y) * 0.08;
        
        // Clamp player to canvas
        player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));
        
        // Increase score
        if (frameCount % 10 === 0) {
            state.gameScore += 10;
        }
        
        // Increase speed over time
        state.gameSpeed = 1 + state.gameScore / 2000;
        
        // Spawn obstacles
        if (frameCount % Math.max(30, 120 - Math.floor(state.gameScore / 100)) === 0) {
            createObstacle();
        }
        
        // Update obstacles
        obstacles.forEach(obs => {
            obs.x -= 3 * state.gameSpeed;
            obs.rotation += obs.rotSpeed;
        });
        
        // Remove off-screen obstacles
        obstacles = obstacles.filter(obs => obs.x > -100);
        
        // Update particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
        });
        particles = particles.filter(p => p.life > 0);
        
        checkCollisions();
        
        // Update HUD
        scoreDisplay.textContent = `SCORE: ${String(state.gameScore).padStart(4, '0')}`;
        speedDisplay.textContent = `SPEED: ${Math.floor(state.gameSpeed * 100)}%`;
        integrityDisplay.textContent = `SUIT: ${Math.max(0, state.suitIntegrity)}%`;
        integrityDisplay.style.color = state.suitIntegrity > 50 ? '#32D74B' : state.suitIntegrity > 25 ? '#FF453A' : '#FF0000';
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrid();
        drawParticles();
        drawObstacles();
        if (state.gameActive) drawPlayer();
    }
    
    function gameLoop() {
        updateGame();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function startGame() {
        state.gameActive = true;
        state.gameScore = 0;
        state.gameSpeed = 1;
        state.suitIntegrity = 100;
        obstacles = [];
        particles = [];
        player.y = canvas.height / 2;
        targetY = canvas.height / 2;
        
        overlay.style.display = 'none';
        gameOver.style.display = 'none';
        
        // Show HUD
        scoreDisplay.style.display = 'inline';
        speedDisplay.style.display = 'inline';
        integrityDisplay.style.display = 'inline';
    }
    
    function endGame() {
        state.gameActive = false;
        finalScore.textContent = `${state.gameScore} POINTS`;
        gameOver.style.display = 'flex';
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', () => {
        gameOver.style.display = 'none';
        startGame();
    });
    
    // Start animation loop
    gameLoop();
}

// ========================================
// FOOTER DATA LINE
// ========================================
function initFooterData() {
    const dataLine = document.getElementById('footer-data-line');
    if (!dataLine) return;
    
    const data = '01001110011001010111011101001111011100100110101100100000010001010110001101101111011100110111100101110011011101000110010101101101';
    const repeated = data.repeat(4);
    dataLine.textContent = repeated;
}

// ========================================
// PARALLAX EFFECT
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - progress * 1.5;
        }
    });
}

// ========================================
// NAV BACKGROUND ON SCROLL
// ========================================
function initNavScroll() {
    const nav = document.getElementById('main-nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(8, 9, 10, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(8, 9, 10, 0.9), transparent)';
        }
    });
}

// ========================================
// HERO RING SCROLL EFFECT
// ========================================
function initRingScrollEffect() {
    const ringGroup = document.getElementById('ring-group');
    if (!ringGroup) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scale = 1 + scrollY * 0.0005;
        ringGroup.style.transform = `scale(${scale})`;
    });
}

// ========================================
// INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initCursor();
    initTextWeb();
    initScrollAnimations();
    initSpiderWebMesh();
    initGame();
    initFooterData();
    initParallax();
    initNavScroll();
    initRingScrollEffect();
});

// Re-initialize text web on resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initTextWeb();
    }, 250);
});
