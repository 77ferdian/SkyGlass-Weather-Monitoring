document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) createParticle();
    
    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 4 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        const dur = Math.random() * 20 + 10;
        p.style.transition = `transform ${dur}s linear, opacity ${dur}s ease-in-out`;
        p.style.opacity = Math.random() * 0.5 + 0.1;
        container.appendChild(p);
        
        setTimeout(() => { 
            p.style.transform = `translate(${Math.random() * 200 - 100}px, -${Math.random() * 200 + 100}px)`; 
            p.style.opacity = 0; 
        }, 100);
        
        setTimeout(() => { 
            p.remove(); 
            createParticle(); 
        }, dur * 1000);
    }
});
