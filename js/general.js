const traduccionEspanol = {
    days: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ],
    daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
    months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ],
    monthsShort: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ],
    today: "Hoy",
    clear: "Limpiar",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "hh:mm aa",
    firstDay: 1,
};

const diferenciaDeFechasEnDias = function (fecha1, fecha2) {
    const diferencia = Math.abs(fecha2 - fecha1);
    const diferenciaDias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    return diferenciaDias;
};

const iniciarCalendario = function (elemento) {
    new AirDatepicker(elemento, {
        range: true,
        minDate: new Date(),
        locale: traduccionEspanol,
        multipleDatesSeparator: " - ",
        onSelect(valor) {
            if (valor.date.length < 2) {
                return;
            }

            const input = valor.datepicker.$el;
            const item = input.closest(".item-carrito");

            const reservas = obtenerCarrito();
            const reservaActual = reservas.find(function (reserva, i) {
                return reserva.id === parseInt(item.id);
            });
            const estadia = diferenciaDeFechasEnDias(
                valor.date[0],
                valor.date[1]
            );

            establecerCarrito(
                reservas
                    .filter(function (reserva) {
                        return reserva.id !== parseInt(item.id);
                    })
                    .concat([
                        {
                            ...reservaActual,
                            estadia,
                        },
                    ])
            );
        },
    });
};

const mostrarCarrito = function () {
    const carrito = document.getElementById("carrito");

    carrito.classList.toggle("abierto");
};

const obtenerCarrito = function () {
    return JSON.parse(localStorage.getItem("carrito") || "[]");
};

const establecerCarrito = function (datos) {
    console.log(datos);
    localStorage.setItem("carrito", JSON.stringify(datos));

    actualizarCarrito();
};

const eliminarReserva = function (id) {
    const carrito = obtenerCarrito();

    establecerCarrito(
        carrito.filter(function (reserva, i) {
            return reserva.id !== id;
        })
    );
};

const actualizarCarrito = function () {
    const reservas = obtenerCarrito();
    const carrito = document.getElementById("carrito");

    carrito.querySelectorAll(".item-carrito").forEach(function (item) {
        item.remove();
    });

    document
        .querySelector(".carrito-vacio")
        .classList.toggle("d-none", reservas.length > 0);
    document
        .querySelector(".carrito-footer")
        .classList.toggle("d-none", reservas.length === 0);

    reservas.forEach(function (reserva, i) {
        const item = document.getElementById("item-original").cloneNode(true);

        item.classList.remove("d-none");
        item.setAttribute("id", reserva.id);
        item.querySelector(".titulo").innerHTML = reserva.producto;
        item.querySelector(".precio").innerHTML =
            "$" + Number(reserva.precio) + " por noche";
        item.querySelector(".estadia").innerHTML =
            "Noches seleccionadas: " + reserva.estadia;
        item.querySelector(".input-estadia").value = reserva.estadia;
        item.querySelector(".input-precio").value = reserva.precio;

        iniciarCalendario(item.querySelector("input"));

        carrito.insertBefore(item, carrito.querySelector(".carrito-vacio"));
    });

    document.querySelector(".carrito-total").innerHTML =
        "$" +
        reservas.reduce(function (total, reserva, i) {
            return (total += reserva.precio * reserva.estadia);
        }, 0);
};

const numeroRandom = function (max) {
    return Math.floor(Math.random() * max);
};

const botonCabana1 = document.getElementById("reservar-cb-1");

(function () {
    document.body.style.paddingTop =
        document.body.querySelector("header").scrollHeight + "px";

    document
        .getElementById("mostrar-carrito")
        .addEventListener("click", mostrarCarrito);

    if (botonCabana1) {
        botonCabana1.addEventListener("click", function () {
            let min = new Date();
            let max = min.setDate(min.getDate() + 1);

            let carrito = obtenerCarrito();

            carrito.push({
                id: numeroRandom(10),
                producto: "Cabaña 1",
                precio: 100,
                estadia: 1,
            });

            establecerCarrito(carrito);
            setTimeout(() => mostrarCarrito(), 200);
        });
    }

    document.addEventListener("click", function (e) {
        const el = e.target;
        const parent = el.parentElement;

        // Evento de eliminar reserva individual
        if (
            el.matches(".eliminar-reserva") ||
            parent.matches(".eliminar-reserva")
        ) {
            const id = parseInt(el.closest(".item-carrito").id);

            eliminarReserva(id);
        }

        // Evento de limpiar carrito
        if (el.matches(".carrito-limpiar")) {
            establecerCarrito([]);
        }
    });

    actualizarCarrito();
})();

window.addEventListener("load", function () {
    if (window.Typed) {
        var opciones = {
            strings: ["Cabañas los Fresnos"],
            typeSpeed: 100,
            loop: true,
        };

        var typed = new Typed("#escrito", opciones);
    }
});
