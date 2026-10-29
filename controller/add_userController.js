// Controlador para registrar un nuevo usuario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-form]');
    const nameInput = document.querySelector('[data-name]');
    const emailInput = document.querySelector('[data-email]');
    const passwordInput = document.querySelector('[data-password]');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            if (!name || !email || !password) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Campos requeridos',
                        text: 'Por favor completa todos los campos para continuar.',
                        icon: 'warning'
                    });
                } else {
                    alert('Por favor completa todos los campos.');
                }
                return;
            }

            // Obtener usuarios existentes
            let usuarios = [];
            try {
                const data = localStorage.getItem('alurageek_usuarios');
                if (data) usuarios = JSON.parse(data);
            } catch (err) {
                console.warn('Error al leer usuarios locales:', err);
            }

            // Verificar si el usuario ya existe
            const existe = usuarios.some(u => u.email.toLowerCase() === email);
            if (existe) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Usuario ya registrado',
                        text: 'Este correo ya cuenta con un usuario registrado. Inicia sesión directamente.',
                        icon: 'info'
                    });
                } else {
                    alert('Este correo ya está registrado.');
                }
                return;
            }

            // Guardar nuevo usuario
            const nuevoUsuario = {
                id: (typeof uuid !== 'undefined' && uuid.v4) ? uuid.v4() : String(Date.now()),
                name,
                email,
                password
            };

            usuarios.push(nuevoUsuario);
            localStorage.setItem('alurageek_usuarios', JSON.stringify(usuarios));

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '¡Registro Exitoso!',
                    text: `El usuario ${name} ha sido creado correctamente.`,
                    icon: 'success',
                    timer: 1800,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            } else {
                alert('Usuario registrado con éxito.');
                window.location.href = 'login.html';
            }
        });
    }
});
