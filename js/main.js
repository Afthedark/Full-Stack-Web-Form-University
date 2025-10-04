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
      select.classList.toggle('open');
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
      });
    });
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener('click', (e) => {
    const isSelect = e.target.closest('.custom-select');
    if (!isSelect) {
      closeAllSelects();
    }
  });

  function closeAllSelects(except = null) {
    customSelects.forEach(select => {
      if (select !== except) {
        select.classList.remove('open');
      }
    });
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


  // Pantalla 5: Selección de razones (checkboxes)
  const checkboxes = document.querySelectorAll('input[name="razon"]');
  const toStep6Btn = document.getElementById('toStep6');
  let selectedReasons = [];

  if (checkboxes.length && toStep6Btn) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
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
        goToStep(6);

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

  // Pantalla 8: Manejo de presión y estrés
  const stressRadios = document.querySelectorAll('input[name="stress"]');
  const toStep9Btn = document.getElementById('toStep9');
  let selectedStress = null;

  if (stressRadios.length && toStep9Btn) {
    stressRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        selectedStress = radio.value;
        toStep9Btn.disabled = !selectedStress;
      });
    });

    toStep9Btn.addEventListener('click', () => {
      if (selectedStress) {
        goToStep(8);
      }
    });
  }


  // Pantalla 9: Comodidad de estudio (corregido para usar name="study-comfort")
  const studyComfortRadios = document.querySelectorAll('input[name="study-comfort"]');
  const toStep10Btn = document.getElementById('toStep10');
  let selectedStudyComfort = null;

  if (studyComfortRadios.length && toStep10Btn) {
    studyComfortRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        selectedStudyComfort = radio.value;
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
  const toStep11Btn = document.getElementById('toStep11');

  if (toStep11Btn) {
    // Esta pantalla no necesita validación, el botón siempre está habilitado
    toStep11Btn.addEventListener('click', () => {
      goToStep(10);
    });
  }

  // Pantalla 11: Metodología de aprendizaje preferida
  const learningMethodCheckboxes = document.querySelectorAll('input[name="learning-method"]');
  const toStep12Btn = document.getElementById('toStep12');
  let selectedLearningMethods = [];

  if (learningMethodCheckboxes.length && toStep12Btn) {
    learningMethodCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
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

  // Pantalla 12: Modalidad preferida del posgrado
  const modalityCheckboxes = document.querySelectorAll('input[name="modality"]');
  const toStep13Btn = document.getElementById('toStep13');
  let selectedModalities = [];

  if (modalityCheckboxes.length && toStep13Btn) {
    modalityCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        selectedModalities = Array.from(modalityCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        toStep13Btn.disabled = selectedModalities.length === 0;
      });
    });

    toStep13Btn.addEventListener('click', () => {
      if (selectedModalities.length > 0) {
        goToStep(12);
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

  // Pantalla 14: Desafíos al considerar un posgrado
  const challengeCheckboxes = document.querySelectorAll('input[name="challenge"]');
  const toStep15Btn = document.getElementById('toStep15');
  let selectedChallenges = [];

  if (challengeCheckboxes.length && toStep15Btn) {
    challengeCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
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

  // Pantalla 15: ¿Cómo te imaginas en 10 años?
  const futureVisionCheckboxes = document.querySelectorAll('input[name="future-vision"]');
  const toStep16Btn = document.getElementById('toStep16');
  let selectedFutureVisions = [];

  if (futureVisionCheckboxes.length && toStep16Btn) {
    futureVisionCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
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

  // Pantalla 17: ¿Qué harías si la maestría resulta ser más difícil de lo esperado?
  const difficultyResponseCheckboxes = document.querySelectorAll('input[name="difficulty-response"]');
  const toStep18Btn = document.getElementById('toStep18');
  let selectedDifficultyResponses = [];

  if (difficultyResponseCheckboxes.length && toStep18Btn) {
    difficultyResponseCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
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
    toStep21Btn.addEventListener('click', () => {
      goToStep(20);
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
    
    submitFormBtn.disabled = !(isNameValid && isEmailValid && isPhoneValid);
  }

  if (nombreInput && emailInput && celularInput && submitFormBtn) {
    [nombreInput, emailInput, celularInput].forEach(input => {
      input.addEventListener('input', () => {
        contactData[input.name] = input.value.trim();
        validateContactForm();
      });
    });

    submitFormBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (!submitFormBtn.disabled) {
        // Recopilar todos los datos del formulario
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
          modalities: selectedModalities,
          challenges: selectedChallenges,
          future_vision: selectedFutureVisions,
          difficulty_response: selectedDifficultyResponses,
          start_date: document.getElementById('fecha_seleccionada').value,
          financing: selectedFinancing,
          contact: contactData
        };

        try {
          // Aquí iría el código para enviar los datos al servidor
          console.log('Datos del formulario:', formData);
          // Ejemplo de envío:
          // const response = await fetch('/api/submit-form', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(formData)
          // });
          
          // Mostrar mensaje de éxito
          alert('¡Gracias por completar el formulario! Nos pondremos en contacto contigo pronto.');
          
          // Opcional: redirigir a una página de agradecimiento
          // window.location.href = '/gracias.html';
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
      console.error('Índice de paso inválido');
      return;
    }
    
    steps[currentStep].classList.remove('active');
    steps[stepIndex].classList.add('active');
    currentStep = stepIndex;
    updateProgress();
    
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
}); // Cierre de DOMContentLoaded
