async function cargarDatos() {
    const clasesResponse = await fetch("clases.json");
    const valoresResponse = await fetch("valores.json");

    const clasesData = await clasesResponse.json();
    const valoresData = await valoresResponse.json();

    const selectClase = document.getElementById("clase");
    const selectValor = document.getElementById("valor");

    // Cargar clases en el selector
    clasesData.forEach(item => {
        let option = new Option(item.clase, item.clase);
        selectClase.add(option);
    });

    // Cargar valores asegurados
    valoresData.valoresAsegurados.forEach(valor => {
        let option = new Option(valor, valor);
        selectValor.add(option);
    });

    // Escuchar cambios
    selectClase.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
    selectValor.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
}

function actualizarCotizacion(clasesData, valoresData) {
    const claseSeleccionada = document.getElementById("clase").value;
    const valorSeleccionado = document.getElementById("valor").value;

    // Buscar la cobertura correspondiente a la clase seleccionada
    const coberturaTexto = clasesData.find(c => c.clase === claseSeleccionada)?.cobertura || "Sin cobertura";
    document.getElementById("cobertura").innerText = coberturaTexto;

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
    }
}

// Cargar los datos al inicio
cargarDatos();
