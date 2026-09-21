let usuarioActual = null;

// Simula temporalmente DynamoDB Pedidos.
// Al recargar la página este array vuelve a estar vacío.
let pedidos = [];


const productos = [
    {
        nombre: "Notebook Gamer",
        precio: 699990,
        icono: "💻"
    },
    {
        nombre: "Mouse Gamer",
        precio: 24990,
        icono: "🖱️"
    },
    {
        nombre: "Tablet",
        precio: 299990,
        icono: "📱"
    },
    {
        nombre: "Teclado Mecánico",
        precio: 49990,
        icono: "⌨️"
    },
    {
        nombre: "Monitor 24 pulgadas",
        precio: 159990,
        icono: "🖥️"
    },
    {
        nombre: "Audífonos Gamer",
        precio: 39990,
        icono: "🎧"
    }
];


// ==========================================
// CARGAR PRODUCTOS
// ==========================================

function cargarProductos() {

    const catalogo = document.getElementById("catalogo");

    catalogo.innerHTML = "";

    productos.forEach((producto, index) => {

        catalogo.innerHTML += `
            <article class="producto">

                <div class="icono">
                    ${producto.icono}
                </div>

                <h3>${producto.nombre}</h3>

                <p class="precio">
                    ${formatearPrecio(producto.precio)}
                </p>

                <div class="selector-cantidad">

                    <button
                        type="button"
                        class="boton-cantidad"
                        onclick="cambiarCantidad(${index}, -1)">
                        −
                    </button>

                    <span
                        id="cantidad-${index}"
                        class="numero-cantidad">
                        0
                    </span>

                    <button
                        type="button"
                        class="boton-cantidad"
                        onclick="cambiarCantidad(${index}, 1)">
                        +
                    </button>

                </div>

            </article>
        `;

    });
}


// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function cambiarCantidad(index, cambio) {

    const elemento =
        document.getElementById(`cantidad-${index}`);

    let cantidad =
        Number(elemento.textContent);

    cantidad += cambio;

    if (cantidad < 0) {
        cantidad = 0;
    }

    elemento.textContent = cantidad;

    calcularTotal();
}


// ==========================================
// LOGIN
// ==========================================

async function iniciarSesion() {

    const usuario =
        document.getElementById("usuario").value.trim();

    const password =
        document.getElementById("password").value.trim();

    const mensaje =
        document.getElementById("mensajeLogin");


    if (!usuario || !password) {

        mensaje.textContent =
            "Debe ingresar usuario y contraseña";

        return;
    }


    mensaje.textContent = "Validando...";


    try {

        // Simula DynamoDB Usuarios
        const respuesta =
            await fetch("./usuarios.json");

        if (!respuesta.ok) {
            throw new Error(
                "No fue posible cargar usuarios.json"
            );
        }

        const usuarios =
            await respuesta.json();


        const usuarioEncontrado =
            usuarios.find(
                u =>
                    u.usuario === usuario &&
                    u.password === password
            );


        if (!usuarioEncontrado) {

            mensaje.textContent =
                "Usuario o contraseña incorrectos";

            return;
        }


        usuarioActual = usuarioEncontrado;

        mensaje.textContent = "";

        document.getElementById("login")
            .style.display = "none";

        document.getElementById("tienda")
            .style.display = "block";

        document.getElementById("bienvenida")
            .textContent =
            `Bienvenido, ${usuarioActual.nombre}`;

        mostrarPedidos();

    }
    catch (error) {

        console.error(error);

        mensaje.textContent =
            "Error al cargar usuarios.json";
    }
}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    let total = 0;

    productos.forEach((producto, index) => {

        const cantidad =
            Number(
                document.getElementById(
                    `cantidad-${index}`
                ).textContent
            );

        if (cantidad > 0) {

            total +=
                producto.precio * cantidad;
        }

    });


    document.getElementById("total")
        .textContent =
        formatearPrecio(total);
}


// ==========================================
// CREAR PEDIDO
// ==========================================

function realizarPedido() {

    const mensaje =
        document.getElementById("mensajePedido");


    if (!usuarioActual) {

        mensaje.textContent =
            "Debe iniciar sesión";

        return;
    }


    const productosSeleccionados = [];

    let total = 0;


    productos.forEach((producto, index) => {

        const cantidad =
            Number(
                document.getElementById(
                    `cantidad-${index}`
                ).textContent
            );


        if (cantidad > 0) {

            const subtotal =
                producto.precio * cantidad;

            total += subtotal;


            productosSeleccionados.push({
                producto: producto.nombre,
                cantidad: cantidad,
                precio: producto.precio,
                subtotal: subtotal
            });
        }

    });


    if (productosSeleccionados.length === 0) {

        mensaje.textContent =
            "Debe agregar al menos un producto";

        return;
    }


    const pedido = {

        orderId:
            "ORD-" + Date.now(),

        usuarioId:
            usuarioActual.usuarioId,

        usuario:
            usuarioActual.nombre,

        productos:
            productosSeleccionados,

        total:
            total
    };


    // Simula DynamoDB Pedidos
    pedidos.push(pedido);


    mensaje.innerHTML = `
        <div class="pedido-exitoso">

            Pedido realizado correctamente.

            <br>

            Código:
            <strong>${pedido.orderId}</strong>

            <br>

            Total:
            <strong>
                ${formatearPrecio(pedido.total)}
            </strong>

        </div>
    `;


    limpiarSeleccion();

    mostrarPedidos();
}


// ==========================================
// MOSTRAR PEDIDOS
// ==========================================

function mostrarPedidos() {

    const tabla =
        document.getElementById("tablaPedidos");

    const mensaje =
        document.getElementById("sinPedidos");


    tabla.innerHTML = "";


    const pedidosUsuario =
        pedidos.filter(
            pedido =>
                pedido.usuarioId ===
                usuarioActual.usuarioId
        );


    if (pedidosUsuario.length === 0) {

        mensaje.style.display = "block";

        return;
    }


    mensaje.style.display = "none";


    pedidosUsuario.forEach(pedido => {

        const productosTexto =
            pedido.productos
                .map(
                    producto =>
                        `${producto.producto} x${producto.cantidad}`
                )
                .join(", ");


        tabla.innerHTML += `
            <tr>

                <td>
                    ${pedido.orderId}
                </td>

                <td>
                    ${productosTexto}
                </td>

                <td>
                    ${formatearPrecio(pedido.total)}
                </td>

            </tr>
        `;

    });
}


// ==========================================
// LIMPIAR PRODUCTOS
// ==========================================

function limpiarSeleccion() {

    productos.forEach((producto, index) => {

        document.getElementById(
            `cantidad-${index}`
        ).textContent = 0;

    });

    calcularTotal();
}


// ==========================================
// CERRAR SESIÓN
// ==========================================

function cerrarSesion() {

    usuarioActual = null;

    document.getElementById("tienda")
        .style.display = "none";

    document.getElementById("login")
        .style.display = "block";

    document.getElementById("usuario")
        .value = "";

    document.getElementById("password")
        .value = "";

    document.getElementById("mensajeLogin")
        .textContent = "";

    document.getElementById("mensajePedido")
        .textContent = "";

    limpiarSeleccion();
}


// ==========================================
// FORMATO PRECIO CLP
// ==========================================

function formatearPrecio(valor) {

    return new Intl.NumberFormat(
        "es-CL",
        {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0
        }
    ).format(valor);
}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

cargarProductos();