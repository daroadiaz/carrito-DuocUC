document.addEventListener('DOMContentLoaded', function() {
    const auth = new Auth();
    const checkoutForm = document.getElementById('checkout-form');
    const resumenItems = document.getElementById('resumen-items');
    const totalCompra = document.getElementById('total-compra');

    // Verificar autenticación
    if (!auth.isAuthenticated()) {
        window.location.href = '../login/login.html';
        return;
    }

    // Inicializar UI
    inicializarUI();
    mostrarResumenCompra();

    function inicializarUI() {
        const usuario = auth.getCurrentUser();
        const userInfo = document.querySelector('#user-info');
        const authButtons = document.querySelector('#auth-buttons');

        userInfo.innerHTML = `
            <h3 class="welcome-message">Bienvenido, ${usuario.username}</h3>
        `;

        authButtons.innerHTML = `
            <button id="logout" class="button button-primary">Cerrar Sesión</button>
        `;

        document.getElementById('logout').addEventListener('click', function() {
            auth.logout();
            window.location.href = '../login/login.html';
        });
    }

    function mostrarResumenCompra() {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let total = 0;

        if (carrito.length === 0) {
            window.location.href = '../index.html';
            return;
        }

        const html = carrito.map(item => {
            const precio = parseFloat(item.precio.replace('$', ''));
            total += precio * item.cantidad;
            return `
                <div class="resumen-item">
                    <div class="item-info">
                        <img src="${item.imagen}" width="50">
                        <span class="item-titulo">${item.titulo}</span>
                    </div>
                    <div class="item-precio">
                        <span>$${precio} x ${item.cantidad}</span>
                        <strong>$${precio * item.cantidad}</strong>
                    </div>
                </div>
            `;
        }).join('');

        resumenItems.innerHTML = html;
        totalCompra.innerHTML = `<h3>Total: $${total}</h3>`;
    }

    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const direccion = document.getElementById('direccion').value.trim();

        // Validaciones
        if (!nombre || !email || !direccion) {
            alert('Por favor, complete todos los campos');
            return;
        }

        // Simular procesamiento de compra
        setTimeout(() => {
            alert('¡Compra exitosa!');
            // Limpiar carrito
            localStorage.removeItem('carrito');
            // Redireccionar
            window.location.href = '../index.html';
        }, 1000);
    });
});