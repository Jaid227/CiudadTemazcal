// ================= USUARIO =================

function mostrarRegistro(){
document.getElementById("inicio").classList.add("oculto");
document.getElementById("registro").classList.remove("oculto");
}

function mostrarLogin(){
document.getElementById("inicio").classList.add("oculto");
document.getElementById("login").classList.remove("oculto");
}

function volverInicio(){
document.getElementById("registro").classList.add("oculto");
document.getElementById("login").classList.add("oculto");
document.getElementById("inicio").classList.remove("oculto");
}

// 👁️ Mostrar / Ocultar contraseña
function togglePassword(id, icono){
let input = document.getElementById(id);

if(input.type === "password"){
input.type = "text";
icono.textContent = "🙈";
}else{
input.type = "password";
icono.textContent = "👁️";
}
}

// REGISTRO CON VALIDACIÓN
function registrar(){

let nombre = document.getElementById("regNombre").value.trim();
let correo = document.getElementById("regCorreo").value.trim();
let telefono = document.getElementById("regTelefono").value.trim();
let pass = document.getElementById("regPass").value.trim();

if(!nombre || !correo || !telefono || !pass){
alert("⚠️ Todos los campos son obligatorios");
return;
}

let usuario={
nombre,
correo,
telefono,
pass
}

localStorage.setItem("usuario",JSON.stringify(usuario));
alert("Registrado correctamente ✅");
volverInicio();
}

function ingresar(){
let usuario=JSON.parse(localStorage.getItem("usuario"));
let pass=document.getElementById("loginPass").value.trim();

if(!pass){
alert("Ingresa tu contraseña");
return;
}

if(usuario && pass===usuario.pass){
window.location="servicios.html";
}else{
alert("Contraseña incorrecta ❌");
}
}

function cerrarSesion(){
localStorage.removeItem("carrito");
window.location="index.html";
}

// ================= SERVICIOS =================

const servicios=[
{nombre:"Temazcal puerta 1",costo:200,descripcion:"Sesión básica",img:""},
{nombre:"Temazcal puerta 2",costo:350,descripcion:"Sesión intermedia",img:""},
{nombre:"Temazcal puerta 3",costo:500,descripcion:"Sesión completa",img:""}
];

let carrito=[];

if(document.getElementById("listaServicios")){
mostrarServicios();
}

function mostrarServicios(){
let contenedor=document.getElementById("listaServicios");

servicios.forEach((servicio,index)=>{
let card=document.createElement("div");
card.classList.add("tarjeta");

card.innerHTML=`
<h3>${servicio.nombre}</h3>
<p>Costo: $${servicio.costo}</p>
<p>${servicio.descripcion}</p>
`;

card.onclick=function(){
if(carrito.includes(index)){
carrito=carrito.filter(i=>i!==index);
card.classList.remove("seleccionado");
}else{
carrito.push(index);
card.classList.add("seleccionado");
}
document.getElementById("btnContinuar").classList.toggle("oculto",carrito.length===0);
}

contenedor.appendChild(card);
});
}

function irCompra(){
localStorage.setItem("carrito",JSON.stringify(carrito));
window.location="compra.html";
}

// ================= COMPRA =================

if(document.getElementById("resumenCompra")){
mostrarResumen();
}

function mostrarResumen(){
let usuario=JSON.parse(localStorage.getItem("usuario"));
let carritoGuardado=JSON.parse(localStorage.getItem("carrito"));

if(!carritoGuardado || carritoGuardado.length===0){
window.location="servicios.html";
return;
}

let total=0;
let listaServicios=[];

carritoGuardado.forEach(i=>{
total+=servicios[i].costo;
listaServicios.push(servicios[i].nombre);
});

document.getElementById("datosUsuario").innerHTML=`
<h3>Datos del Usuario</h3>
<p>Nombre: ${usuario.nombre}</p>
<p>Correo: ${usuario.correo}</p>
<p>Teléfono: ${usuario.telefono}</p>
`;

document.getElementById("resumenCompra").innerHTML=`
<h3>Total: $${total}</h3>
<p>Servicios: ${listaServicios.join(", ")}</p>
`;
}

async function finalizarCompra(){

let usuario=JSON.parse(localStorage.getItem("usuario"));
let carritoGuardado=JSON.parse(localStorage.getItem("carrito"));

let total=0;
let listaServicios=[];

carritoGuardado.forEach(i=>{
total+=servicios[i].costo;
listaServicios.push(servicios[i].nombre);
});

let datos={
nombre:usuario.nombre,
correo:usuario.correo,
telefono:usuario.telefono,
servicios:listaServicios.join(", "),
total:total
};

await fetch("https://script.google.com/macros/s/AKfycbyxVQSutpiGDCTjD46vA4aEZbMh22IY8GDtZgpnJWxZLhH8piGS2zm9RhwzpbmZh_pI/exec",{
method:"POST",
body:JSON.stringify(datos)
});

alert("Compra registrada correctamente ✅");

localStorage.removeItem("carrito");
window.location="servicios.html";
}


