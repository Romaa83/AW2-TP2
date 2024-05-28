const parametroUrl = new URLSearchParams(window.location.search);
const idProducto = parseInt(parametroUrl.get('id'));
let nombre = ''
let marca = ''
let categoria = ''
let stock = ''
let idURL = ''

const buscarProductos = async ()=>{
    const rutaProducto = await fetch ('http://localhost:3000/productos')
    const datosJSON = await rutaProducto.json()
    datosJSON.productos.forEach(producto => {
        if (idProducto === producto.id) {
            idURL = producto.id
            nombre = producto.nombre
            marca = producto.marca
            categoria = producto.categoria
            stock = producto.stock
        }
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
    const nombre = document.getElementById('nombre').value;
    const categoria = document.getElementById('categoria').value;
    const marca = document.getElementById('marca').value;
    const stock = document.getElementById('stock').value;

    const formDataJSON = JSON.stringify({
        nombre: nombre,
        categoria: categoria,
        marca: marca,
        stock: stock
    });
    console.log(formDataJSON)

    await fetch(`http://localhost:3000/productos/${idURL}`, {
        method: 'PUT', // Puedes ajustar el método según sea necesario
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
// const eliminarProducto = (id_producto) => {
//     const botonEliminar = document.getElementById('borrar-producto');
//     botonEliminar.addEventListener('click', async () => {
//         const confirmar = confirm('Está por eliminar un producto, ¿Continuar?');
//         if (confirmar) {
//             const respuesta = await fetch(
//                 `http://localhost:3000/api/v1/productos/${id_producto}`,
//                 {
//                     method: 'DELETE',
//                 },
//             );
//             if (respuesta.ok) {
//                 // Redireccionamos a inicio
//                 location.href = './';
//             }
//         }
//     });
// };