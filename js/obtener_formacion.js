// obtener_formacion.js - Carga los niveles de formación desde el backend

document.addEventListener('DOMContentLoaded', function() {
    console.log('obtener_formacion.js: Iniciando carga de formaciones...');
    cargarFormaciones();
});

async function cargarFormaciones() {
    try {
        console.log('obtener_formacion.js: Realizando petición a backend/get_formacion.php');
        const response = await fetch('backend/get_formacion.php');
        const data = await response.json();
        
        if (data.success && data.data) {
            console.log('obtener_formacion.js: Formaciones cargadas exitosamente:', data.data);
            poblarSelectFormacion(data.data);
        } else {
            console.error('Error al cargar formaciones:', data.message);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

function poblarSelectFormacion(formaciones) {
    const customOptions = document.querySelector('#step-4 .custom-options');
    const hiddenSelect = document.querySelector('#postgraduateSelect');
    const customSelect = document.querySelector('#step-4 .custom-select');
    
    if (!customOptions || !hiddenSelect || !customSelect) {
        console.error('No se encontraron los elementos del select de formación');
        return;
    }
    
    // Limpiar opciones existentes
    customOptions.innerHTML = '';
    hiddenSelect.innerHTML = '<option value="">Selecciona un nivel de formación</option>';
    
    // Agregar cada formación como opción
    formaciones.forEach(formacion => {
        // Crear opción visual personalizada
        const optionSpan = document.createElement('span');
        optionSpan.classList.add('custom-option');
        optionSpan.setAttribute('data-value', formacion.id);
        optionSpan.textContent = formacion.nivel_formacion;
        
        // Integrar con el sistema de custom select existente
        optionSpan.addEventListener('click', function() {
            if (!optionSpan.classList.contains('selected')) {
                // Remover selección previa
                customSelect.querySelector('.custom-option.selected')?.classList.remove('selected');
                optionSpan.classList.add('selected');
                
                // Actualizar texto del trigger
                const trigger = customSelect.querySelector('.custom-select__trigger span');
                if (trigger) {
                    trigger.textContent = formacion.nivel_formacion;
                }
                
                // Actualizar select oculto y disparar evento change
                hiddenSelect.value = formacion.id;
                hiddenSelect.dispatchEvent(new Event('change'));
            }
            
            // Cerrar dropdown
            customSelect.classList.remove('open');
            document.body.classList.remove('dropdown-open');
        });
        
        customOptions.appendChild(optionSpan);
        
        // Crear opción real en el select oculto
        const option = document.createElement('option');
        option.value = formacion.id;
        option.textContent = formacion.nivel_formacion;
        hiddenSelect.appendChild(option);
    });
    
    console.log('obtener_formacion.js: Select poblado con', formaciones.length, 'opciones');
}