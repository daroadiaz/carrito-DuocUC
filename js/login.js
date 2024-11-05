document.addEventListener('DOMContentLoaded', function () {
    // Instanciar la clase Auth
    const auth = new Auth();

    // Verificar si ya hay una sesión activa
    if (auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Función para limpiar mensajes de error
    function clearErrors() {
        emailError.textContent = '';
        passwordError.textContent = '';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    // Función para mostrar errores
    function showError(element, message) {
        element.textContent = message;
        element.previousElementSibling.classList.add('error');
    }

    // Manejar el envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validaciones básicas
        if (!email) {
            showError(emailError, 'El email es requerido');
            return;
        }

        if (!password) {
            showError(passwordError, 'La contraseña es requerida');
            return;
        }

        try {
            // Intentar iniciar sesión
            await auth.login(email, password);

            // Mostrar mensaje de éxito
            alert('¡Inicio de sesión exitoso!');

            // Redirigir al usuario
            window.location.href = 'index.html';
        } catch (error) {
            // Manejar errores específicos
            if (error.message.includes('email')) {
                showError(emailError, error.message);
            } else if (error.message.includes('contraseña')) {
                showError(passwordError, error.message);
            } else {
                // Para otros errores, mostrar en ambos campos
                showError(emailError, 'Credenciales inválidas');
                showError(passwordError, 'Credenciales inválidas');
            }
        }
    });

    // Limpiar errores cuando el usuario comienza a escribir
    emailInput.addEventListener('input', () => {
        emailError.textContent = '';
        emailInput.classList.remove('error');
    });

    passwordInput.addEventListener('input', () => {
        passwordError.textContent = '';
        passwordInput.classList.remove('error');
    });
});