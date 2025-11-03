// js/programa_whatsapp.js

/**
 * Configuración de WhatsApp
 * Edita estos valores según tus necesidades
 */
const WHATSAPP_CONFIG = {
    // Número de WhatsApp (formato internacional sin + ni espacios)
    // Ejemplo: Para Colombia +57 300 1234567 usar: 573001234567
    numeroWhatsApp: '573001234567',
    
    // Mensaje base que se enviará (puedes personalizarlo)
    mensajeBase: 'Hola, por favor quiero más información de'
};

/**
 * Abre WhatsApp con un mensaje predefinido sobre el programa seleccionado
 * @param {number} programaId - ID del programa
 * @param {string} programaNombre - Nombre del programa
 */
function enviarWhatsAppPrograma(programaId, programaNombre) {
    console.log('Enviando consulta por WhatsApp:', {
        id: programaId,
        nombre: programaNombre
    });

    // Construir el mensaje personalizado
    const mensaje = `${WHATSAPP_CONFIG.mensajeBase} ${programaNombre}`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Construir la URL de WhatsApp
    // Usar api.whatsapp.com para que funcione en desktop y mobile
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${WHATSAPP_CONFIG.numeroWhatsApp}&text=${mensajeCodificado}`;
    
    console.log('URL de WhatsApp generada:', urlWhatsApp);
    
    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(urlWhatsApp, '_blank');
    
    // Log para analytics o seguimiento (opcional)
    console.log('✓ Consulta enviada por WhatsApp:', {
        programa: programaNombre,
        id: programaId,
        timestamp: new Date().toISOString()
    });
}

/**
 * Función alternativa si quieres personalizar más el mensaje
 * @param {number} programaId - ID del programa
 * @param {string} programaNombre - Nombre del programa
 * @param {object} datosUsuario - Datos adicionales del usuario (opcional)
 */
function enviarWhatsAppPersonalizado(programaId, programaNombre, datosUsuario = {}) {
    let mensaje = `${WHATSAPP_CONFIG.mensajeBase} ${programaNombre}`;
    
    // Agregar información adicional si está disponible
    if (datosUsuario.nombre) {
        mensaje += `\n\nMi nombre es: ${datosUsuario.nombre}`;
    }
    
    if (datosUsuario.email) {
        mensaje += `\nCorreo: ${datosUsuario.email}`;
    }
    
    if (datosUsuario.telefono) {
        mensaje += `\nTeléfono: ${datosUsuario.telefono}`;
    }
    
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${WHATSAPP_CONFIG.numeroWhatsApp}&text=${mensajeCodificado}`;
    
    window.open(urlWhatsApp, '_blank');
    
    console.log('✓ Consulta personalizada enviada por WhatsApp');
}

/**
 * Configurar el número de WhatsApp dinámicamente
 * @param {string} nuevoNumero - Nuevo número en formato internacional
 */
function configurarNumeroWhatsApp(nuevoNumero) {
    // Limpiar el número de espacios, guiones y el símbolo +
    const numeroLimpio = nuevoNumero.replace(/[\s\-\+]/g, '');
    
    if (numeroLimpio.length >= 10) {
        WHATSAPP_CONFIG.numeroWhatsApp = numeroLimpio;
        console.log('✓ Número de WhatsApp actualizado:', numeroLimpio);
        return true;
    } else {
        console.error('Error: El número debe tener al menos 10 dígitos');
        return false;
    }
}

/**
 * Configurar el mensaje base dinámicamente
 * @param {string} nuevoMensaje - Nuevo mensaje base
 */
function configurarMensajeBase(nuevoMensaje) {
    if (nuevoMensaje && nuevoMensaje.trim().length > 0) {
        WHATSAPP_CONFIG.mensajeBase = nuevoMensaje.trim();
        console.log('✓ Mensaje base actualizado:', WHATSAPP_CONFIG.mensajeBase);
        return true;
    } else {
        console.error('Error: El mensaje no puede estar vacío');
        return false;
    }
}

/**
 * Obtener la configuración actual
 * @returns {object} Configuración actual de WhatsApp
 */
function obtenerConfiguracion() {
    return {
        numero: WHATSAPP_CONFIG.numeroWhatsApp,
        mensaje: WHATSAPP_CONFIG.mensajeBase
    };
}

// Exponer funciones globalmente para uso en otros scripts
window.enviarWhatsAppPrograma = enviarWhatsAppPrograma;
window.enviarWhatsAppPersonalizado = enviarWhatsAppPersonalizado;
window.configurarNumeroWhatsApp = configurarNumeroWhatsApp;
window.configurarMensajeBase = configurarMensajeBase;
window.obtenerConfiguracionWhatsApp = obtenerConfiguracion;

console.log('✓ Módulo programa_whatsapp.js cargado correctamente');
console.log('Configuración actual:', obtenerConfiguracion());
