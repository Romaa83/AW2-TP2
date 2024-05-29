const traerProductos = async()=>{
    try {
        //se obtiene el ID del grid para agregar los productos
        const contenedor = document.getElementById('listado_productos')
        //se obtienen los datos de la url
        const datosProductos = await fetch('http://localhost:3000/productos')
        const datosJSON = await datosProductos.json()
        //Se declara una variable para poner los productos en el HTML
        let HTML = '';
        datosJSON.productos.forEach((producto) => {
            HTML += `
            <div class="grid-item">${producto.id}</div>
            <div class="grid-item">${producto.categoria}</div>
            <div class="grid-item">${producto.nombre}</div>
            <div class="grid-item">${producto.marca}</div>
            <div class="grid-item">${producto.stock}</div>
            <a class="modificacion" id="modificacion" href="modificacion.html?id=${producto.id}">Editar</a>
        `;
        })
        contenedor.innerHTML = HTML;
    } catch (error) {
        console.error(error)
    }
}
traerProductos()