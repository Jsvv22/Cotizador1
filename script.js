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

        // Verificar que los elementos existen
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
            let option = new Option(item.valor, item.valor);
            selectValor.add(option);
        });

        // Escuchar cambios en los selectores
        selectClase.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
        selectValor.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));

        // Actualizar cobertura inicial si ya hay algo seleccionado
        actualizarCotizacion(clasesData, valoresData);

    } catch (error) {
        console.error("Error cargando los datos:", error);
    }
}

function actualizarCotizacion(clasesData, valoresData) {
    const selectClase = document.getElementById("Selectclase");
    const selectValor = document.getElementById("valor");
    const coberturaTd = document.getElementById("cobertura");

    const claseSeleccionada = selectClase.value; // Obtener la clase seleccionada
    const valorSeleccionado = selectValor.value; // Obtener el valor seleccionado

    // Buscar la clase correspondiente en clasesData
    const claseEncontrada = clasesData.find(c => c.clase === claseSeleccionada);

    if (claseEncontrada) {
        // Mostrar la cobertura de la clase seleccionada
        coberturaTd.innerText = claseEncontrada.cobertura;
    } else {
        coberturaTd.innerText = "Sin cobertura";
    }

    // Buscar el índice de la clase y del valor seleccionado en valoresData
    let claseIndex = valoresData.findIndex(item => item.clase === claseSeleccionada);
    let valorIndex = valoresData.findIndex(item => item.valor === valorSeleccionado);

    if (claseIndex >= 0 && valorIndex >= 0) {
        let primaSinIVA = valoresData[valorIndex][claseSeleccionada]; // Acceder a la prima según la clase
        let iva = primaSinIVA * 0.19;
        let total = primaSinIVA + iva;

        document.getElementById("prima").innerText = primaSinIVA.toLocaleString("es-CO");
        document.getElementById("iva").innerText = iva.toLocaleString("es-CO");
        document.getElementById("total").innerText = total.toLocaleString("es-CO");

        console.log(`Clase seleccionada: ${claseSeleccionada}, Valor seleccionado: ${valorSeleccionado}`);
        console.log(`Prima sin IVA: ${primaSinIVA}, IVA: ${iva}, Total: ${total}`);
    }
}

// Cargar los datos al inicio
cargarDatos();

// Cargar los datos al inicio
cargarDatos();

