document.addEventListener('DOMContentLoaded', function() {
    // Instanciar la clase Auth
    const auth = new Auth();
    
    // Verificar si ya hay una sesión activa
    if (auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Función para limpiar mensajes de error
    function clearErrors() {
        usernameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        usernameInput.classList.remove('error');
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }

    // Función para mostrar errores
    function showError(element, message) {
        element.textContent = message;
        element.previousElementSibling.classList.add('error');
    }

    // Validación en tiempo real del nombre de usuario
    usernameInput.addEventListener('input', function() {
        const username = this.value.trim();
        try {
            auth.validateUsername(username);
            usernameError.textContent = '';
            usernameInput.classList.remove('error');
        } catch (error) {
            showError(usernameError, error.message);
        }
    });

    // Validación en tiempo real del email
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        if (!auth.validateEmail(email)) {
            showError(emailError, 'Email inválido');
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
        }
    });

    // Validación en tiempo real de la contraseña
    passwordInput.addEventListener('input', function() {
        const password = this.value.trim();
        try {
            auth.validatePassword(password);
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
        } catch (error) {
            showError(passwordError, error.message);
        }
    });

    // Manejar el envío del formulario
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validaciones básicas
        if (!username) {
            showError(usernameError, 'El nombre de usuario es requerido');
            return;
        }

        if (!email) {
            showError(emailError, 'El email es requerido');
            return;
        }

        if (!password) {
            showError(passwordError, 'La contraseña es requerida');
            return;
        }

        try {
            // Intentar registrar al usuario
            await auth.register(username, email, password);
            
            // Mostrar mensaje de éxito
            alert('¡Registro exitoso! Por favor, inicia sesión.');
            
            // Redirigir al login
            window.location.href = 'login.html';
        } catch (error) {
            // Manejar errores específicos
            if (error.message.includes('usuario')) {
                showError(usernameError, error.message);
            } else if (error.message.includes('email')) {
                showError(emailError, error.message);
            } else if (error.message.includes('contraseña')) {
                showError(passwordError, error.message);
            } else {
                // Para otros errores, mostrar en todos los campos
                showError(usernameError, error.message);
                showError(emailError, error.message);
                showError(passwordError, error.message);
            }
        }
    });
});