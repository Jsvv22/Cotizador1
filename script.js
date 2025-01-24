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
    let valorNumerico = Number(item.Valor); // Convertimos directamente porque ya está limpio
    let valorFormateado = valorNumerico.toLocaleString("es-CO", { style: "currency", currency: "COP",
    minimumFracionDigits: 0,
    maximumFracionDigits: 0});
    let option = new Option(valorFormateado, valorNumerico); // Mostramos formato moneda, pero guardamos el número real
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

    const claseSeleccionada = selectClase.value;
    const valorSeleccionado = selectValor.value;

    const claseEncontrada = clasesData.find(c => c.clase === claseSeleccionada);

    if (claseEncontrada) {
        coberturaTd.innerText = claseEncontrada.cobertura;
    } else {
        coberturaTd.innerText = "Sin cobertura";
    }

    // Buscar el índice de la clase y del valor seleccionado en valoresData
    const valorEncontrado = valoresData.find(item => item.Valor == valorSeleccionado);

    if (valorEncontrado && valorEncontrado[claseSeleccionada]) {
        let primaSinIVA = Number(valorEncontrado[claseSeleccionada]);
        let iva = primaSinIVA * 0.19;
        let total = primaSinIVA + iva;

        document.getElementById("prima").innerText = primaSinIVA.toLocaleString("es-CO", { style: "currency", currency: "COP" });
        document.getElementById("iva").innerText = iva.toLocaleString("es-CO", { style: "currency", currency: "COP" });
        document.getElementById("total").innerText = total.toLocaleString("es-CO", { style: "currency", currency: "COP" });
    } else {
        document.getElementById("prima").innerText = "N/A";
        document.getElementById("iva").innerText = "N/A";
        document.getElementById("total").innerText = "N/A";
    }
}
cargarDatos();
