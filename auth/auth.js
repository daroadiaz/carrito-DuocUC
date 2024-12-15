class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.isAdmin = false;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        // Mínimo 8 caracteres
        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }
        // Debe contener al menos un número
        if (!/\d/.test(password)) {
            throw new Error('La contraseña debe contener al menos un número');
        }
        // Debe contener al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) {
            throw new Error('La contraseña debe contener al menos una letra mayúscula');
        }
        // Debe contener al menos un carácter especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new Error('La contraseña debe contener al menos un carácter especial');
        }
        return true;
    }

    validateUsername(username) {
        if (username.length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            throw new Error('El nombre de usuario solo puede contener letras, números y guiones bajos');
        }
        return true;
    }

    register(username, email, password, role = 'customer') {
        // Validaciones
        if (!username || !email || !password) {
            throw new Error('Todos los campos son obligatorios');
        }

        this.validateUsername(username);

        if (!this.validateEmail(email)) {
            throw new Error('Email inválido');
        }

        // Validar si el usuario ya existe
        if (this.users.find(user => user.email === email)) {
            throw new Error('El email ya está registrado');
        }

        if (this.users.find(user => user.username === username)) {
            throw new Error('El nombre de usuario ya está en uso');
        }

        this.validatePassword(password);

        const user = {
            id: Date.now().toString(),
            username,
            email,
            password,
            role,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            active: true
        };

        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        return user;
    }

    login(email, password) {
        if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
        }

        const user = this.users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        if (!user.active) {
            throw new Error('Usuario desactivado. Contacte al administrador');
        }

        user.lastLogin = new Date().toISOString();
        this.currentUser = user;
        this.isAdmin = user.role === 'admin';

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUser(user);

        return user;
    }

    logout() {
        this.currentUser = null;
        this.isAdmin = false;
        localStorage.removeItem('currentUser');
    }

    updateUser(user) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
            localStorage.setItem('users', JSON.stringify(this.users));
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateProfile(userId, newData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const updateData = { ...newData };

        // Validar nueva contraseña si se proporciona
        if (updateData.password) {
            this.validatePassword(updateData.password);
        }

        // Validar nuevo email si se proporciona
        if (updateData.email && updateData.email !== this.users[userIndex].email) {
            if (!this.validateEmail(updateData.email)) {
                throw new Error('Email inválido');
            }
            if (this.users.some(u => u.email === updateData.email && u.id !== userId)) {
                throw new Error('El email ya está en uso');
            }
        }

        // Validar nuevo username si se proporciona
        if (updateData.username && updateData.username !== this.users[userIndex].username) {
            this.validateUsername(updateData.username);
            if (this.users.some(u => u.username === updateData.username && u.id !== userId)) {
                throw new Error('El nombre de usuario ya está en uso');
            }
        }

        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updateData,
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem('users', JSON.stringify(this.users));

        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return this.users[userIndex];
    }

    resetPassword(email) {
        if (!email) {
            throw new Error('Email es requerido');
        }

        if (!this.validateEmail(email)) {
            throw new Error('Email inválido');
        }

        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('No existe una cuenta asociada a este email');
        }
        return {
            success: true,
            message: 'Se ha enviado un enlace de recuperación a tu email'
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}