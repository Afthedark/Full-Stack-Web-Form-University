/**
 * obtener_modalidades.js
 * 
 * Este archivo se encarga de cargar dinámicamente las modalidades desde el backend
 * y poblar el select de modalidades en la pantalla 12.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar modalidades desde el backend
    async function cargarModalidades() {
        try {
            const response = await fetch('backend/get_modalidades.php');
            const data = await response.json();
            
            if (data.success && data.data) {
                poblarSelectModalidades(data.data);
            } else {
                console.error('Error al cargar modalidades:', data.message);
                // Fallback a opciones estáticas si falla la carga
                poblarSelectModalidadesEstaticas();
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            // Fallback a opciones estáticas si falla la carga
            poblarSelectModalidadesEstaticas();
        }
    }

    // Función para poblar el select con modalidades dinámicas
    function poblarSelectModalidades(modalidades) {
        const customOptions = document.querySelector('#step-12 .custom-options');
        const hiddenSelect = document.getElementById('modalitySelect');
        
        if (!customOptions || !hiddenSelect) {
            console.error('No se encontraron los elementos del select de modalidades');
            return;
        }

        // Limpiar opciones existentes (excepto la opción por defecto)
        customOptions.innerHTML = '';
        hiddenSelect.innerHTML = '<option value="">Selecciona una opción</option>';

        // Agregar cada modalidad
        modalidades.forEach(modalidad => {
            // Agregar opción al select personalizado
            const customOption = document.createElement('span');
            customOption.className = 'custom-option';
            customOption.setAttribute('data-value', modalidad.id);
            customOption.textContent = modalidad.modalidad;
            customOptions.appendChild(customOption);

            // Agregar opción al select oculto
            const option = document.createElement('option');
            option.value = modalidad.id;
            option.textContent = modalidad.modalidad;
            hiddenSelect.appendChild(option);
        });

        // Configurar eventos para el select personalizado
        configurarEventosModalidades();
    }

    // Función fallback con modalidades estáticas
    function poblarSelectModalidadesEstaticas() {
        const modalidadesEstaticas = [
            { id: 1, modalidad: 'Presencial con interacción directa.' },
            { id: 2, modalidad: 'No tengo preferencia.' },
            { id: 3, modalidad: '100% virtual por flexibilidad.' },
            { id: 4, modalidad: 'Híbrido (presencial y virtual).' }
        ];
        
        poblarSelectModalidades(modalidadesEstaticas);
    }

    // Función para configurar eventos del select de modalidades
    function configurarEventosModalidades() {
        const customSelect = document.querySelector('#step-12 .custom-select');
        const customOptions = document.querySelector('#step-12 .custom-options');
        const hiddenSelect = document.getElementById('modalitySelect');
        const trigger = document.querySelector('#step-12 .custom-select__trigger span');

        if (!customSelect || !customOptions || !hiddenSelect || !trigger) {
            return;
        }

        // Agregar eventos a todas las opciones
        const options = customOptions.querySelectorAll('.custom-option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                const text = this.textContent;

                // Actualizar el select oculto
                hiddenSelect.value = value;
                
                // Actualizar el texto mostrado
                trigger.textContent = text;
                
                // Cerrar el dropdown
                customSelect.classList.remove('open');
                
                // Disparar evento change para integración con main.js
                hiddenSelect.dispatchEvent(new Event('change'));
                
                // Remover selección anterior y agregar a la nueva
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // Inicializar la carga de modalidades
    cargarModalidades();
});
