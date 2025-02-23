
document.addEventListener("DOMContentLoaded", function () {
    cargarDatos();
});

function actualizarReloj() {
    const ahora = new Date();
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
    const fechaHora = ahora.toLocaleString('es-ES', opciones).replace(',', '');
    document.getElementById("reloj").textContent = fechaHora;
}

actualizarReloj(); // Llamado inmediato

// Calcula el tiempo hasta el próximo minuto para sincronizar la actualización
const segundosRestantes = 60 - new Date().getSeconds();
setTimeout(() => {
    actualizarReloj();
    setInterval(actualizarReloj, 60000); // Actualiza cada minuto
}, segundosRestantes * 1000);

function limpiarResultados() {
    document.getElementById("prima").innerText = "";
    document.getElementById("iva").innerText = "";
    document.getElementById("total").innerText = "";
}

async function cargarDatos() {
    try {
        const [clasesResponse, valoresResponse] = await Promise.all([
            fetch("clases.json"),
            fetch("valores.json")
        ]);

        const clasesData = await clasesResponse.json();
        const valoresData = await valoresResponse.json();

        console.log("Clases cargadas:", clasesData);
        console.log("Valores asegurados cargados:", valoresData);

        const selectClase = document.getElementById("Selectclase");
        const selectValor = document.getElementById("valor");
        const coberturaTd = document.getElementById("cobertura");

        if (!selectClase || !selectValor || !coberturaTd) {
            console.error("Faltan elementos en el DOM");
            return;
        }

        // Cargar clases en el selector
        clasesData.forEach(item => {
            let option = new Option(item.clase, item.clase);
            selectClase.add(option);
        });

        // Cargar valores asegurados en el selector
        valoresData.forEach(item => {
            let valorNumerico = Number(item.Valor); 
            let valorFormateado = valorNumerico.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            let option = new Option(valorFormateado, valorNumerico); 
            selectValor.add(option);
        });

        // Evento para mostrar cobertura cuando cambie la selección de clase
        selectClase.addEventListener("change", () => coberturas(clasesData));
        selectClase.addEventListener("change", limpiarResultados);
        selectValor.addEventListener("change", limpiarResultados);

    } catch (error) {
        console.error("Error cargando los datos:", error);
    }

}

function coberturas(clasesData) {
    const selectClase = document.getElementById("Selectclase");
    const coberturaTd = document.getElementById("cobertura");
    const claseSeleccionada = selectClase.value;

    const claseEncontrada = clasesData.find(c => c.clase === claseSeleccionada);

    if (claseEncontrada) {
        coberturaTd.innerText = claseEncontrada.cobertura;
    } else {
        coberturaTd.innerText = "Sin coberturas";
    }
}

function actualizarCotizacion() {
    const selectClase = document.getElementById("Selectclase");
    const selectValor = document.getElementById("valor");

    const claseSeleccionada = selectClase.value;
    const valorSeleccionado = selectValor.value;

    if (!claseSeleccionada || !valorSeleccionado) {
        mostrarErrorModal();
        return;
    }

    fetch("valores.json")
        .then(response => response.json())
        .then(valoresData => {
            const valorEncontrado = valoresData.find(item => item.Valor == valorSeleccionado);

            if (valorEncontrado && valorEncontrado[claseSeleccionada]) {
                let primaSinIVA = Number(valorEncontrado[claseSeleccionada]);
                let iva = primaSinIVA * 0.19;
                let total = primaSinIVA + iva;

                document.getElementById("prima").innerText = primaSinIVA.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                document.getElementById("iva").innerText = iva.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                document.getElementById("total").innerText = total.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
            } else {
                document.getElementById("prima").innerText = "N/A";
                document.getElementById("iva").innerText = "N/A";
                document.getElementById("total").innerText = "N/A";
            }
        })
        .catch(error => console.error("Error cargando los valores:", error));
}

function mostrarErrorModal() {
    var modal = document.getElementById("errorModal");
    modal.style.display = "block";
}

function cerrarModal() {
    var modal = document.getElementById("errorModal");
    modal.style.display = "none";
}

function imprimirPDF() {
    // Ajustar el contenido si es necesario
    // Por ejemplo, añadir clases específicas para impresión
    document.body.classList.add('preparar-impresion');

    // Esperar un breve momento para que los estilos se apliquen
    setTimeout(() => {
        window.print();
        // Remover la clase después de imprimir
        document.body.classList.remove('preparar-impresion');
    }, 1000);
}



function mostrarErrorModal2() {
    var modal = document.getElementById("errorModal2");
    modal.style.display = "block";
}

function cerrarModal2() {
    var modal = document.getElementById("errorModal2");
    modal.style.display = "none";
}

function abrirWhatsApp() {
    var numero = "+573505423354"; // Reemplaza con el número de teléfono
    var mensaje = encodeURIComponent("Hola, estoy interesado en adquirir una poliza de RC para profecionales de la salud");
    var url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
}
