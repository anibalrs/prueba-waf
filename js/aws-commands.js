document.addEventListener('DOMContentLoaded', function() {
    // Puedes añadir tracking de qué servicio es más clickeado
    document.querySelectorAll('.aws-command-card a').forEach(link => {
        link.addEventListener('click', function() {
            const serviceName = this.closest('.aws-command-card').querySelector('h3').textContent;
            console.log(`Servicio seleccionado: ${serviceName}`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'aws_service_click', {
                    'event_category': 'AWS Tools',
                    'event_label': serviceName
                });
            }
        });
    });
});
