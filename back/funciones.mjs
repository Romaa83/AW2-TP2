import {join, parse} from "node:path"
import {readFile, writeFile} from "node:fs/promises"

let productosV1;

//default

//FUNCION LEER EL ARCHIVO
const leerArchivos = async ()=>{
    try {
        //Se obtiene la ruta
        const rutaArchivo = join('api', 'v1', 'productos.json')
        //Se leen los datos dentro del json y se guardan en un const en forma de texto
        const datos = await readFile(rutaArchivo,'utf-8')
        //Se transoforman los datos a JSON
        productosV1 = JSON.parse(datos)
    } catch (error) {
        console.log(error)
    }   
}
leerArchivos()

const gestionar404 = async(respuesta)=>{
    try {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Ingrese una URL valida (/productos,/productos/1,etc)")
    } catch (error) {
        console.log(error)
    }
}

const mostrarProductos = async (respuesta)=>{
    try {
        await leerArchivos()
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.statusCode = 200
        respuesta.setHeader('Content-type','application/json')
        respuesta.end(JSON.stringify(productosV1))
    } catch (error) {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error")
    }
}
const mostrarProducto = async (peticion, respuesta)=>{
    try {
        await leerArchivos()
        const id = parse(peticion.url).base
        const producto = productosV1.productos.find((producto)=>{
            return Number(producto.id) === Number(id);
        })
        if(producto){
            const respuestaJSON = `{
                    "productos":[
                        ${JSON.stringify(producto)}
                    ]
                }`;
            respuesta.setHeader('Content-Type', 'application/json;charset=utf-8');
            respuesta.statusCode = 200;
            respuesta.end(respuestaJSON);
        }
        else{
            respuesta.setHeader('Content-Type', 'text/plain;charset=utf-8');
            respuesta.statusCode = 404;
            respuesta.end('No se encuentra el producto');
        }
    } catch (error) {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error")
    }
}

//PARA EL POST

const agregarProductos = async (peticion, respuesta)=>{
    try {
        await leerArchivos()
    let datosCuerpo = '';
    peticion.on('data', (pedacitos) =>{
        datosCuerpo+=pedacitos
    })
    peticion.on('error', (error)=>{
        // console.error(error);
        respuesta.setHeader('Content-Type', 'text/plain');
        respuesta.statusCode = 500;
        respuesta.end("Error del servidor")
    })
    peticion.on('end', async()=>{
        try {
            const ruta = join('api', 'v1', 'productos.json')
            const nuevoProducto = JSON.parse(datosCuerpo)
            const ultimoProducto = productosV1.productos[productosV1.productos.length - 1];
            const nuevoProductoID = ultimoProducto.id + 1
            const productoConID = {
                id: nuevoProductoID,
                categoria: nuevoProducto.categoria,
                nombre: nuevoProducto.nombre,
                marca: nuevoProducto.marca,
                stock: nuevoProducto.stock = parseInt(nuevoProducto.stock)
            };
        productosV1.productos.push(productoConID)
        await writeFile(ruta, JSON.stringify(productosV1, null, 2))
         respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.end()
        } catch (error) {
            respuesta.statusCode = 404
            respuesta.setHeader('Content-Type','text/plain')
            respuesta.end("Error")
        }
    })} 
    catch (error) {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error")
    }
    
}

const modificarProductos = async (peticion, respuesta)=>{
    try {
        await leerArchivos()
    const id = parse(peticion.url).base
    respuesta.setHeader('Access-Control-Allow-Origin', '*');
        const producto = productosV1.productos.find((producto)=>{
          return Number(id) === Number(producto.id)
       })
    if (producto) {
        let datosDelCuerpo = ''
        peticion.on('data',(pedacitos)=>{
            datosDelCuerpo += pedacitos
        })
        peticion.on('error',(error)=>{
            console.error(error)
            respuesta.statusCode = 500
            respuesta.setHeader('Content-Type','text/plain')
            respuesta.end('Error del servidor')
        })
        peticion.on('end', async ()=>{
            try {
                const rutaJSON = join('api', 'v1', 'productos.json')
                const cambiarProducto = JSON.parse(datosDelCuerpo)
                //console.log(cambiarProducto)
                const productos = productosV1.productos.map((producto)=>{
                    if(parseInt(producto.id) === parseInt(id)){
                        return {
                            id: parseInt(id),
                            nombre: cambiarProducto.nombre,
                            categoria: cambiarProducto.categoria,
                            marca: cambiarProducto.marca,
                            stock: parseInt(cambiarProducto.stock)
                        };
                    }else{
                        return producto;
                    }
                    
                })
                productosV1.productos = productos
                await writeFile(rutaJSON,JSON.stringify(productosV1))
                respuesta.statusCode = 201
                respuesta.end()
            } catch (error) {
                console.log(error)
            }
            
        })
    }
    } catch (error) {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error")
    }
    
}

const borrarProducto = async (peticion, respuesta) =>{
    try {
        await leerArchivos()
        const id = parse(peticion.url).base
        const nuevosProductos = productosV1.productos.filter((producto)=>{
            return Number(producto.id) !== Number(id)
        })
        try {
            const rutaJson = join('api', 'v1', 'productos.json')
            const respuestaJSON = {
                "productos": nuevosProductos
            };
            if (JSON.stringify(productosV1) != JSON.stringify(respuestaJSON)){
                productosV1 = respuestaJSON
                await writeFile(rutaJson, JSON.stringify(respuestaJSON))
                respuesta.setHeader('Access-Control-Allow-Origin', '*');
                respuesta.statusCode=201
                respuesta.end();
            }else{
                respuesta.setHeader('Content-Type', 'text/plain;charset=utf-8');
                respuesta.statusCode = 404;
                respuesta.end('No se encuentra el producto');
            }
        } catch (error) {
            console.error(error)
            respuesta.statusCode=500
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("Error en el servidor");
        }
    } catch (error) {
        respuesta.statusCode = 404
        respuesta.setHeader('Content-Type','text/plain')
        respuesta.end("Error")
    }
}
//GENERAL

const gestionarOPTIONS = async (respuesta) => {
    try {
        respuesta.setHeader('Access-Control-Allow-Origin', '*');
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        respuesta.statusCode = 201
        respuesta.end()
    } catch (error) {
        console.error(error)
        respuesta.statusCode=500
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error en el servidor");
    }
} 
export {leerArchivos, mostrarProductos, mostrarProducto, gestionarOPTIONS, agregarProductos, modificarProductos, borrarProducto, gestionar404}