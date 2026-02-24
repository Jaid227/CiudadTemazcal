let servicioActual="";

function seleccionar(servicio){
  servicioActual=servicio;
  document.getElementById("servicio").innerText=servicio;
  document.getElementById("modal").style.display="flex";
}

async function enviar(){

  const nombre=document.getElementById("nombre").value;
  const fileInput=document.getElementById("imagen");
  const file=fileInput.files[0];

  if(!nombre || !file){
    alert("Completa todos los campos");
    return;
  }

  const reader=new FileReader();

  reader.onload=async function(){

    const base64=reader.result;

    const response=await fetch("PEGA_AQUI_TU_WEB_APP_URL",{
      method:"POST",
      body:JSON.stringify({
        nombre:nombre,
        servicio:servicioActual,
        imagen:base64,
        tipo:file.type,
        nombreArchivo:file.name
      })
    });

    const data=await response.json();

    const numero="5215512345678"; // CAMBIA TU NUMERO

    const mensaje=`
Nuevo servicio solicitado:

Nombre: ${nombre}
Servicio: ${servicioActual}
Comprobante: ${data.link}
`;

    const url="https://web.whatsapp.com/send?phone="
              +numero+
              "&text="+encodeURIComponent(mensaje);

    window.open(url,"_blank");

  };

  reader.readAsDataURL(file);
}
