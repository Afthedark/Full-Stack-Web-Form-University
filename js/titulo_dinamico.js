/**
 * titulo_dinamico.js
 * 
 * Este archivo se encarga de actualizar dinámicamente los títulos de las pantallas 5 y 6
 * basándose en la selección previa de profesión y nivel de formación que hizo el usuario.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el DOM esté completamente cargado

    // Obtener referencias a los selectores de profesión y nivel de formación
    const profesionSelect = document.getElementById('professionSelect');
    const posgradoSelect = document.getElementById('postgraduateSelect'); // Nivel de formación

    // Obtener referencias a los títulos que se actualizarán
    const tituloPantalla5 = document.querySelector('#step-5 h2');
    const tituloPantalla6 = document.querySelector('#step-6 h2');

    // Texto original para guardar el formato
    const textoOriginalPantalla5 = tituloPantalla5 ? tituloPantalla5.innerHTML : '';
    const textoOriginalPantalla6 = tituloPantalla6 ? tituloPantalla6.innerHTML : '';

    // Función para actualizar los títulos
    function actualizarTitulos() {
        // Obtener el texto del nivel de formación seleccionado
        let formacionTexto = '';
        if (posgradoSelect && posgradoSelect.selectedIndex > 0) {
            formacionTexto = posgradoSelect.options[posgradoSelect.selectedIndex].text;
        }

        // Obtener el texto de la profesión seleccionada
        let profesionTexto = '';
        if (profesionSelect && profesionSelect.selectedIndex > 0) {
            profesionTexto = profesionSelect.options[profesionSelect.selectedIndex].text;
        }

        // Solo actualizar si ambos valores están disponibles
        if (formacionTexto && profesionTexto) {
            // Actualizar título de la pantalla 5
            if (tituloPantalla5) {
                tituloPantalla5.innerHTML = `¿Cuál es la razón principal por la que deseas estudiar ${formacionTexto} en ${profesionTexto}?`;
            }

            // Actualizar título de la pantalla 6
            if (tituloPantalla6) {
                tituloPantalla6.innerHTML = `¿Qué tan seguro estás<br>de querer estudiar<br>${formacionTexto} en ${profesionTexto}?`;
            }
        } else if (formacionTexto) {
            // Si solo tenemos formación, mostrar solo eso
            if (tituloPantalla5) {
                tituloPantalla5.innerHTML = `¿Cuál es la razón principal por la que deseas estudiar ${formacionTexto}?`;
            }

            if (tituloPantalla6) {
                tituloPantalla6.innerHTML = `¿Qué tan seguro estás<br>de querer estudiar<br>${formacionTexto}?`;
            }
        }
    }

    // Eventos para detectar cambios en las selecciones y actualizar los títulos
    if (posgradoSelect) {
        posgradoSelect.addEventListener('change', actualizarTitulos);
    }

    // También necesitamos actualizar los títulos cuando el usuario navegue a las pantallas 5 y 6
    // Para esto, escuchamos el evento de navegación entre pantallas

    // Obtener referencias a los botones de navegación relevantes
    const btnToStep5 = document.getElementById('toStep5');
    const btnToStep6 = document.getElementById('toStep6');

    if (btnToStep5) {
        btnToStep5.addEventListener('click', function() {
            // Actualizar el título al navegar a la pantalla 5
            setTimeout(actualizarTitulos, 100); // Pequeño retraso para asegurar que todo está cargado
        });
    }

    if (btnToStep6) {
        btnToStep6.addEventListener('click', function() {
            // Actualizar el título al navegar a la pantalla 6
            setTimeout(actualizarTitulos, 100); // Pequeño retraso para asegurar que todo está cargado
        });
    }

    // También podemos escuchar cuando la función goToStep del main.js es llamada
    // Esto requiere que definamos un pequeño "hook" para interceptar esas llamadas
    const originalGoToStep = window.goToStep;
    if (typeof originalGoToStep === 'function') {
        window.goToStep = function(step) {
            // Llamar a la función original
            originalGoToStep(step);
            
            // Si estamos yendo a las pantallas 5 o 6, actualizar los títulos
            if (step === 5 || step === 6) {
                setTimeout(actualizarTitulos, 100);
            }
        };
    }

    // Intentar actualizar los títulos al cargar la página, por si ya hay valores seleccionados
    setTimeout(actualizarTitulos, 500);
});
