document.addEventListener('DOMContentLoaded', async () => {
    const professionSelect = document.getElementById('professionSelect');
    const customOptionsContainer = document.querySelector('.custom-select[data-select="professionSelect"] .custom-options');

    try {
        const response = await fetch('backend/get_profesiones.php');
        const result = await response.json();

        if (result.success) {
            const profesiones = result.data;

            // Limpiar opciones existentes
            professionSelect.innerHTML = '<option value="">Selecciona una opción</option>';
            customOptionsContainer.innerHTML = '';

            // Agregar opciones dinámicas
            profesiones.forEach(profesion => {
                // Agregar al select oculto
                const option = document.createElement('option');
                option.value = profesion.id;
                option.textContent = profesion.linea;
                professionSelect.appendChild(option);

                // Agregar a las opciones personalizadas
                const customOption = document.createElement('span');
                customOption.classList.add('custom-option');
                customOption.dataset.value = profesion.id;
                customOption.textContent = profesion.linea;
                customOptionsContainer.appendChild(customOption);

                // Manejar selección de opciones personalizadas
                customOption.addEventListener('click', () => {
                    const trigger = document.querySelector('.custom-select[data-select="professionSelect"] .custom-select__trigger span');
                    trigger.textContent = profesion.linea;
                    professionSelect.value = profesion.id;
                    professionSelect.dispatchEvent(new Event('change'));

                    // Close dropdown after selection
                    const customSelect = document.querySelector('.custom-select[data-select="professionSelect"]');
                    customSelect.classList.remove('open');
                    document.body.classList.remove('dropdown-open');
                });
            });
        } else {
            console.error('Error al obtener profesiones:', result.message);
        }
    } catch (error) {
        console.error('Error al cargar profesiones:', error);
    }
});