document.addEventListener('DOMContentLoaded', function() {
    // Manejar clic en "Cargar CSP"
    document.getElementById('parseCSP').addEventListener('click', function() {
        parseInitialCSP();
    });

    // Manejar clic en "Limpiar Todo"
    document.getElementById('clearAll').addEventListener('click', function() {
        if(confirm('¿Estás seguro de que quieres limpiar todo? Perderás todos los cambios.')) {
            clearAllDirectives();
        }
    });

    // Manejar clic en "Agregar Directiva"
    document.getElementById('addDirective').addEventListener('click', function() {
        const directiveType = document.getElementById('directiveType').value;
        addDirective(directiveType, '');
    });

    // Manejar clic en "Generar CSP"
    document.getElementById('generateCSP').addEventListener('click', function() {
        generateCSP();
    });

    // Manejar clic en "Copiar CSP"
    document.getElementById('copyCSP').addEventListener('click', function() {
        copyToClipboard(document.getElementById('resultText').textContent);
        alert('CSP copiado al portapapeles!');
    });

    // Función para parsear el CSP inicial
    function parseInitialCSP() {
        const initialCSP = document.getElementById('initialCSP').value.trim();
        if (!initialCSP) {
            alert('Por favor ingresa un CSP para analizar');
            return;
        }

        // Limpiar directivas existentes
        clearAllDirectives();

        // Dividir el CSP en directivas individuales
        const directives = initialCSP.split(';').map(d => d.trim()).filter(d => d);

        // Procesar cada directiva
        directives.forEach(directive => {
            const spaceIndex = directive.indexOf(' ');
            if (spaceIndex === -1) return;

            const name = directive.substring(0, spaceIndex).trim();
            const value = directive.substring(spaceIndex + 1).trim();

            addDirective(name, value);
        });
    }

    // Función para limpiar todas las directivas
    function clearAllDirectives() {
        document.getElementById('directivesContainer').innerHTML = '';
        document.getElementById('initialCSP').value = '';
        document.getElementById('result').style.display = 'none';
    }

    // Función para agregar una nueva directiva
    function addDirective(name, value) {
        // Verificar si la directiva ya existe
        const existingDirectives = document.querySelectorAll('.directive-name');
        for (let i = 0; i < existingDirectives.length; i++) {
            if (existingDirectives[i].textContent === name) {
                // Actualizar el valor existente
                const directiveId = existingDirectives[i].closest('.directive-block').id;
                document.getElementById(`${directiveId}-value`).value = value;
                return;
            }
        }

        // Si no existe, crear nueva directiva
        const container = document.getElementById('directivesContainer');
        const directiveId = 'directive-' + Date.now();

        const directiveBlock = document.createElement('div');
        directiveBlock.className = 'directive-block';
        directiveBlock.id = directiveId;

        directiveBlock.innerHTML = `
            <div class="directive-header">
                <span class="directive-name">${name}</span>
                <button class="remove-btn" data-directive="${directiveId}">Eliminar</button>
            </div>
            <textarea id="${directiveId}-value" placeholder="Ingresa los valores para ${name} (separados por espacios)">${value}</textarea>
        `;

        container.appendChild(directiveBlock);

        // Agregar evento al botón de eliminar
        directiveBlock.querySelector('.remove-btn').addEventListener('click', function() {
            if(confirm('¿Eliminar esta directiva?')) {
                document.getElementById(directiveId).remove();
            }
        });
    }

    // Función para generar el CSP
    function generateCSP() {
        const directiveBlocks = document.querySelectorAll('.directive-block');
        let cspParts = [];

        directiveBlocks.forEach(block => {
            const name = block.querySelector('.directive-name').textContent;
            const value = block.querySelector('textarea').value.trim();
            
            if (value) {
                cspParts.push(`${name} ${value}`);
            }
        });

        if(cspParts.length === 0) {
            alert('No hay directivas para generar. Agrega al menos una directiva.');
            return;
        }

        const cspString = cspParts.join('; ');
        document.getElementById('resultText').textContent = cspString + (cspParts.length > 0 ? ';' : '');
        document.getElementById('result').style.display = 'block';
        
        // Hacer scroll al resultado
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    }

    // Función para copiar al portapapeles
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
});