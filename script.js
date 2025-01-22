async function cargarDatos() {
    try {
        let responseClases = await fetch("clases.json");
        let clasesData = await responseClases.json();
        console.log("📌 Datos de Clases:", clasesData);

        let responseValores = await fetch("valores.json");
        let valoresData = await responseValores.json();
        console.log("📌 Datos de Valores:", valoresData);
    } catch (error) {
        console.error("❌ Error cargando los datos:", error);
    }
}
cargarDatos();
