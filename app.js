// ================= CONFIG =================

const ADMIN_PASSWORD = "TemazcalCiudadRetoño"; // ← CAMBIAR AQUÍ

const SERVICIOS = [
{ id:1, nombre:"Puerta 1", costo:200, cupo:10 },
{ id:2, nombre:"Puerta 2", costo:350, cupo:10 },
{ id:3, nombre:"Puerta 3", costo:500, cupo:10 }
];

// ================= BASE LOCAL =================

if(!localStorage.getItem("serviciosData")){
localStorage.setItem("serviciosData",JSON.stringify(SERVICIOS));
}

if(!localStorage.getItem("compras")){
localStorage.setItem("compras",JSON.stringify([]));
}

// ================= MOSTRAR SERVICIOS =================

if(document.getElementById("servicios")){
mostrarServicios();
}

function mostrarServicios(){
let cont=document.getElementById("servicios");
let servicios=JSON.parse(localStorage.getItem("serviciosData"));

servicios.forEach(serv=>{
let div=document.createElement("div");
div.classList.add("tarjeta");

if(serv.cupo<=0){
div.classList.add("lleno");
}

div.innerHTML=`
<h3>${serv.nombre}</h3>
<p>$${serv.costo}</p>
<p>Cupo disponible: ${serv.cupo}</p>
`;

div.onclick=function(){
let usuario=localStorage.getItem("sesion");

if(!usuario){
alert("Debes iniciar sesión");
return;
}

if(serv.cupo<=0){
alert("Servicio lleno");
return;
}

localStorage.setItem("servicioSeleccionado",serv.id);
window.location="subir.html";
};

cont.appendChild(div);
});
}

// ================= REGISTRO =================

function mostrarRegistro(){
document.getElementById("registro").classList.toggle("oculto");
}

function mostrarLogin(){
document.getElementById("login").classList.toggle("oculto");
}

function registrar(){
let nombre=document.getElementById("regNombre").value;
let correo=document.getElementById("regCorreo").value;
let telefono=document.getElementById("regTelefono").value;
let pass=document.getElementById("regPass").value;

let usuarios=JSON.parse(localStorage.getItem("usuarios"))||[];

usuarios.push({nombre,correo,telefono,pass});
localStorage.setItem("usuarios",JSON.stringify(usuarios));

alert("Registrado");
}

// ================= LOGIN =================

function ingresar(){
let correo=document.getElementById("loginCorreo").value;
let pass=document.getElementById("loginPass").value;

let usuarios=JSON.parse(localStorage.getItem("usuarios"))||[];

let encontrado=usuarios.find(u=>u.correo===correo && u.pass===pass);

if(encontrado){
localStorage.setItem("sesion",correo);
window.location.reload();
}else{
alert("Datos incorrectos");
}
}

// ================= ADMIN =================

function mostrarAdmin(){
let pass=prompt("Ingrese contraseña admin");

if(pass===ADMIN_PASSWORD){
window.location="admin.html";
}else{
alert("Incorrecto");
}
}

if(document.getElementById("resumenServicios")){
cargarAdmin();
}

function cargarAdmin(){

let servicios=JSON.parse(localStorage.getItem("serviciosData"));
let compras=JSON.parse(localStorage.getItem("compras"));

let resumen=document.getElementById("resumenServicios");

servicios.forEach(serv=>{
let usados=compras.filter(c=>c.servicioId===serv.id && c.estado==="confirmado").length;

resumen.innerHTML+=`
<p>${serv.nombre} - ${usados}/10 inscritos ${usados>=10?"(LLENO)":""}</p>
`;
});

let lista=document.getElementById("listaCompras");

compras.forEach((compra,index)=>{
if(compra.estado==="pendiente"){
lista.innerHTML+=`
<div>
<p>${compra.correo} - ${compra.servicioNombre}</p>
<img src="${compra.imagen}" width="100">
<button onclick="confirmar(${index})">Confirmar</button>
<button onclick="rechazar(${index})">Rechazar</button>
</div>
`;
}
});
}

function confirmar(i){
let compras=JSON.parse(localStorage.getItem("compras"));
compras[i].estado="confirmado";

let servicios=JSON.parse(localStorage.getItem("serviciosData"));
let serv=servicios.find(s=>s.id===compras[i].servicioId);
serv.cupo--;

localStorage.setItem("compras",JSON.stringify(compras));
localStorage.setItem("serviciosData",JSON.stringify(servicios));

alert("Compra confirmada");
location.reload();
}

function rechazar(i){
let compras=JSON.parse(localStorage.getItem("compras"));
compras[i].estado="rechazado";
localStorage.setItem("compras",JSON.stringify(compras));

alert("Compra rechazada");
location.reload();
}

// ================= SUBIR IMAGEN =================

function subirComprobante(){

let file=document.getElementById("imagen").files[0];

if(!file){
alert("Selecciona imagen");
return;
}

let reader=new FileReader();

reader.onload=function(){
let imagenBase64=reader.result;

let compras=JSON.parse(localStorage.getItem("compras"));
let servicios=JSON.parse(localStorage.getItem("serviciosData"));

let servicioId=parseInt(localStorage.getItem("servicioSeleccionado"));
let serv=servicios.find(s=>s.id===servicioId);

compras.push({
correo:localStorage.getItem("sesion"),
servicioId:servicioId,
servicioNombre:serv.nombre,
imagen:imagenBase64,
estado:"pendiente"
});

localStorage.setItem("compras",JSON.stringify(compras));

alert("Enviado para revisión");
window.location="index.html";
};

reader.readAsDataURL(file);
}
