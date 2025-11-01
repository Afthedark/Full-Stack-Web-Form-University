// js/cargar_programas.js

/**
 * Carga dinámicamente los programas desde el backend basados en filtros.
 * @param {number} lineaId - ID de la línea de conocimiento (profesión).
 * @param {number} formacionId - ID del nivel de formación.
 * @param {number} modalidadId - ID de la modalidad seleccionada.
 */
async function cargarProgramasPorFiltros(lineaId, formacionId, modalidadId) {
    console.log('=== DEBUG CARGAR PROGRAMAS ===');
    console.log('lineaId recibido:', lineaId, 'tipo:', typeof lineaId);
    console.log('formacionId recibido:', formacionId, 'tipo:', typeof formacionId);
    console.log('modalidadId recibido:', modalidadId, 'tipo:', typeof modalidadId);

    // Validar que los IDs estén presentes
    if (!lineaId || !formacionId || !modalidadId) {
        console.error('No se pueden cargar programas: faltan IDs de profesión, formación o modalidad.');
        console.error('lineaId:', lineaId, 'formacionId:', formacionId, 'modalidadId:', modalidadId);
        poblarSelectProgramas([]);
        return;
    }

    const url = `backend/get_programas_filtrados.php?linea_id=${lineaId}&formacion_id=${formacionId}&modalidad_id=${modalidadId}`;
    console.log('URL de consulta:', url);

    try {
        const response = await fetch(url);
        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Respuesta completa del backend:', result);

        if (result.success) {
            console.log('Programas recibidos:', result.data);
            console.log('Cantidad de programas:', result.data.length);
            
            if (result.data.length === 0 && result.nombres) {
                // Mostrar mensaje personalizado y ocultar selector
                mostrarMensajePersonalizado(result.nombres);
            } else {
                poblarSelectProgramas(result.data);
            }
        } else {
            console.error('Backend error al cargar programas:', result.message);
            poblarSelectProgramas([]);
        }
    } catch (error) {
        console.error('Error de red al cargar programas:', error);
        poblarSelectProgramas([]);
    }
}

/**
 * Muestra un mensaje personalizado cuando no hay programas disponibles
 * @param {Object} nombres - Objeto con los nombres de línea, formación y modalidad
 */
function mostrarMensajePersonalizado(nombres) {
    const formGroup = document.querySelector('#step-21 .form-group:has(.custom-select[data-select="programSelect"])');
    if (!formGroup) return;

    // Crear el mensaje personalizado
    const mensaje = `No tenemos disponible un programa relacionado a ${nombres.nivel_formacion} en ${nombres.linea} en la modalidad ${nombres.modalidad} para ti, estaremos en contacto.`;
    
    // Ocultar el selector y mostrar el mensaje
    const customSelectWrapper = formGroup.querySelector('.custom-select-wrapper');
    if (customSelectWrapper) {
        customSelectWrapper.style.display = 'none';
    }

    // Crear y mostrar el mensaje personalizado
    let mensajeElement = formGroup.querySelector('.mensaje-sin-programas');
    if (!mensajeElement) {
        mensajeElement = document.createElement('div');
        mensajeElement.classList.add('mensaje-sin-programas');
        mensajeElement.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 16px;
            margin-top: 8px;
            color: #6c757d;
            font-size: 14px;
            line-height: 1.5;
            text-align: center;
        `;
        formGroup.appendChild(mensajeElement);
    }
    
    mensajeElement.textContent = mensaje;

    // Marcar que no hay programa seleccionado para el envío
    window.noProgramaDisponible = true;
    
    // Actualizar validación del formulario
    if (typeof validateContactForm === 'function') {
        validateContactForm();
    }
}

/**
 * Puebla el select de programas personalizado con los datos recibidos.
 * @param {Array} programas - Array de objetos {id, nombre}.
 */
function poblarSelectProgramas(programas) {
    const customOptionsContainer = document.querySelector('.custom-select[data-select="programSelect"] .custom-options');
    const hiddenSelect = document.getElementById('programSelect');
    const formGroup = document.querySelector('#step-21 .form-group:has(.custom-select[data-select="programSelect"])');

    if (!customOptionsContainer || !hiddenSelect || !formGroup) {
        console.error('No se encontraron los elementos del select de programas');
        return;
    }

    // Limpiar opciones existentes
    customOptionsContainer.innerHTML = '';
    hiddenSelect.innerHTML = '<option value="">Selecciona un programa</option>';

    // Restablecer estado cuando hay programas disponibles
    window.noProgramaDisponible = false;
    
    // Mostrar el selector y ocultar mensaje si existe
    const customSelectWrapper = formGroup.querySelector('.custom-select-wrapper');
    if (customSelectWrapper) {
        customSelectWrapper.style.display = 'block';
    }
    
    const mensajeElement = formGroup.querySelector('.mensaje-sin-programas');
    if (mensajeElement) {
        mensajeElement.style.display = 'none';
    }

    if (programas.length === 0) {
        // Mostrar mensaje genérico si no tenemos nombres específicos
        const noDataOption = document.createElement('span');
        noDataOption.classList.add('custom-option', 'no-data');
        noDataOption.textContent = 'No hay programas disponibles para tu selección';
        customOptionsContainer.appendChild(noDataOption);
        return;
    }

    // Agregar opciones dinámicas
    programas.forEach(programa => {
        // Agregar al select oculto
        const option = document.createElement('option');
        option.value = programa.id;
        option.textContent = programa.nombre;
        hiddenSelect.appendChild(option);

        // Agregar a las opciones personalizadas
        const customOption = document.createElement('span');
        customOption.classList.add('custom-option');
        customOption.dataset.value = programa.id;
        customOption.textContent = programa.nombre;
        customOptionsContainer.appendChild(customOption);

        // Manejar selección de opciones personalizadas
        customOption.addEventListener('click', () => {
            const trigger = document.querySelector('.custom-select[data-select="programSelect"] .custom-select__trigger span');
            trigger.textContent = programa.nombre;
            hiddenSelect.value = programa.id;
            hiddenSelect.dispatchEvent(new Event('change'));

            // Actualizar variable global si existe
            if (typeof window.selectedProgramName !== 'undefined') {
                window.selectedProgramName = programa.nombre;
            }

            // Cerrar dropdown después de la selección
            const customSelect = document.querySelector('.custom-select[data-select="programSelect"]');
            customSelect.classList.remove('open');
            document.body.classList.remove('dropdown-open');
        });
    });

    // Inicializar el custom select de programa después de agregar las opciones
    initializeProgramSelect();

    // Agregar event listener para cerrar dropdown al hacer click fuera
    document.addEventListener('click', handleOutsideClick);
}

/**
 * Maneja los clics fuera del dropdown para cerrarlo
 */
function handleOutsideClick(e) {
    const programCustomSelect = document.querySelector('.custom-select[data-select="programSelect"]');
    if (!programCustomSelect) return;

    const isSelect = e.target.closest('.custom-select[data-select="programSelect"]');
    if (!isSelect && programCustomSelect.classList.contains('open')) {
        programCustomSelect.classList.remove('open', 'near-footer');
        document.body.classList.remove('dropdown-open');
    }
}

// Agregar listener para redimensionar ventana y reajustar posición si es necesario
window.addEventListener('resize', () => {
    const programCustomSelect = document.querySelector('.custom-select[data-select="programSelect"]');
    if (programCustomSelect && programCustomSelect.classList.contains('open')) {
        checkDropdownPosition(programCustomSelect);
    }
});

/**
 * Inicializa el custom select de programa con los event listeners necesarios
 */
function initializeProgramSelect() {
    const programCustomSelect = document.querySelector('.custom-select[data-select="programSelect"]');
    if (!programCustomSelect) return;

    const trigger = programCustomSelect.querySelector('.custom-select__trigger');
    if (!trigger) return;

    // Remover listeners existentes clonando el elemento
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);

    // Agregar nuevo event listener para toggle
    newTrigger.addEventListener('click', () => {
        // Cerrar otros selects
        document.querySelectorAll('.custom-select.open').forEach(select => {
            if (select !== programCustomSelect) {
                select.classList.remove('open');
            }
        });

        const isOpening = !programCustomSelect.classList.contains('open');
        
        if (isOpening) {
            // Verificar si el dropdown estará cerca del footer antes de abrirlo
            checkDropdownPosition(programCustomSelect);
            document.body.classList.add('dropdown-open');
        } else {
            document.body.classList.remove('dropdown-open');
        }
        
        programCustomSelect.classList.toggle('open');
    });
}

/**
 * Verifica la posición del dropdown y ajusta si está cerca del footer
 */
function checkDropdownPosition(selectElement) {
    const rect = selectElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const footer = document.querySelector('.form-footer');
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    
    // Calcular espacio disponible hacia abajo
    const spaceBelow = footerRect ? footerRect.top - rect.bottom : windowHeight - rect.bottom;
    
    // Si hay menos de 220px de espacio (considerando max-height de 200px + margen), 
    // mostrar el dropdown hacia arriba
    if (spaceBelow < 220) {
        selectElement.classList.add('near-footer');
    } else {
        selectElement.classList.remove('near-footer');
    }
}