// js/obtener_programas.js

/**
 * Obtiene los programas filtrados y los muestra en la pantalla 23
 * Se ejecuta cuando el usuario llega a la pantalla de resultados
 */
async function obtenerYMostrarProgramas() {
    console.log('=== INICIANDO CARGA DE PROGRAMAS PARA PANTALLA 23 ===');
    
    // Obtener los datos almacenados del formulario
    const lineaId = window.selectedProfesionId || localStorage.getItem('selectedProfesionId');
    const formacionId = window.selectedFormacionId || localStorage.getItem('selectedFormacionId');
    const modalidadId = window.selectedModalidadId || localStorage.getItem('selectedModalidadId');

    console.log('IDs recuperados:', {
        lineaId,
        formacionId,
        modalidadId
    });

    // Validar que tengamos los IDs necesarios
    if (!lineaId || !formacionId || !modalidadId) {
        console.error('Error: Faltan IDs necesarios para cargar programas');
        mostrarMensajeError('No se pudieron cargar los programas. Por favor, intenta nuevamente.');
        return;
    }

    // Construir URL con parámetros
    const url = `backend/get_programas_filtrados.php?linea_id=${lineaId}&formacion_id=${formacionId}&modalidad_id=${modalidadId}`;
    console.log('URL de consulta:', url);

    // Mostrar indicador de carga
    mostrarCargando();

    try {
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Respuesta del backend:', result);

        if (result.success) {
            console.log('Programas encontrados:', result.data.length);
            
            if (result.data.length > 0) {
                mostrarProgramas(result.data);
            } else {
                // No hay programas disponibles
                const mensaje = result.nombres 
                    ? `No tenemos disponible un programa relacionado a ${result.nombres.nivel_formacion} en ${result.nombres.linea} en la modalidad ${result.nombres.modalidad} para ti.`
                    : 'No se encontraron programas para tu selección.';
                mostrarMensajeSinProgramas(mensaje);
            }
        } else {
            console.error('Error del backend:', result.message);
            mostrarMensajeError('Error al cargar los programas. Por favor, intenta nuevamente.');
        }
    } catch (error) {
        console.error('Error de red al cargar programas:', error);
        mostrarMensajeError('Error de conexión. Por favor, verifica tu conexión a internet.');
    }
}

/**
 * Muestra los programas en la pantalla 23
 * @param {Array} programas - Array de objetos con {id, nombre}
 */
function mostrarProgramas(programas) {
    const resultsTitle = document.querySelector('#step-23 .results-title');
    const container = document.getElementById('programResultsContainer');

    if (!container || !resultsTitle) {
        console.error('No se encontró el contenedor de programas');
        return;
    }

    // Mantener el título fijo como en el diseño
    resultsTitle.innerHTML = 'Estos son<br>los posgrados que<br>encontramos para ti.';

    // Limpiar el contenedor
    container.innerHTML = '';

    // Crear cards para cada programa
    programas.forEach(programa => {
        const card = crearProgramaCard(programa);
        container.appendChild(card);
    });

    console.log(`✓ ${programas.length} programas mostrados correctamente`);
}

/**
 * Crea una card de programa
 * @param {Object} programa - Objeto con {id, nombre}
 * @returns {HTMLElement} - Elemento div de la card
 */
function crearProgramaCard(programa) {
    const card = document.createElement('div');
    card.classList.add('program-card');
    card.dataset.programId = programa.id;

    // Estructura de la card - sin logo, solo nombre y botón
    card.innerHTML = `
        <div class="program-info">
            <p class="program-name">${programa.nombre}</p>
            <button class="btn-info-orange" onclick="verMasInformacion(${programa.id}, '${programa.nombre.replace(/'/g, "\\'")}')">
                + Información
            </button>
        </div>
    `;

    return card;
}

/**
 * Muestra un indicador de carga mientras se obtienen los programas
 */
function mostrarCargando() {
    const container = document.getElementById('programResultsContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 50px 20px;">
            <div class="loading-spinner" style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #FF6B00;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            "></div>
            <p style="color: #666; font-size: 14px; margin: 0;">Cargando programas...</p>
        </div>
    `;
}

/**
 * Muestra un mensaje cuando no hay programas disponibles
 * @param {string} mensaje - Mensaje personalizado
 */
function mostrarMensajeSinProgramas(mensaje) {
    const resultsTitle = document.querySelector('#step-23 .results-title');
    const container = document.getElementById('programResultsContainer');

    if (!container || !resultsTitle) return;

    // Mantener el título fijo
    resultsTitle.innerHTML = 'Estos son<br>los posgrados que<br>encontramos para ti.';

    container.innerHTML = `
        <div style="text-align: center; padding: 30px 20px;">
            <div style="
                background: white;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
            ">
                <p style="
                    color: #1a1a1a;
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 0;
                ">${mensaje}</p>
                <p style="
                    color: #1a1a1a;
                    font-size: 14px;
                    margin-top: 12px;
                    font-weight: 600;
                ">Estaremos en contacto contigo pronto.</p>
            </div>
        </div>
    `;
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error
 */
function mostrarMensajeError(mensaje) {
    const container = document.getElementById('programResultsContainer');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align: center; padding: 30px 20px;">
            <div style="
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
            ">
                <p style="
                    color: #c00;
                    font-size: 14px;
                    line-height: 1.6;
                    margin: 0;
                    font-weight: 600;
                ">${mensaje}</p>
            </div>
        </div>
    `;
}

/**
 * Maneja el click en el botón "+ Información"
 * @param {number} programaId - ID del programa
 * @param {string} programaNombre - Nombre del programa
 */
function verMasInformacion(programaId, programaNombre) {
    console.log('Ver más información del programa:', programaId, programaNombre);
    
    // Enviar consulta por WhatsApp
    if (typeof enviarWhatsAppPrograma === 'function') {
        enviarWhatsAppPrograma(programaId, programaNombre);
    } else {
        console.error('Error: La función enviarWhatsAppPrograma no está disponible');
        alert('Error al abrir WhatsApp. Por favor, recarga la página.');
    }
}

// Agregar animación para el spinner de carga
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);
