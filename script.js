const apiUrl = "https://script.google.com/macros/s/AKfycbw4pEkj-9nsQX7iRdWwr3WvSknaE8qru3HTpw7WHs5FPfo2ioOuKQcvKle_XYFfGnm6yg/exec";  // Reemplázala con tu URL de Google Apps Script

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const claseSelect = document.getElementById("clase");
        const valorSelect = document.getElementById("valor");
        const primaSpan = document.getElementById("prima");

        // Llenar el dropdown de Clases
        data.clases.forEach(item => {
            let option = document.createElement("option");
            option.value = item.clase;
            option.textContent = item.clase;
            claseSelect.appendChild(option);
        });

        // Llenar el dropdown de Valores Asegurados
        data.valoresAsegurados.forEach(valor => {
            let option = document.createElement("option");
            option.value = valor;
            option.textContent = valor;
            valorSelect.appendChild(option);
        });

        // Evento para actualizar la Prima sin IVA
        function actualizarPrima() {
            let claseIndex = claseSelect.selectedIndex;
            let valorIndex = valorSelect.selectedIndex;
            if (claseIndex > -1 && valorIndex > -1) {
                primaSpan.textContent = data.primas[valorIndex][claseIndex];
            }
        }

        claseSelect.addEventListener("change", actualizarPrima);
        valorSelect.addEventListener("change", actualizarPrima);
    } catch (error) {
        console.error("Error obteniendo los datos:", error);
    }
});
