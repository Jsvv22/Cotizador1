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
        valoresData.valoresAsegurados.forEach(valor => {
            let option = new Option(valor, valor);
            selectValor.add(option);
        });

        // Escuchar cambios
        selectClase.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
        selectValor.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));

        // Actualizar cobertura inicial si ya hay algo seleccionado
        actualizarCotizacion(clasesData, valoresData);

    } catch (error) {
        console.error("Error cargando los datos:", error);
    }
}

function actualizarCotizacion(clasesData, valoresData) {
    const claseSeleccionada = document.getElementById("Selectclase").value;
    const valorSeleccionado = document.getElementById("valor").value;
    const coberturaTd = document.getElementById("cobertura");

    // Buscar la cobertura correspondiente a la clase seleccionada
    const claseEncontrada = clasesData.find(c => c.clase === claseSeleccionada);
    if (claseEncontrada) {
        coberturaTd.innerText = claseEncontrada.cobertura; // ✅ Se actualiza la cobertura
    } else {
        coberturaTd.innerText = "Sin cobertura";
    }

    // Encontrar el índice de la clase y del valor asegurado
    let claseIndex = valoresData.clases.indexOf(claseSeleccionada);
    let valorIndex = valoresData.valoresAsegurados.indexOf(Number(valorSeleccionado));

    if (claseIndex >= 0 && valorIndex >= 0) {
        let primaSinIVA = valoresData.primas[valorIndex][claseIndex];
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

