// Funcionalidad JavaScript para la página
const categoriaSelect = document.getElementById('categoria');
const productoSelect = document.getElementById('producto');
const listaCarrito = document.getElementById('lista-carrito');
const subtotalSpan = document.getElementById('subtotal');
const ivaSpan = document.getElementById('iva');
const totalSpan = document.getElementById('total');
const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
const montoPagadoSpan = document.getElementById('monto-pagado');

let carrito = [];
let productosDisponibles = {
    accesorios: [],
    computadoras: [],
    componentes: [],
    monitores: [],
    periféricos: [],
    muebles: [],
    impresoras: [],
    almacenamiento: [],
    red: []
};

// Cargar productos desde el servidor
async function cargarProductos() {
    try {
        const response = await fetch('/api/products');
        const productos = await response.json();
        
        // Organizar productos por categoría
        productos.forEach(producto => {
            const categoria = producto.categoria || 'accesorios';
            if (!productosDisponibles[categoria]) {
                productosDisponibles[categoria] = [];
            }
            productosDisponibles[categoria].push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                urlImagen: producto.urlImagen,
                descripcion: producto.descripcion
            });
        });
        
        console.log('Productos cargados desde el servidor:', productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        // Cargar productos por defecto si falla la conexión
        productosDisponibles = {
            accesorios: [
                { id: 1, nombre: 'Mouse Inalámbrico', precio: 15.00 },
                { id: 2, nombre: 'Teclado Mecánico', precio: 60.00 },
                { id: 3, nombre: 'Audífonos Gaming', precio: 45.00 },
                { id: 4, nombre: 'Webcam HD', precio: 30.00 }
            ],
            computadoras: [
                { id: 5, nombre: 'Laptop Dell XPS 15', precio: 1200.00 },
                { id: 6, nombre: 'Desktop HP Envy', precio: 850.00 },
                { id: 7, nombre: 'MacBook Pro 16"', precio: 2500.00 },
                { id: 8, nombre: 'Laptop Lenovo ThinkPad', precio: 1100.00 },
                { id: 9, nombre: 'Desktop Gamer Alienware', precio: 1800.00 }
            ]
        };
    }
}

// Llamar al cargar la página
cargarProductos();

const tasaIVAVenezuela = 0.16;

categoriaSelect.addEventListener('change', function() {
    productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
    productoSelect.disabled = false;
    const categoriaSeleccionada = categoriaSelect.value;
    if (categoriaSeleccionada && productosDisponibles[categoriaSeleccionada]) {
        productosDisponibles[categoriaSeleccionada].forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = producto.nombre;
            productoSelect.appendChild(option);
        });
    } else {
        productoSelect.disabled = true;
    }
});

function agregarAlCarrito() {
    const productoId = parseInt(productoSelect.value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const categoriaSeleccionada = categoriaSelect.value;
    const productoSeleccionado = productosDisponibles[categoriaSeleccionada].find(p => p.id === productoId);

    if (productoSeleccionado && cantidad > 0) {
        const itemEnCarrito = carrito.find(item => item.id === productoId);
        if (itemEnCarrito) {
            itemEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...productoSeleccionado, cantidad: cantidad });
        }
        actualizarCarrito();
    } else {
        alert('Por favor, seleccione un producto y una cantidad válida.');
    }
}

function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let subtotal = 0;
    carrito.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} x ${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}`;
        listaCarrito.appendChild(li);
        subtotal += item.precio * item.cantidad;
    });
    const iva = subtotal * tasaIVAVenezuela;
    const total = subtotal + iva;
    subtotalSpan.textContent = subtotal.toFixed(2);
    ivaSpan.textContent = iva.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
}

function realizarPago() {
    const nombre = document.getElementById('nombre').value;
    const cedula = document.getElementById('cedula').value;
    const datosCompra = {
        nombre,
        cedula,
        carrito: carrito,
        total: parseFloat(totalSpan.textContent)
    };

    console.log('Datos de la compra a enviar al servidor:', datosCompra);

    setTimeout(() => {
        const pagoExitoso = true;

        if (pagoExitoso) {
            mensajeConfirmacion.style.display = 'block';
            montoPagadoSpan.textContent = datosCompra.total.toFixed(2);

            carrito = [];
            actualizarCarrito();

            document.querySelectorAll('.formulario-pago input, .formulario-pago select, .formulario-pago button').forEach(element => {
                element.disabled = true;
            });

            guardarDatosUsuarioYCompra(datosCompra);
        } else {
            alert('Hubo un problema al procesar el pago. Por favor, intente nuevamente.');
        }
    }, 2000);
}

function guardarDatosUsuarioYCompra(datos) {
    console.log('Enviando datos al backend para guardar:', datos);
    alert('Simulando el envío de datos del usuario y la compra al backend para guardar en la base de datos.');
}