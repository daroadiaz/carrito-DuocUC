const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const userInfo = document.querySelector('#user-info');
const authButtons = document.querySelector('#auth-buttons');
const auth = new Auth();
const finalizarCompraBtn = document.querySelector('#finalizar-compra');
let articulosCarrito = [];

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación al cargar la página
    if (!auth.isAuthenticated()) {
        // Si no hay sesión, redirigir a login
        window.location.href = '../login/login.html';
        return;
    }

    // Si hay sesión, inicializar la UI
    inicializarUI();
    cargarEventListeners();
});

function inicializarUI() {
    // Obtener usuario actual
    const usuario = auth.getCurrentUser();

    // Mostrar información del usuario
    userInfo.innerHTML = `
        <h3 class="welcome-message">
            Bienvenido  ${usuario.username}
        </h3>
    `;

    // Mostrar botón de cerrar sesión
    authButtons.innerHTML = `
        <button id="logout" class="button button-primary">
            Cerrar Sesión
        </button>
    `;

    // Agregar evento al botón de cerrar sesión
    document.getElementById('logout').addEventListener('click', function() {
        auth.logout();
        window.location.href = './login/login.html';
    });

    // Cargar carrito guardado
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoHTML();
}

function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // Reseteamos el arreglo
        limpiarHTML(); // Eliminamos todo el HTML
        sincronizarStorage();

        
    });
    finalizarCompraBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (articulosCarrito.length > 0) {
            window.location.href = './checkout/checkout.html';
        } else {
            alert('El carrito está vacío');
        }
    });

}

function agregarCurso(e) {
    e.preventDefault();
    
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
        mostrarMensajeAgregado(cursoSeleccionado);
    }
}

function mostrarMensajeAgregado(curso) {
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-agregado';
    mensaje.textContent = 'Curso agregado al carrito';
    mensaje.style.cssText = 'background-color: #4CAF50; color: white; padding: 10px; text-align: center; margin-top: 10px;';
    
    curso.appendChild(mensaje);
    
    setTimeout(() => {
        mensaje.remove();
    }, 2000);
}

function eliminarCurso(e) {
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        
        // Eliminar del arreglo por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        
        carritoHTML(); // Volvemos a generar el HTML
        sincronizarStorage();
    }
}

function leerDatosCurso(curso) {
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img.card-img-top').src,
        titulo: curso.querySelector('.card-title').textContent,
        precio: curso.querySelector('.card-text').textContent,
        id: curso.querySelector('button.agregar-carrito').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    
    if (existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            } else {
                return curso; // retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // Agregar elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
    sincronizarStorage();
}

// Muestra el Carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
}

// Sincronizar con localStorage
function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}