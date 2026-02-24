
let servicioActual = "";

function seleccionarServicio(servicio){
    servicioActual = servicio;
    document.getElementById("servicioSeleccionado").innerText = servicio;
    document.getElementById("modal").style.display = "flex";
}

function cerrarModal(){
    document.getElementById("modal").style.display = "none";
}

function enviarWhatsApp(){

    const nombre = document.getElementById("nombre").value;

    if(nombre === ""){
        alert("Por favor ingresa tu nombre");
        return;
    }

    const mensaje = `
Hola, me interesa el siguiente servicio:

${servicioActual}

Nombre: ${nombre}

Adjunto mi comprobante de pago.
`;

    const numero = "5215512345678"; // CAMBIA ESTE NÚMERO POR EL TUYO

    const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank");

    alert("Se abrirá WhatsApp. Adjunta la imagen manualmente antes de enviar.");
}