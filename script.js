async function cargarDatos() {
    try {
        const [clasesResponse, valoresResponse] = await Promise.all([
            fetch("clases.json"),
            fetch("valores.json")
        ]);

        if (!clasesResponse.ok || !valoresResponse.ok) {
            throw new Error("Error al cargar los archivos JSON");
        }

        const [clasesData, valoresData] = await Promise.all([
            clasesResponse.json(),
            valoresResponse.json()
        ]);

        console.log("Clases cargadas:", clasesData);
        console.log("Valores asegurados cargados:", valoresData);

        const selectClase = document.getElementById("Selectclase");
        const selectValor = document.getElementById("valor");

        if (!selectClase || !selectValor) {
            throw new Error("No se encontraron los elementos select en el DOM");
        }

        // Cargar clases en el selector
        selectClase.innerHTML = '<option value="">Seleccione una opción</option>';
        clasesData.forEach(item => {
            let option = document.createElement("option");
            option.value = item.clase;
            option.textContent = item.clase;
            selectClase.appendChild(option);
        });

        // Cargar valores asegurados en el selector
        selectValor.innerHTML = '<option value="">Seleccione un valor</option>';
        valoresData.valoresAsegurados.forEach(valor => {
            let option = document.createElement("option");
            option.value = valor;
            option.textContent = valor;
            selectValor.appendChild(option);
        });

        console.log("Opciones de clase agregadas:", selectClase.innerHTML);
        console.log("Opciones de valores agregados:", selectValor.innerHTML);

        // Escuchar cambios en los selectores
        selectClase.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
        selectValor.addEventListener("change", () => actualizarCotizacion(clasesData, valoresData));
    } catch (error) {
        console.error("Error cargando los datos:", error);
    }
}

function actualizarCotizacion(clasesData, valoresData) {
    const selectClase = document.getElementById("Selectclase");
    const selectValor = document.getElementById("valor");
    const coberturaElement = document.getElementById("cobertura");
    const primaElement = document.getElementById("prima");
    const ivaElement = document.getElementById("iva");
    const totalElement = document.getElementById("total");

    if (!selectClase || !selectValor || !coberturaElement || !primaElement || !ivaElement || !totalElement) {
        console.error("Faltan elementos en el DOM para actualizar la cotización");
        return;
    }

    const claseSeleccionada = selectClase.value;
    const valorSeleccionado = Number(selectValor.value);

    // Buscar la cobertura correspondiente a la clase seleccionada
    const coberturaTexto = clasesData.find(c => c.clase === claseSeleccionada)?.cobertura || "Sin cobertura";
    coberturaElement.innerText = coberturaTexto;

    // Encontrar el índice de la clase y del valor asegurado
    let claseIndex = valoresData.clases.indexOf(claseSeleccionada);
    let valorIndex = valoresData.valoresAsegurados.indexOf(valorSeleccionado);

    if (claseIndex >= 0 && valorIndex >= 0) {
        let primaSinIVA = valoresData.primas[valorIndex][claseIndex];
        let iva = primaSinIVA * 0.19;
        let total = primaSinIVA + iva;

        primaElement.innerText = primaSinIVA.toLocaleString("es-CO");
        ivaElement.innerText = iva.toLocaleString("es-CO");
        totalElement.innerText = total.toLocaleString("es-CO");

        console.log(`Clase seleccionada: ${claseSeleccionada}, Valor seleccionado: ${valorSeleccionado}`);
        console.log(`Prima sin IVA: ${primaSinIVA}, IVA: ${iva}, Total: ${total}`);
    } else {
        primaElement.innerText = "-";
        ivaElement.innerText = "-";
        totalElement.innerText = "-";
    }
}

// Cargar los datos al inicio
cargarDatos();
