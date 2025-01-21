 const apiUrl = "https://script.google.com/macros/s/AKfycbw4pEkj-9nsQX7iRdWwr3WvSknaE8qru3HTpw7WHs5FPfo2ioOuKQcvKle_XYFfGnm6yg/exec";

        async function cargarDatos() {
            let response = await fetch(apiUrl);
            let data = await response.json();

            const selectClase = document.getElementById("clase");
            const selectValor = document.getElementById("valor");

            // Cargar opciones de clases
            data.clases.forEach(item => {
                let option = new Option(item.clase, item.clase);
                selectClase.add(option);
            });

            // Cargar valores asegurados
            data.valoresAsegurados.forEach(valor => {
                let option = new Option(valor, valor);
                selectValor.add(option);
            });

            // Actualizar coberturas y calcular prima
            selectClase.addEventListener("change", () => actualizarCotizacion(data));
            selectValor.addEventListener("change", () => actualizarCotizacion(data));
        }

        function actualizarCotizacion(data) {
            const claseSeleccionada = document.getElementById("clase").value;
            const valorSeleccionado = document.getElementById("valor").value;
            const coberturaTexto = data.clases.find(c => c.clase === claseSeleccionada)?.cobertura || "Sin cobertura";

            document.getElementById("cobertura").innerText = coberturaTexto;

            let claseIndex = data.clasesDisponibles.indexOf(claseSeleccionada);
            let valorIndex = data.valoresAsegurados.indexOf(Number(valorSeleccionado));

            if (claseIndex >= 0 && valorIndex >= 0) {
                let primaSinIVA = data.primas[valorIndex][claseIndex];
                let iva = primaSinIVA * 0.19;
                let total = primaSinIVA + iva;

                document.getElementById("prima").innerText = primaSinIVA.toLocaleString("es-CO");
                document.getElementById("iva").innerText = iva.toLocaleString("es-CO");
                document.getElementById("total").innerText = total.toLocaleString("es-CO");
            }
        }

        cargarDatos();
