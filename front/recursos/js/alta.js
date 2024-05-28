//Se obtiene el ID del formulario
const formulario = document.getElementById("formulario_productos")
formulario.addEventListener('submit', async (evento)=>{
    //Se evita la redireccion de la pagina
    evento.preventDefault()
    //Se obtienen los datos del formulario
    const datos = new FormData(formulario)
    const datosFormulario = Object.fromEntries(datos)
    //Se le envia los datos y el metodo al servidor
    await fetch(('http://localhost:3000/productos'), {
        headers:{
            'Content-Type':'application/json'
        },
        method: "POST",
        body:   JSON.stringify(datosFormulario)
    })
    //redirecciona
    window.location.href = 'index.html'
})