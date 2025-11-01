document.addEventListener('DOMContentLoaded', () => {
  // Inicializar selects personalizados
  const customSelects = document.querySelectorAll('.custom-select');
  customSelects.forEach(select => {
    const trigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-option');
    const hiddenSelect = document.getElementById(select.dataset.select);

    // Toggle dropdown
    trigger.addEventListener('click', () => {
      closeAllSelects(select);
      const isOpening = !select.classList.contains('open');
      select.classList.toggle('open');
      
      // Add/remove body class to handle z-index conflicts
      if (isOpening) {
        document.body.classList.add('dropdown-open');
      } else {
        document.body.classList.remove('dropdown-open');
      }
    });

    // Option click handler
    options.forEach(option => {
      option.addEventListener('click', () => {
        if (!option.classList.contains('selected')) {
          // Actualizar opción seleccionada
          select.querySelector('.custom-option.selected')?.classList.remove('selected');
          option.classList.add('selected');
          
          // Actualizar texto del trigger
          trigger.querySelector('span').textContent = option.textContent;
          
          // Actualizar select oculto
          if (hiddenSelect) {
            hiddenSelect.value = option.dataset.value;
            hiddenSelect.dispatchEvent(new Event('change'));
          }
        }
        select.classList.remove('open');
        document.body.classList.remove('dropdown-open');
      });
    });
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', (e) => {
    const isSelect = e.target.closest('.custom-select');
    const isNextBtn = e.target.closest('.next-btn');
    
    if (!isSelect || isNextBtn) {
      closeAllSelects();
    }
  });

  // Cerrar dropdown al hacer scroll
  document.addEventListener('scroll', () => {
    closeAllSelects();
  });

  function closeAllSelects(except = null) {
    let hasOpenDropdown = false;
    customSelects.forEach(select => {
      if (select !== except) {
        select.classList.remove('open');
      } else if (select && select.classList.contains('open')) {
        hasOpenDropdown = true;
      }
    });
    
    // Remove body class if no dropdowns are open
    if (!hasOpenDropdown) {
      document.body.classList.remove('dropdown-open');
    }
  }

  // Inicialización del formulario
  const steps = document.querySelectorAll('.form-step');
  const progress = document.querySelector('.progress');
  if (!steps.length || !progress) {
    console.error('No se encontraron los elementos necesarios del formulario');
    return;
  }
  let currentStep = 0;

  // Pantalla 1: Selección de edad
  const ageBtns = document.querySelectorAll('.age-btn');
  const toStep2Btn = document.getElementById('toStep2');
  if (!ageBtns.length || !toStep2Btn) {
    console.error('No se encontraron los elementos de la pantalla 1');
    return;
  }
  let selectedAge = null;

ageBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ageBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAge = btn.dataset.age;
    toStep2Btn.disabled = false;

    // Desplazar suavemente hacia el botón "Continuar" solo si está fuera de la vista
    setTimeout(() => {
      const btnRect = toStep2Btn.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Si el botón no está completamente visible
      if (btnRect.bottom > viewportHeight - 20) {
        toStep2Btn.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  });
});

toStep2Btn.addEventListener('click', (e) => {
  e.preventDefault();
  goToStep(1);
});

// Pantalla 2: Selección de género
const genderSelect = document.getElementById('genderSelect');
const toStep3Btn = document.getElementById('toStep3');

genderSelect.addEventListener('change', () => {
  toStep3Btn.disabled = !genderSelect.value;
});

toStep3Btn.addEventListener('click', () => {
  goToStep(2);
});

// Pantalla 3: Selección de profesión
const professionSelect = document.getElementById('professionSelect');
const toStep4Btn = document.getElementById('toStep4');

professionSelect.addEventListener('change', () => {
  toStep4Btn.disabled = !professionSelect.value;
});

toStep4Btn.addEventListener('click', () => {
  goToStep(3);
});

  // Pantalla 4: Selección de posgrado
  const postgraduateSelect = document.getElementById('postgraduateSelect');
  const toStep5Btn = document.getElementById('toStep5');

  if (postgraduateSelect && toStep5Btn) {
    postgraduateSelect.addEventListener('change', () => {
      toStep5Btn.disabled = !postgraduateSelect.value;
    });

    toStep5Btn.addEventListener('click', () => {
      goToStep(4);
    });
  }


  // Pantalla 5: Selección de razones (checkboxes, solo una opción)
  const checkboxes = document.querySelectorAll('input[name="razon"]');
  const toStep6Btn = document.getElementById('toStep6');
  let selectedReasons = [];

  if (checkboxes.length && toStep6Btn) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          checkboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedReasons = Array.from(checkboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep6Btn.disabled = selectedReasons.length === 0;
      });
    });

    toStep6Btn.addEventListener('click', () => {
      if (selectedReasons.length > 0) {
        goToStep(5);
      }
    });
  }

  // Pantalla 6: Seguridad sobre estudiar Maestría en Epidemiología
  const seguridadCheckboxes = document.querySelectorAll('input[name="seguridad"]');
  const toStep7Btn = document.getElementById('toStep7');
  let selectedSeguridad = null;

  if (seguridadCheckboxes.length && toStep7Btn) {
    seguridadCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Comportamiento de Radio Button: solo una opción seleccionada
        seguridadCheckboxes.forEach(cb => {
          if (cb !== checkbox) cb.checked = false;
        });
        selectedSeguridad = checkbox.checked ? checkbox.value : null;
        toStep7Btn.disabled = !selectedSeguridad;
      });
    });

    toStep7Btn.addEventListener('click', () => {
      if (selectedSeguridad) {
        // 1. Recopilar todos los datos del formulario
        const formData = {
          age: selectedAge,
          gender: genderSelect ? genderSelect.value : '',
          profession: professionSelect ? professionSelect.value : '',
          postgraduate: postgraduateSelect ? postgraduateSelect.value : '',
          reasons: selectedReasons,
          seguridad: selectedSeguridad
        };

        // 2. Validar que todos los datos estén completos
        if (!formData.age || !formData.gender || !formData.profession || !formData.postgraduate || formData.reasons.length === 0 || !formData.seguridad) {
          alert('Por favor, completa todos los campos antes de finalizar.');
          return;
        }

        // 3. Continuar a la siguiente pantalla
        goToStep(7);

        // 4. Guardar datos para envío posterior
        // Ejemplo:
        // fetch('/api/submit-form', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // }).then(response => response.json()).then(data => {
        //   console.log('Success:', data);
        //   // Redirigir a una página de agradecimiento
        //   // window.location.href = '/thank-you.html';
        // }).catch(error => {
        //   console.error('Error:', error);
        //   alert('Hubo un error al enviar el formulario.');
        // });
      }
    });
  }

  // Pantalla 7: Aprende con los mejores
  const toStep8Btn = document.getElementById('toStep8');
  
  if (toStep8Btn) {
    // Esta pantalla no necesita validación, el botón siempre está habilitado
    toStep8Btn.addEventListener('click', () => {
      goToStep(7);
    });
  }

  // Pantalla 8: Manejo de presión y estrés (solo una opción, visual checkbox)
  const stressCheckboxes = document.querySelectorAll('input[name="stress"]');
  const toStep9Btn = document.getElementById('toStep9');
  let selectedStress = null;

  if (stressCheckboxes.length && toStep9Btn) {
    stressCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          stressCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedStress = Array.from(stressCheckboxes).find(cb => cb.checked)?.value || null;
        toStep9Btn.disabled = !selectedStress;
      });
    });

    toStep9Btn.addEventListener('click', () => {
      if (selectedStress) {
        goToStep(8);
      }
    });
  }


  // Pantalla 9: Comodidad de estudio (solo una opción, visual checkbox)
  const studyComfortCheckboxes = document.querySelectorAll('input[name="study-comfort"]');
  const toStep10Btn = document.getElementById('toStep10');
  let selectedStudyComfort = null;

  if (studyComfortCheckboxes.length && toStep10Btn) {
    studyComfortCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          studyComfortCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedStudyComfort = Array.from(studyComfortCheckboxes).find(cb => cb.checked)?.value || null;
        toStep10Btn.disabled = !selectedStudyComfort;
      });
    });

    toStep10Btn.addEventListener('click', () => {
      if (selectedStudyComfort) {
        goToStep(9);
      }
    });
  }

  // Pantalla 10: Método de enseñanza que te reta y te hace brillar
  // Ahora la imagen funciona como botón (id="toStep11")
  const toStep11Btn = document.getElementById('toStep11');
  if (toStep11Btn) {
    toStep11Btn.addEventListener('click', () => {
      goToStep(10);
    });
  }

  // Pantalla 11: Metodología de aprendizaje preferida (solo una opción)
  const learningMethodCheckboxes = document.querySelectorAll('input[name="learning-method"]');
  const toStep12Btn = document.getElementById('toStep12');
  let selectedLearningMethods = [];

  if (learningMethodCheckboxes.length && toStep12Btn) {
    learningMethodCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          learningMethodCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedLearningMethods = Array.from(learningMethodCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep12Btn.disabled = selectedLearningMethods.length === 0;
      });
    });

    toStep12Btn.addEventListener('click', () => {
      if (selectedLearningMethods.length > 0) {
        goToStep(11);
      }
    });
  }

  // Pantalla 12: Modalidad preferida del posgrado (solo una opción)
  const modalityCheckboxes = document.querySelectorAll('input[name="modality"]');
  const toStep13Btn = document.getElementById('toStep13');
  let selectedModality = null;

  if (modalityCheckboxes.length && toStep13Btn) {
    modalityCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          // Solo una opción permitida, desmarcar las demás
          modalityCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        // Obtener la modalidad seleccionada (ID)
        selectedModality = Array.from(modalityCheckboxes)
          .find(cb => cb.checked)?.value || null;
        
        toStep13Btn.disabled = !selectedModality;
      });
    });

    toStep13Btn.addEventListener('click', () => {
      if (selectedModality) {
        goToStep(13);
      }
    });
  }

  // Pantalla 13: Tecnología de otro nivel
  const toStep14Btn = document.getElementById('toStep14');
  
  if (toStep14Btn) {
    // Esta pantalla no necesita validación, el botón siempre está habilitado
    toStep14Btn.addEventListener('click', () => {
      goToStep(13);
    });
  }

  // Pantalla 14: Desafíos al considerar un posgrado (solo una opción)
  const challengeCheckboxes = document.querySelectorAll('input[name="challenge"]');
  const toStep15Btn = document.getElementById('toStep15');
  let selectedChallenges = [];

  if (challengeCheckboxes.length && toStep15Btn) {
    challengeCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          challengeCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedChallenges = Array.from(challengeCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep15Btn.disabled = selectedChallenges.length === 0;
      });
    });

    toStep15Btn.addEventListener('click', () => {
      if (selectedChallenges.length > 0) {
        goToStep(14);
      }
    });
  }

  // Pantalla 15: ¿Cómo te imaginas en 10 años? (solo una opción)
  const futureVisionCheckboxes = document.querySelectorAll('input[name="future-vision"]');
  const toStep16Btn = document.getElementById('toStep16');
  let selectedFutureVisions = [];

  if (futureVisionCheckboxes.length && toStep16Btn) {
    futureVisionCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          futureVisionCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedFutureVisions = Array.from(futureVisionCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep16Btn.disabled = selectedFutureVisions.length === 0;
      });
    });

    toStep16Btn.addEventListener('click', () => {
      if (selectedFutureVisions.length > 0) {
        goToStep(15);
      }
    });
  }

  // Pantalla 16: Profesores que te inspiran y te motivan
  const toStep17Btn = document.getElementById('toStep17');
  
  if (toStep17Btn) {
    // Esta pantalla no necesita validación, el botón siempre está habilitado
    toStep17Btn.addEventListener('click', () => {
      goToStep(16);
    });
  }

  // Pantalla 17: ¿Qué harías si la maestría resulta ser más difícil de lo esperado? (solo una opción)
  const difficultyResponseCheckboxes = document.querySelectorAll('input[name="difficulty-response"]');
  const toStep18Btn = document.getElementById('toStep18');
  let selectedDifficultyResponses = [];

  if (difficultyResponseCheckboxes.length && toStep18Btn) {
    difficultyResponseCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          difficultyResponseCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedDifficultyResponses = Array.from(difficultyResponseCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep18Btn.disabled = selectedDifficultyResponses.length === 0;
      });
    });

    toStep18Btn.addEventListener('click', () => {
      if (selectedDifficultyResponses.length > 0) {
        goToStep(17);
      }
    });
  }

  // Pantalla 18: Selección de fecha de inicio
  const calendarHeader = document.getElementById('calendarHeader');
  const calendarBody = document.getElementById('calendarBody');
  const calendarArrow = document.getElementById('calendarArrow');
  const monthName = document.getElementById('monthName');
  const yearSelector = document.getElementById('yearSelector');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const daysContainer = document.getElementById('calendarDays');
  const displayDate = document.getElementById('displayDate');
  const fechaSeleccionada = document.getElementById('fecha_seleccionada');
  const toStep19Btn = document.getElementById('toStep19');

  if (calendarHeader && calendarBody && toStep19Btn) {
    let currentDate = new Date();
    let selectedDate = null;

    function populateYearSelector() {
      yearSelector.innerHTML = '';
      for (let year = 2025; year <= 2050; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
      }
      yearSelector.value = currentDate.getFullYear();
    }

    function formatDate(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    function renderCalendar(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();

      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      monthName.textContent = monthNames[month];
      yearSelector.value = year;

      daysContainer.innerHTML = '';

      const prevMonthLastDate = new Date(year, month, 0).getDate();
      for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'other-month');
        dayElement.textContent = prevMonthLastDate - i;
        daysContainer.appendChild(dayElement);
      }

      for (let day = 1; day <= lastDate; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        const today = new Date();
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
          dayElement.classList.add('today');
        }

        if (selectedDate && day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
          dayElement.classList.add('selected');
        }

        dayElement.addEventListener('click', function () {
          document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
          dayElement.classList.add('selected');
          selectedDate = new Date(year, month, day);

          const isoDate = formatDate(selectedDate);
          fechaSeleccionada.value = isoDate;
          displayDate.textContent = `${day} de ${monthNames[month]} del ${year}`;
          toStep19Btn.disabled = false;
        });

        daysContainer.appendChild(dayElement);
      }

      const totalDaysShown = firstDay + lastDate;
      const remainingDays = 42 - totalDaysShown;
      for (let i = 1; i <= remainingDays; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'other-month');
        dayElement.textContent = i;
        daysContainer.appendChild(dayElement);
      }
    }

    if (prevMonthBtn && nextMonthBtn) {
      prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
      });

      nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
      });
    }

    if (yearSelector) {
      yearSelector.addEventListener('change', function () {
        const newYear = parseInt(this.value);
        currentDate.setFullYear(newYear);
        renderCalendar(currentDate);
      });
    }

    if (calendarHeader) {
      calendarHeader.addEventListener('click', function () {
        const isHidden = !calendarBody.classList.contains('show');
        calendarBody.classList.toggle('show', isHidden);
        calendarArrow.classList.toggle('open', isHidden);
      });
    }

    document.addEventListener('click', function (e) {
      if (!calendarHeader.contains(e.target) && !calendarBody.contains(e.target)) {
        calendarBody.classList.remove('show');
        calendarArrow.classList.remove('open');
      }
    });

    // Inicializar calendario
    populateYearSelector();
    renderCalendar(currentDate);
    toStep19Btn.disabled = true;

    toStep19Btn.addEventListener('click', () => {
      if (selectedDate) {
        goToStep(18);
      }
    });
  }

  // Pantalla 19: Financiamiento de estudios
  const financingCheckboxes = document.querySelectorAll('input[name="financing"]');
  const toStep20Btn = document.getElementById('toStep20');
  let selectedFinancing = [];

  if (financingCheckboxes.length && toStep20Btn) {
    financingCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          financingCheckboxes.forEach(cb => { if (cb !== checkbox) cb.checked = false; });
        }
        selectedFinancing = Array.from(financingCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep20Btn.disabled = selectedFinancing.length === 0;
      });
    });

    toStep20Btn.addEventListener('click', () => {
      if (selectedFinancing.length > 0) {
        goToStep(19);
      }
    });
  }

  // Pantalla 20: Aprende con los mejores
  const toStep21Btn = document.getElementById('toStep21');
  
  if (toStep21Btn) {
    // Esta pantalla es informativa, el botón siempre está habilitado
    toStep21Btn.addEventListener('click', async () => {
      goToStep(20);
      
      // Cargar programas automáticamente cuando se llega a la pantalla 21
      const lineaId = professionSelect ? professionSelect.value : '';
      const formacionId = postgraduateSelect ? postgraduateSelect.value : '';
      const modalidadId = selectedModality;
      
      console.log('=== DEBUG PANTALLA 21 ===');
      console.log('professionSelect.value:', professionSelect ? professionSelect.value : 'null');
      console.log('postgraduateSelect.value:', postgraduateSelect ? postgraduateSelect.value : 'null');
      console.log('selectedModality:', selectedModality);
      console.log('Tipos:', typeof lineaId, typeof formacionId, typeof modalidadId);
      
      if (lineaId && formacionId && modalidadId) {
        console.log('Cargando programas para pantalla 21...');
        await cargarProgramasPorFiltros(lineaId, formacionId, modalidadId);
      } else {
        console.warn('No se pueden cargar programas: faltan datos de selección previa');
        console.warn('lineaId:', lineaId, 'formacionId:', formacionId, 'modalidadId:', modalidadId);
      }
    });
  }

  // Pantalla 21: Datos de contacto (pantalla final)
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const celularInput = document.getElementById('celular');
  const submitFormBtn = document.getElementById('submitForm');
  let contactData = {
    nombre: '',
    email: '',
    celular: ''
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  }

  function validateContactForm() {
    const isNameValid = nombreInput.value.trim().length >= 3;
    const isEmailValid = validateEmail(emailInput.value);
    const isPhoneValid = validatePhone(celularInput.value);
    const programSelect = document.getElementById('programSelect');
    
    // Permitir envío si no hay programa disponible o si se seleccionó uno
    const isProgramSelected = window.noProgramaDisponible || (programSelect && programSelect.value !== '');
    
    submitFormBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid && isProgramSelected);
  }

  if (nombreInput && emailInput && celularInput && submitFormBtn) {
    [nombreInput, emailInput, celularInput].forEach(input => {
      input.addEventListener('input', () => {
        contactData[input.name] = input.value.trim();
        validateContactForm();
      });
    });

    // Agregar listener para el select de programa
    const programSelect = document.getElementById('programSelect');
    if (programSelect) {
      programSelect.addEventListener('change', () => {
        validateContactForm();
      });
    }

    submitFormBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!submitFormBtn.disabled) {
        // Cargar programas antes de enviar si no se ha hecho
        const programSelect = document.getElementById('programSelect');
        if (programSelect && (!programSelect.options.length || programSelect.options.length <= 1)) {
          const lineaId = professionSelect ? professionSelect.value : '';
          const formacionId = postgraduateSelect ? postgraduateSelect.value : '';
          const modalidadId = selectedModality;
          
          if (lineaId && formacionId && modalidadId) {
            await cargarProgramasPorFiltros(lineaId, formacionId, modalidadId);
          }
        }

        // Validar que se haya seleccionado un programa o que no haya programas disponibles
        const selectedProgramName = document.querySelector('.custom-select[data-select="programSelect"] .custom-select__trigger span')?.textContent;
        
        let programaParaEnviar = '';
        
        if (window.noProgramaDisponible) {
            // Si no hay programas disponibles, enviar cadena vacía
            programaParaEnviar = '';
        } else if (!selectedProgramName || selectedProgramName === 'Selecciona un programa') {
            alert('Por favor, selecciona un programa de interés.');
            return;
        } else {
            // Si hay programa seleccionado, enviarlo
            programaParaEnviar = selectedProgramName;
        }

        const formData = {
          age: selectedAge,
          gender: genderSelect ? genderSelect.value : '',
          profession: professionSelect ? professionSelect.value : '',
          postgraduate: postgraduateSelect ? postgraduateSelect.value : '',
          reasons: selectedReasons,
          seguridad: selectedSeguridad,
          stress: selectedStress,
          study_comfort: selectedStudyComfort,
          learning_methods: selectedLearningMethods,
          modalities: selectedModality,
          challenges: selectedChallenges,
          future_vision: selectedFutureVisions,
          difficulty_response: selectedDifficultyResponses,
          start_date: document.getElementById('fecha_seleccionada').value,
          financing: selectedFinancing,
          programa: programaParaEnviar, // Usar la variable que maneja ambos casos
          contact: contactData
        };

        try {
          const response = await fetch('backend/guardar_formulario_ajax.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const result = await response.json();
          if (result.success) {
            // Navegar a la pantalla de agradecimiento (step-22 = índice 21)
            goToStep(21);
          } else {
            alert('Error al guardar: ' + (result.error || 'Intenta nuevamente.'));
          }
        } catch (error) {
          console.error('Error al enviar el formulario:', error);
          alert('Hubo un error al enviar el formulario. Por favor, intenta nuevamente.');
        }
      }
    });
  }

  // Prevenir el envío tradicional del formulario
  const form = document.getElementById('multiStepForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // La lógica de envío se maneja en el botón de la última pantalla (toStep7Btn)
    });
  }

  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      console.error('Índice de paso inválido:', stepIndex, 'Total steps:', steps.length);
      return;
    }

    steps[currentStep].classList.remove('active');
    steps[stepIndex].classList.add('active');
    currentStep = stepIndex;
    updateProgress();

    // Ocultar barra de progreso en pantallas 1, 7, 10, 13, 20, 22
    const mainContainer = document.querySelector('.form-container');
    const headerContainer = document.querySelector('.header-container');
    const footer = document.querySelector('.form-footer');
    const body = document.body;
    const hideProgressScreens = [0, 6, 9, 12, 19, 21]; // 0-based: 1,7,10,13,20,22
    if (mainContainer) {
      if (hideProgressScreens.includes(stepIndex)) {
        mainContainer.classList.add('hide-progress-bar');
      } else {
        mainContainer.classList.remove('hide-progress-bar');
      }
    }

    // Cambios de fondo para las pantallas específicas
    if (mainContainer && headerContainer && footer && body) {
      const specialBackgroundScreens = [1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21]; // Incluir pantalla 22
      if (specialBackgroundScreens.includes(stepIndex)) {
        mainContainer.style.background = 'linear-gradient(180deg, #F8F4F0 0%, #DDD0C8 100%)';
        footer.style.background = '#DDD0C8';
        body.style.background = 'linear-gradient(180deg, #F8F4F0 0%, #DDD0C8 100%)';
        footer.style.backdropFilter = 'none';
        footer.style.borderTop = 'none';
        
        // Aplicar color de fondo al header - transparente en todas las pantallas
        headerContainer.style.setProperty('background', 'transparent', 'important');
        console.log('Header aplicado transparente:', stepIndex);
      } else {
        mainContainer.style.background = '';
        headerContainer.style.removeProperty('background');
        footer.style.background = '';
        body.style.background = '';
        footer.style.backdropFilter = '';
        footer.style.borderTop = '';
      }
    }

    // Focus en el primer elemento interactivo del nuevo paso
    const firstInteractive = steps[stepIndex].querySelector('button, select, input');
    if (firstInteractive) firstInteractive.focus();
  }

  function updateProgress() {
    const percent = ((currentStep + 1) / steps.length) * 100;
    progress.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', Math.round(percent));
  }

  // Inicializa progreso
  updateProgress();

  // Oculta la barra de progreso si la pantalla inicial es una de las que la requiere oculta
  const mainContainer = document.querySelector('.form-container');
  const hideProgressScreens = [0, 6, 9, 12, 19, 21]; // 0-based: 1,7,10,13,20,22
  if (mainContainer && hideProgressScreens.includes(currentStep)) {
    mainContainer.classList.add('hide-progress-bar');
  }
  
  // Manejador para adaptar el header cuando cambia el tamaño de la ventana
  window.addEventListener('resize', () => {
    const headerContainer = document.querySelector('.header-container');
    const specialBackgroundScreens = [1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21]; // Incluir pantalla 22
    if (headerContainer && specialBackgroundScreens.includes(currentStep)) {
      headerContainer.style.setProperty('background', 'transparent', 'important');
      console.log('Header resize aplicado transparente:', currentStep);
    }
  });
  
  // Aplicar estilo inicial del header si estamos en una pantalla especial
  const initialHeaderContainer = document.querySelector('.header-container');
  const initialSpecialScreens = [1, 2, 3, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 18, 19, 20, 21]; // Incluir pantalla 22
  if (initialHeaderContainer && initialSpecialScreens.includes(currentStep)) {
    initialHeaderContainer.style.setProperty('background', 'transparent', 'important');
    console.log('Header inicial aplicado transparente:', currentStep);
  }
}); // Cierre de DOMContentLoaded
