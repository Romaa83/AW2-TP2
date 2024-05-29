//Se obtiene el ID del formulario
const parametroUrl = new URLSearchParams(window.location.search);
const idProducto = parseInt(parametroUrl.get('id'));
let nombre = ''
let marca = ''
let categoria = ''
let stock = ''
let idURL = ''


const buscarProductos = async ()=>{
    //se obtiene la ruta y los datos
    const rutaProducto = await fetch ('http://localhost:3000/productos')
    const datosJSON = await rutaProducto.json()
    //se recorre el array y se encuentra el ID
    datosJSON.productos.forEach(producto => {
        if (idProducto === producto.id) {
            idURL = producto.id
            nombre = producto.nombre
            marca = producto.marca
            categoria = producto.categoria
            stock = producto.stock
        }
        //se rellena el formulario con los datos
        document.getElementById('categoria').value = categoria
        document.getElementById('nombre').value = nombre
        document.getElementById('marca').value = marca
        document.getElementById('stock').value = stock
    });
}
buscarProductos()


const formulario = document.getElementById("formulario_productos")
formulario.addEventListener('submit', async (evento)=>{
    evento.preventDefault()
    //Los datos del formulario se guardan en las variables
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const marca = document.getElementById('marca').value;
    const stock = document.getElementById('stock').value;
    //se guardan los datos de la variable creada dentro de las globales
    const formDataJSON = JSON.stringify({
        nombre: nombre,
        categoria: categoria,
        marca: marca,
        stock: stock
    });
    console.log(formDataJSON)
    //se mandan al servidor
    await fetch(`http://localhost:3000/productos/${idURL}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: formDataJSON
    });
    window.location.href = 'index.html'
})

document.getElementById('borrarFormulario').addEventListener('click', async (evento) =>{
    evento.preventDefault()
    const confirmar = confirm('Está por eliminar un producto, ¿Continuar?');
    if(confirmar){
        const datos = await fetch(`http://localhost:3000/productos/${idURL}`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        window.location.href = 'index.html'
    }
})
