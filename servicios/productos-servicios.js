// GET - Obtener todos los productos
const listaProductos = () => {
    return fetch("http://localhost:3000/productos")
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log("Error al obtener productos:", error);
            return [];
        });
}

// GET - Obtener productos por categoría
const obtenerProductosPorCategoria = (categoria) => {
    return fetch(`http://localhost:3000/productos?categoria=${categoria}`)
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log(`Error al obtener productos de ${categoria}:`, error);
            return [];
        });
}

// GET - Obtener producto por ID
const obtenerProducto = (id) => {
    return fetch(`http://localhost:3000/productos/${id}`)
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log(`Error al obtener producto ${id}:`, error);
            return null;
        });
}

export const productosServicios = {
    listaProductos,
    obtenerProductosPorCategoria,
    obtenerProducto
}
