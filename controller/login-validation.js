// Validación de campos de login en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('login__email');
    const passwordInput = document.getElementById('login__password');

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const errorMsg = emailInput.parentElement.querySelector('.login__message-error');
            if (errorMsg) {
                if (emailInput.value.trim().length > 0) {
                    errorMsg.style.display = 'none';
                }
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            const errorMsg = passwordInput.parentElement.querySelector('.login__message-error');
            if (errorMsg) {
                if (passwordInput.value.trim().length > 0) {
                    errorMsg.style.display = 'none';
                }
            }
        });
    }
});
