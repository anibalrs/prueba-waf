document.addEventListener('DOMContentLoaded', function() {
    // Tracking específico para ECS
    console.log('Amazon ECS Tools initialized');
    
    document.querySelectorAll('.aws-command-card a').forEach(link => {
        link.addEventListener('click', function() {
            const toolName = this.closest('.aws-command-card').querySelector('h3').textContent;
            console.log(`Herramienta ECS seleccionada: ${toolName}`);
        });
    });
});