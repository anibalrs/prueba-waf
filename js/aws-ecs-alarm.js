// JavaScript específico para el generador de comandos
document.addEventListener('DOMContentLoaded', function() {
    // Variables para modales
    const customPeriodModal = document.getElementById('customPeriodModal');
    const actionModal = document.getElementById('actionModal');
    
    // Manejo de servicios
    const servicesContainer = document.getElementById('servicesContainer');
    const addServiceBtn = document.getElementById('addService');
    
    // Manejo de acciones
    const actionsContainer = document.getElementById('actionsContainer');
    const addActionBtn = document.getElementById('addAction');
    
    // Manejo de tags
    const tagsContainer = document.getElementById('tagsContainer');
    const addTagBtn = document.getElementById('addTag');
    
    // Botones principales
    const generateBtn = document.getElementById('generateCommand');
    const resetBtn = document.getElementById('resetForm');
    const copyBtn = document.getElementById('copyCommand');
    const downloadBtn = document.getElementById('downloadCommand');
    
    // Elementos de salida
    const commandOutput = document.getElementById('commandOutput');
    const generatedCommand = document.getElementById('generatedCommand');
    
    // Evento para agregar servicio
    addServiceBtn.addEventListener('click', function() {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'service-item';
        serviceItem.innerHTML = `
            <input type="text" class="form-control service-input" placeholder="Ej: course-batch" required>
            <button class="btn btn-remove remove-service"><i class="fas fa-trash"></i></button>
        `;
        servicesContainer.appendChild(serviceItem);
        
        // Agregar evento al botón de eliminar
        serviceItem.querySelector('.remove-service').addEventListener('click', function() {
            if (servicesContainer.children.length > 1) {
                servicesContainer.removeChild(serviceItem);
            } else {
                alert('Debe haber al menos un servicio');
            }
        });
    });
    
    // Evento para periodo personalizado
    const periodSelect = document.getElementById('period');
    periodSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customPeriodModal.style.display = 'flex';
        }
    });
    
    // Cerrar modal de periodo personalizado
    document.querySelector('#customPeriodModal .modal-close').addEventListener('click', function() {
        customPeriodModal.style.display = 'none';
        periodSelect.value = '60'; // Resetear a valor por defecto
    });
    
    // Guardar periodo personalizado
    document.getElementById('saveCustomPeriod').addEventListener('click', function() {
        const customValue = document.getElementById('customPeriodValue').value;
        if (customValue >= 10 && customValue <= 60 && customValue % 10 === 0) {
            // Crear una nueva opción y seleccionarla
            periodSelect.innerHTML = periodSelect.innerHTML.replace(
                '<option value="custom">Personalizado...</option>',
                `<option value="${customValue}" selected>${customValue} segundos (personalizado)</option>
                 <option value="custom">Personalizado...</option>`
            );
            customPeriodModal.style.display = 'none';
        } else {
            alert('El valor debe ser un múltiplo de 10 entre 10 y 60');
        }
    });
    
    // Evento para agregar acción
    addActionBtn.addEventListener('click', function() {
        actionModal.style.display = 'flex';
    });
    
    // Cerrar modal de acción
    document.querySelector('#actionModal .modal-close').addEventListener('click', function() {
        actionModal.style.display = 'none';
    });
    
    // Guardar acción
    document.getElementById('saveAction').addEventListener('click', function() {
        const actionType = document.getElementById('actionType').value;
        const region = document.getElementById('actionRegion').value;
        const accountId = document.getElementById('accountId').value;
        const resourceName = document.getElementById('resourceName').value;
        
        if (!accountId || !resourceName) {
            alert('Account ID y Nombre del Recurso son obligatorios');
            return;
        }
        
        let arn = '';
        if (actionType === 'sns') {
            arn = `arn:aws:sns:${region}:${accountId}:${resourceName}`;
        } else if (actionType === 'lambda') {
            arn = `arn:aws:lambda:${region}:${accountId}:function:${resourceName}`;
        }
        
        const actionItem = document.createElement('div');
        actionItem.className = 'action-item';
        actionItem.innerHTML = `
            <p><strong>Tipo:</strong> ${actionType === 'sns' ? 'SNS Topic' : 'Lambda Function'}</p>
            <p><strong>ARN:</strong> ${arn}</p>
            <button class="btn btn-remove remove-action"><i class="fas fa-trash"></i> Eliminar</button>
            <input type="hidden" class="action-arn" value="${arn}">
        `;
        actionsContainer.appendChild(actionItem);
        
        // Agregar evento al botón de eliminar
        actionItem.querySelector('.remove-action').addEventListener('click', function() {
            actionsContainer.removeChild(actionItem);
        });
        
        // Limpiar y cerrar modal
        document.getElementById('accountId').value = '';
        document.getElementById('resourceName').value = '';
        actionModal.style.display = 'none';
    });
    
    // Evento para agregar tag
    addTagBtn.addEventListener('click', function() {
        const tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        tagItem.innerHTML = `
            <div class="form-group">
                <label>Key</label>
                <input type="text" class="form-control tag-key" placeholder="Ej: t.ambiente">
            </div>
            <div class="form-group">
                <label>Value</label>
                <input type="text" class="form-control tag-value" placeholder="Ej: prd">
            </div>
            <button class="btn btn-remove remove-tag"><i class="fas fa-trash"></i> Eliminar</button>
        `;
        tagsContainer.appendChild(tagItem);
        
        // Agregar evento al botón de eliminar
        tagItem.querySelector('.remove-tag').addEventListener('click', function() {
            tagsContainer.removeChild(tagItem);
        });
    });
    
    // Evento para generar comando
    generateBtn.addEventListener('click', function() {
        // Validar campos obligatorios
        const requiredFields = ['metricType', 'clusterName', 'appName', 'appDisplayName'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field);
            if (!element.value) {
                element.style.borderColor = 'red';
                isValid = false;
            } else {
                element.style.borderColor = '';
            }
        });
        
        // Validar servicios
        const services = document.querySelectorAll('.service-input');
        let servicesValid = true;
        
        services.forEach(service => {
            if (!service.value) {
                service.style.borderColor = 'red';
                servicesValid = false;
            } else {
                service.style.borderColor = '';
            }
        });
        
        if (!isValid || !servicesValid) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
        
        // Obtener valores del formulario
        const metricType = document.getElementById('metricType').value;
        const clusterName = document.getElementById('clusterName').value;
        const appName = document.getElementById('appName').value;
        const appDisplayName = document.getElementById('appDisplayName').value;
        
        // Crear array de servicios
        const servicesArray = Array.from(services).map(s => `"${s.value}"`).join(',\n  ');
        const jsonServices = `[\n  ${servicesArray}\n]`;
        
        // Obtener parámetros de la alarma
        const period = document.getElementById('period').value;
        const statistic = document.getElementById('statistic').value;
        const unit = document.getElementById('unit').value;
        const threshold = document.getElementById('threshold').value;
        
        // Obtener acciones (si existen)
        const actions = Array.from(document.querySelectorAll('.action-arn')).map(a => a.value);
        
        // Obtener tags (si existen)
        const tags = [];
        document.querySelectorAll('.tag-item').forEach(tag => {
            const key = tag.querySelector('.tag-key').value;
            const value = tag.querySelector('.tag-value').value;
            if (key && value) {
                tags.push({ key, value });
            }
        });
        
        // Generar el comando
        let command = `#!/bin/bash\n\n`;
        command += `cluster="${clusterName}"\n`;
        command += `aplicacion="${appName}"\n`;
        command += `nombreApp="${appDisplayName}"\n\n`;
        
        command += `json_servicios='${jsonServices}'\n\n`;
        
        command += `echo "$json_servicios" | jq -r '.[]' | while read nombre; do\n`;
        command += `  descripcion="La alarma se activa si ${metricType === 'CPUUtilization' ? 'el CPU' : 'la memoria'} del servicio \${nombre} supera el ${threshold}% durante ${period} segundos."\n\n`;
        
        command += `  aws cloudwatch put-metric-alarm \\\n`;
        command += `    --alarm-name "\${nombreApp}-\${nombre}-${metricType.replace('Utilization', '')}" \\\n`;
        command += `    --metric-name ${metricType} \\\n`;
        command += `    --namespace AWS/ECS \\\n`;
        command += `    --statistic ${statistic} \\\n`;
        command += `    --period ${period} \\\n`;
        command += `    --threshold ${threshold} \\\n`;
        command += `    --comparison-operator GreaterThanThreshold \\\n`;
        command += `    --evaluation-periods 1 \\\n`;
        command += `    --datapoints-to-alarm 1 \\\n`;
        command += `    --dimensions Name=ClusterName,Value=\$cluster Name=ServiceName,Value=\$nombre \\\n`;
        command += `    --treat-missing-data missing \\\n`;
        command += `    --unit ${unit}`;
        
        // Agregar acciones si existen
        if (actions.length > 0) {
            command += ` \\\n    --actions-enabled \\\n    --alarm-actions ${actions.join(' ')}`;
        }
        
        // Agregar tags si existen
        if (tags.length > 0) {
            command += ` \\\n    --tags`;
            tags.forEach(tag => {
                command += ` Key=${tag.key},Value=${tag.value}`;
            });
        }
        
        command += `\n\n`;
        command += `  echo "✅ Alarma creada para \$nombre"\n`;
        command += `done\n`;
        
        // Mostrar el comando generado
        generatedCommand.textContent = command;
        commandOutput.style.display = 'block';
        
        // Desplazarse al resultado
        commandOutput.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Evento para copiar comando
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(generatedCommand.textContent)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
            });
    });
    
    // Evento para descargar script
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([generatedCommand.textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alarm-${document.getElementById('metricType').value}-${new Date().toISOString().slice(0,10)}.sh`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Evento para resetear formulario
    resetBtn.addEventListener('click', function() {
        document.querySelectorAll('input, select').forEach(element => {
            if (element.id !== 'threshold') {
                element.value = '';
            } else {
                element.value = '50';
            }
        });
        
        // Resetear selects a valores por defecto
        document.getElementById('period').value = '60';
        document.getElementById('statistic').value = 'Average';
        document.getElementById('unit').value = 'Percent';
        
        // Limpiar contenedores dinámicos
        servicesContainer.innerHTML = `
            <div class="service-item">
                <input type="text" class="form-control service-input" placeholder="Ej: course-batch" required>
                <button class="btn btn-remove remove-service"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        actionsContainer.innerHTML = '';
        tagsContainer.innerHTML = '';
        commandOutput.style.display = 'none';
        
        // Agregar eventos a los nuevos elementos
        servicesContainer.querySelector('.remove-service').addEventListener('click', function() {
            alert('Debe haber al menos un servicio');
        });
    });
    
    // Inicializar evento para el primer botón de eliminar servicio
    servicesContainer.querySelector('.remove-service').addEventListener('click', function() {
        alert('Debe haber al menos un servicio');
    });
});