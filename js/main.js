// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('navMenu').classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Cerrar el menú móvil si está abierto
            document.getElementById('navMenu').classList.remove('active');
        }
    });
});

// Cerrar menú al hacer clic en un enlace (para móviles)
document.querySelectorAll('#navMenu a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('navMenu').classList.remove('active');
    });
});

// Búsqueda de herramientas (funcionalidad básica)
const searchInput = document.querySelector('.search-box input');
searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
        const searchTerm = this.value.toLowerCase();
        alert(`Buscando: ${searchTerm}\nEsta funcionalidad puede extenderse para filtrar herramientas`);
        // Aquí podrías implementar la lógica para filtrar las herramientas
    }
});

// Marcador de herramientas visitadas recientemente (usando localStorage)
document.querySelectorAll('.tool-card a').forEach(toolLink => {
    toolLink.addEventListener('click', function() {
        const toolName = this.closest('.tool-card').querySelector('h3').textContent;
        let recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
        
        // Eliminar si ya existe
        recentTools = recentTools.filter(tool => tool !== toolName);
        
        // Agregar al inicio
        recentTools.unshift(toolName);
        
        // Mantener solo las últimas 5
        recentTools = recentTools.slice(0, 5);
        
        localStorage.setItem('recentTools', JSON.stringify(recentTools));
    });
});

// Cargar herramientas recientes al iniciar
document.addEventListener('DOMContentLoaded', function() {
    const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
    if (recentTools.length > 0) {
        console.log('Herramientas recientes:', recentTools);
        // Aquí podrías actualizar la UI mostrando las herramientas recientes
    }
});