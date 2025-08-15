// Validación del formulario de contacto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form__data');
    const nombreInput = document.getElementById('contact__nombre');
    const mensajeInput = document.getElementById('contact__mensaje');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = nombreInput.value.trim();
            const mensaje = mensajeInput.value.trim();
            
            // Validar campos
            if (!nombre) {
                alert('Por favor, ingresa tu nombre');
                nombreInput.focus();
                return;
            }
            
            if (nombre.length < 2) {
                alert('El nombre debe tener al menos 2 caracteres');
                nombreInput.focus();
                return;
            }
            
            if (!mensaje) {
                alert('Por favor, escribe tu mensaje');
                mensajeInput.focus();
                return;
            }
            
            if (mensaje.length < 10) {
                alert('El mensaje debe tener al menos 10 caracteres');
                mensajeInput.focus();
                return;
            }
            
            // Si todo está bien, mostrar mensaje de éxito
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¡Mensaje enviado!',
                    text: `Gracias ${nombre}, hemos recibido tu mensaje y te contactaremos pronto.`,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                alert(`¡Gracias ${nombre}! Tu mensaje ha sido enviado correctamente.`);
            }
            
            // Limpiar formulario
            form.reset();
        });
    }
});
