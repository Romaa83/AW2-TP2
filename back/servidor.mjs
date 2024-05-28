import { create } from "node:domain"
import {createServer} from "node:http"
import { leerArchivos, mostrarProductos, mostrarProducto, gestionarOPTIONS, agregarProductos, modificarProductos, borrarProducto, gestionar404 } from "./funciones.mjs"


const puerto = 3000

const server = createServer((peticion, respuesta)=>{
    const peticionServer = peticion.url
    const metodo = peticion.method
    if (metodo === "GET") {

        if (peticionServer === "/productos") {
           mostrarProductos(respuesta)
        }
        else if (peticionServer.match('/productos')) {
            mostrarProducto(peticion,respuesta)
        }
        else{
            gestionar404(respuesta)
        }
    }
    else if (metodo === "POST") {
        if (peticionServer === "/productos") {
            agregarProductos(peticion, respuesta)
        }
        else{
            gestionar404(respuesta)
        }
    }
    else if (metodo === "PUT") {
        if (peticionServer.match("/productos")) {
            modificarProductos(peticion, respuesta)
        }
        else{
            gestionar404(respuesta)
        }
    }
    else if (metodo === "DELETE") {
        if (peticionServer.match("/productos")) {
            borrarProducto(peticion, respuesta)
        }
        else{
            gestionar404(respuesta)
        }
    }
    else if (metodo === "OPTIONS") {
        gestionarOPTIONS(respuesta)
    }
    else{
        respuesta.end("Error")
        console.log("Error en el metodo")
    }
})

server.listen(puerto)