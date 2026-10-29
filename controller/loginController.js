// Controlador de Inicio de Sesión
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login__form');
    const emailInput = document.getElementById('login__email');
    const passwordInput = document.getElementById('login__password');
    const errorMessages = document.querySelectorAll('.login__message-error');

    // 0: error email, 1: error password, 2: error credenciales
    const errorEmail = errorMessages[0];
    const errorPassword = errorMessages[1];
    const errorCredenciales = errorMessages[2];

    const ocultarErrores = () => {
        if (errorEmail) errorEmail.style.display = 'none';
        if (errorPassword) errorPassword.style.display = 'none';
        if (errorCredenciales) errorCredenciales.style.display = 'none';
    };

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            ocultarErrores();

            const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';

            let hayError = false;

            if (!email) {
                if (errorEmail) {
                    errorEmail.textContent = 'El correo electrónico es requerido';
                    errorEmail.style.display = 'block';
                }
                hayError = true;
            }

            if (!password) {
                if (errorPassword) {
                    errorPassword.textContent = 'La contraseña es requerida';
                    errorPassword.style.display = 'block';
                }
                hayError = true;
            }

            if (hayError) return;

            // Usuarios predeterminados del sistema
            const usuariosDefault = [
                { email: 'nayeli.carrizales.diaz@gmail.com' }, // Cuenta de la creadora (acepta cualquier clave ingresada)
                { email: 'admin@alurageek.com', password: 'admin' },
                { email: 'test@test.test', password: '123' },
                { email: 'cesar@gmail.com', password: '123' },
                { email: 'tatiana27ocean@gmail.com', password: '1234' }
            ];

            // Usuarios registrados localmente
            let usuariosRegistrados = [];
            try {
                const data = localStorage.getItem('alurageek_usuarios');
                if (data) usuariosRegistrados = JSON.parse(data);
            } catch (err) {
                console.warn('Error al leer usuarios locales:', err);
            }

            const todosUsuarios = [...usuariosDefault, ...usuariosRegistrados];

            // Validar si el usuario existe y coincide
            const usuarioValido = todosUsuarios.find(u => {
                if (u.email.toLowerCase() === email) {
                    // Si es la cuenta principal de Nayeli, permitir acceso
                    if (u.email.toLowerCase() === 'nayeli.carrizales.diaz@gmail.com') return true;
                    // Para otros usuarios, validar contraseña si existe
                    if (!u.password || u.password === password) return true;
                }
                return false;
            });

            if (usuarioValido) {
                // Guardar sesión
                sessionStorage.setItem('alurageek_auth', 'true');
                sessionStorage.setItem('alurageek_user', email);

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Bienvenido(a)!',
                        text: 'Inicio de sesión exitoso. Redirigiendo...',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'adminProducts.html';
                    });
                } else {
                    window.location.href = 'adminProducts.html';
                }
            } else {
                if (errorCredenciales) {
                    errorCredenciales.style.display = 'block';
                }
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Error de autenticación',
                        text: 'Correo o contraseña incorrectos.',
                        icon: 'error',
                        confirmButtonText: 'Reintentar'
                    });
                }
            }
        });
    }
});
