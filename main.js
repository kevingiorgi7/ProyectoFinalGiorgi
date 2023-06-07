// Array de productos comercializados
const accesoriosComercializados = [];

// Con una funcion se utiliza FETCH para traer los productos desde el archivo local JSON
// Se agregan al array de productos comercializados
// Luego se actualiza el stock de acuerdo al inventario realizado y se
// modifica la disponibilidad (true o false) de acuerdo al stock
// Se ejecuta por defecto el filtro "todos" cuando se recarga la pagina
// Se recarga el html del carrito al recargar la pagina
const obtenerAccesorios = async () => {
    const resp = await fetch("./accesorios.json")
    const data = await resp.json()
    data.forEach((accesorio) => {
        accesoriosComercializados.push(accesorio)
    })
    actualizarStockInventario();
    verificarDisponibilidad(accesoriosComercializados);
    botonTodos.click();
    actualizarHTMLCarrito()
    console.log(accesoriosComercializados)
    };
obtenerAccesorios();

const actualizarStockInventario = async() => {
    for (const accesorio of accesoriosComercializados) {
        const codigoAccesorio = accesorio.codigoAccesorio;
        const cantidadInventariada = inventarioPorCodigo[codigoAccesorio];
        inventarioStock(cantidadInventariada, accesorio);
    }
}

function inventarioStock(stockActual, objeto) {
    objeto.stockAccesorio = stockActual;
};

function ventaAccesorio(cantidadVendida, objeto) {
    objeto.stockAccesorio = objeto.stockAccesorio - cantidadVendida
};

const inventarioPorCodigo = {
    "A1": 4,
    "A2": 7,
    "A3": 5,
    "A4": 8,
    "A5": 9,
    "A6": 8,
    "A7": 6,
    "A8": 0,
    "A9": 3,
    "A10": 2,
    "A11": 7,
    "A12": 8,
    "A13": 6,
    "A14": 2,
    "A15": 3,
    "A16": 2,
    "A17": 7,
};

// Creacion de una FUNCION DE ORDEN SUPERIOR con un CICLO 
// para recorrer el Array de Objetos "Accesorios Comercializados"
// y modificar el parametro "Disponibilidad" de cada Objeto/Accesorio en base a su stock 
const verificarDisponibilidad = (accesorios) => {
    for (let i = 0; i < accesorios.length; i++) {
        if (accesorios[i].stockAccesorio > 0) {
            accesorios[i].disponibilidadAccesorio = true;
        } else {
            accesorios[i].disponibilidadAccesorio = false;
        }
    }
}



// CREACION DE CARDS EN HTML Y CSS para mostrar los productos //

const contenedorAccesorios = document.querySelector("#catalogo")
const botonesFiltro = document.querySelectorAll(".filtro");

let vehiculoFiltrado = "";

// Cremos una funcion para modificar el HTML del DIV contenedor de accesorios
// De acuerdo al valor de VehiculoFiltrado se crea HTML
function filtrarHTML() {
    // Primero se vacia el contenedor
    contenedorAccesorios.innerHTML = '';
    // Luego se recorre el array vehiculo fitrado, realizando algunas acciones
    for (let i = 0; i < vehiculoFiltrado.length; i++) {
    const divAccesorio = document.createElement("div");
    divAccesorio.innerHTML = `
    <div class="card-header"><strong>${vehiculoFiltrado[i].nombreDelAccesorio}</strong>
    </div>
    <div class="card-body">
        <img src="${vehiculoFiltrado[i].imagenAccesorio}" 
        alt='${vehiculoFiltrado[i].nombreDelAccesorio}' style="width:100%">
        <p class="card-text">${vehiculoFiltrado[i].descripcionAccesorio}</p>
        <h6><strong>Vehiculos Compatibles: </strong>
        ${vehiculoFiltrado[i].vehiculosCompatibles}</h6>
        <h6><strong>Precio: </strong>$ 
        ${Intl.NumberFormat('de-DE').format(vehiculoFiltrado[i].precioAccesorioEnPesos)}</h6>
    </div>
    <div class="card-footer">
        <button type="button" class="btn btn-dark botonCarrito m-0" 
        id="${vehiculoFiltrado[i].codigoAccesorio}">Agregar al carrito</button>
    </div>
    `;
    divAccesorio.classList.add("card", "border-dark", "mb-3", "width-card");
    contenedorAccesorios.appendChild(divAccesorio);
    }
    botonSinStock()
};

// Funcion para cambiar texto de boton "agregar carrito" en caso que no haya stock
function botonSinStock() {
    const botonCarrito = document.querySelectorAll(".botonCarrito")
    for (let i = 0; i < vehiculoFiltrado.length; i++) {
        if (vehiculoFiltrado[i].disponibilidadAccesorio === false) {
        botonCarrito[i].innerText = "Sin Stock";
        botonCarrito[i].classList.add("botonSinStock");
        }
    }
}

// Iterar todos los botones de filtro con un forEach, 
// luego ejecutamos un evento en cada boton
// Quitamos y agregamos CSS al boton que se le ejecuta el evento
// Filtramos los accesorios comercializados de acuerdo al boton 
// donde se ejecutó el evento creando un nuevo array con los
// Accesorios compatibles al vehiculo filtrado
botonesFiltro.forEach((filtro) => {
    filtro.addEventListener("click", (e) => {
        botonesFiltro.forEach((boton) => 
        boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
        // Operador ternario //
        e.currentTarget.id === "todos" ? 
        vehiculoFiltrado = accesoriosComercializados : 
        vehiculoFiltrado = accesoriosComercializados.filter((accesorio) =>
        accesorio.vehiculosCompatibles.includes(e.currentTarget.id));
        filtrarHTML();
    });
});


const botonBuscar = document.querySelector(".botonBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonTodos = document.getElementById("todos");

// Similar los botones de filtro, se filtra de acuerdo al valor
// buscado, el cual se modifica siempre a un string con la primer 
// letra mayuscula y el resto minusculas para que sea indiferente 
// la escritura en mayusculas o minusculas. 
botonBuscar.addEventListener("click", (e) => {
    let accesorioBuscado = inputBuscar.value;
    let accesorioBuscadoOK = 
    accesorioBuscado.charAt(0).toUpperCase() + accesorioBuscado.slice(1).toLowerCase();
    vehiculoFiltrado = accesoriosComercializados.filter((accesorio) =>
    accesorio.nombreDelAccesorio.includes(accesorioBuscadoOK));
    filtrarHTML();
    e.preventDefault()
});



// AGREGAR PRODUCTOS AL CARRITO //
let botonEliminar = document.querySelectorAll(".botonEliminar")
const botonVaciarCarrito = document.querySelector("#vaciar-Carrito")

let carritoActualLS = localStorage.getItem("accesorios-agregados-carrito");
let carritoActual = JSON.parse(carritoActualLS) || []

const contenedorCarrito = document.querySelector("#carrito")


// Se crea el evento clic y se identifica el codigo del accesorio al que 
// se le hizo clic y se actualiza el array Carrito Actual a traves de la funcion 
contenedorAccesorios.addEventListener("click", (e) => {
    if (e.target.classList.contains("botonCarrito")) {
    // Si se cliquea en "agregar carrito" , se crea una variable con el codigo del
    // accesorio cliqueado que sea igual a su ID
        const codigoAccesorioCliqueado = e.target.id;
    // Se crea una variable con el accesorio cliqueado, buscando el mismo a traves
    // del codigo del mismo, dentro de los accesorios comercializados.
        const accesorioCliqueado = accesoriosComercializados.find(
        (accesorio) => accesorio.codigoAccesorio === codigoAccesorioCliqueado
        );
        actualizarCarritoActual(accesorioCliqueado, 1);
    }
});


function actualizarCarritoActual(accesorio, cantidad) {
    // Se crea una variable, buscando el codigo del accesorio del parametro
    // que se le indica a la funcion
    const codigoAccesorioAgregado = accesorio.codigoAccesorio;
    // Se crea una variable para chequear si el accesorio que se está
    // agregan al carrito, ya existe en el mismo.
    let accesorioExistente = carritoActual.find(
        (item) => item.codigo === codigoAccesorioAgregado
    );
    // Se crea actualiza el carrito solo si el mismo esta "disponible"
    if (accesorio.disponibilidadAccesorio) { 
        // Si el accesorio existe en el carrito, no se crea HTML, 
        // solo se edita la cantidad, el subtotal y se actualiza el carrito
        if (accesorioExistente) {
            accesorioExistente.cantidad += cantidad;
            accesorioExistente.subtotal = 
            accesorioExistente.precio * accesorioExistente.cantidad;
        // Sino, se crea un objeto como valor de accesorioExistente,
        // con la informacion del mismo
        } else {
            accesorioExistente = {
                codigo: accesorio.codigoAccesorio,
                nombre: accesorio.nombreDelAccesorio,
                cantidad: cantidad,
                precio: accesorio.precioAccesorioEnPesos,
                subtotal: accesorio.precioAccesorioEnPesos * cantidad,
            };
            // y luego se agrega el mismo al CarritoActual
            carritoActual.push(accesorioExistente);
            }
        // Usamos la libreria Toastify cada vez que se agrega un producto al carrito
        Toastify({
            text: "Accesorio agregado al carrito",
            duration: 3000,
            gravity:'bottom',
            position: 'left',
            style: {
                background: 'linear-gradient(to left, red, black)'
            },
            stopOnFocus: true, 
        }).showToast();
    }
    // Se acualiza el HTML del carrito
    actualizarHTMLCarrito()
    // LOCAL STORAGE
    localStorage.setItem("accesorios-agregados-carrito" , JSON.stringify(carritoActual));
}



// Se crea y actualiza HTML de acuerdo al contenido del Carrito Actual
function actualizarHTMLCarrito() {
    if (carritoActual.length == 0) {
        contenedorCarrito.innerHTML = `
        <h2>Tu Carrito</h2>
        <em>Tu carrito está vacio &#128577;</em>
        `;
    } else {
        contenedorCarrito.innerHTML = `
        <h2>Tu Carrito</h2>
        <em>Tus accesorios selecionados son:</em>
        <br>
        <br>
        <div class="container text-center">
            <div class="row">
            <h4 class="card-title col-sm-4 izq">Nombre accesorio</h4>
            <p class="card-text col-sm-2 der">Cantidad</p>
            <p class="card-tex col-sm-2 der">Precio</p>
            <p class="card-text col-sm-2 der">Subtotal</p>
            <p class="card-text col-sm-2 der"></p>
            <hr>
            </div>
        </div>
        `;
    }
    // Se recorre el array del carritoActual
    carritoActual.forEach((accesorio) => {
        // Se crea un div con HTML donde se va a mostrar el accesorio en el carrito
        const divAccesorioEnCarrito = document.createElement("div");
        divAccesorioEnCarrito.innerHTML = `
        <div class="row accesorios-en-carrito">
        <p class="card-text col-sm-4 izq-acc">${accesorio.nombre}</p>
        <p class="card-text col-sm-2 der-acc">${accesorio.cantidad}</p>
        <p class="card-text col-sm-2 der-acc">
        $ ${Intl.NumberFormat('de-DE').format(accesorio.precio)}</p>
        <p class="card-text col-sm-2 der-acc">
        $ ${Intl.NumberFormat('de-DE').format(accesorio.subtotal)}</p>
        <p class="card-text col-sm-1 der-acc">
            <button type="button" id=${accesorio.codigo} 
            class="botonEliminar m-lg-0 p-lg-1 btn btn-outline-primary">Eliminar</button>
        </p>
        <hr>
        </div>
        `;
        divAccesorioEnCarrito.classList.add("container");
        divAccesorioEnCarrito.classList.add("text-center");
        contenedorCarrito.appendChild(divAccesorioEnCarrito);
    });
    ClicEliminarAccesorio()
    actualizarStockVenta()
    botonSinStock()
    sumarAtotal()
}

// Funcion para actualizar el total
function sumarAtotal() {
    let totalGeneral = 0;
    if (carritoActual.length > 0) {
        for (const item of carritoActual) {
            const subtotal = 
            item.precio * 
            item.cantidad;
            totalGeneral += subtotal;
        }
    }
    const elementoTotal = document.querySelector("#totalGeneral");
    elementoTotal.textContent = Intl.NumberFormat('de-DE').format(totalGeneral);
}


// Eliminar accesorio del carrito
function ClicEliminarAccesorio() {
    botonEliminar = document.querySelectorAll(".botonEliminar")
    // Se recorren todos los botones con un ForEach, agregando un evento
    // a cada uno. Por cada clic, se ejecuta la funcion "eliminarAccesorio"
    botonEliminar.forEach(boton => {
    boton.addEventListener("click", eliminarAccesorio)
    });
};

function eliminarAccesorio(e) {
    let idEliminado = e.currentTarget.id;
    const index = carritoActual.findIndex(producto => producto.codigo === idEliminado)
    carritoActual.splice(index, 1)
    actualizarHTMLCarrito()
    localStorage.setItem("accesorios-agregados-carrito" , JSON.stringify(carritoActual));
    verificarDisponibilidad(accesoriosComercializados);
    botonTodos.click();
}

botonVaciarCarrito.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {
    carritoActual.length = 0;
    const elementoTotal = document.querySelector("#totalGeneral");
    elementoTotal.textContent = 0;
    actualizarHTMLCarrito()
    localStorage.setItem("accesorios-agregados-carrito" , JSON.stringify(carritoActual));
    verificarDisponibilidad(accesoriosComercializados);
    botonTodos.click();
}


// Uso de LIBRERIA "Sweet Alert" en los botones para Comprar y Confirmar Compra
const botonComprarCarrito = document.querySelector("#comprar-carrito")
botonComprarCarrito.addEventListener("click", (event) => {
    setTimeout(()=> {
        Swal.fire(
            '¡Tu compra está muy cerca!',
            '¡Completa este formulario para finalizar!',
            'info'
        )
    }, 500)
});

const inputNombre = document.querySelector("#inputName")
const inputEmail = document.querySelector("#inputEmail")
const formCompra = document.querySelector("#form-compra")

formCompra.addEventListener("submit", (e) => {
    let cliente = inputNombre.value;
    let mail = inputEmail.value;
    if (carritoActual.length === 0) {
        Swal.fire({
            title: 'Su carrito esta vacio',
            text: cliente + ", agrega accesorios al carrito para realizar la compra",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar compra'
            })
    } else {
        Swal.fire({
        title: '¿Desea confirmar la compra?',
        text: cliente + ", Tu compra está a un click de distancia",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar compra'
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Compra exitosa',
                'Te enviaremos el detalle de tu compra al email: ' + mail,
                'success'
            )
        }
        })
    }
    e.preventDefault()
});



// Creamos una funcion para actualizar el stock por venta
// Con un ciclo For recorremos el array Carrito Actual y de acuerdo a las cantidades 
// de cada accesorio, se actualiza el stock de accesorios comercializados
function actualizarStockVenta() {
    actualizarStockInventario();
    for (const accesorio of carritoActual) {
    const codigoVendido = accesorio.codigo;
    const cantidadVendida = accesorio.cantidad;
    const accesorioVendido = accesoriosComercializados.find((accesorio) =>
    accesorio.codigoAccesorio === codigoVendido);
    ventaAccesorio(cantidadVendida, accesorioVendido);
    verificarDisponibilidad(accesoriosComercializados);
    botonSinStock();
    }
}
