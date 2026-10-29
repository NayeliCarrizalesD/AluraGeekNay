// URL de tu MockAPI activa en la nube
const API_URL = "https://6ae3c202933120ae20f9257e.mockapi.io/api/v1/productos";

// GET - Obtener todos los productos
const listaProductos = () => {
    return fetch(API_URL)
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log("Error al obtener productos:", error);
            return [];
        });
}

// GET - Obtener productos por categoría
const obtenerProductosPorCategoria = (categoria) => {
    return fetch(`${API_URL}?categoria=${categoria}`)
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log(`Error al obtener productos de ${categoria}:`, error);
            return [];
        });
}

// GET - Obtener producto por ID
const obtenerProducto = (id) => {
    return fetch(`${API_URL}/${id}`)
        .then(respuesta => respuesta.json())
        .catch(error => {
            console.log(`Error al obtener producto ${id}:`, error);
            return null;
        });
}

// POST - Crear un nuevo producto
const crearProducto = (name, imageUrl, price, categoria, description) => {
    return fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            imageUrl,
            price,
            categoria,
            description
        })
    })
    .then(respuesta => {
        if (respuesta.ok) {
            return respuesta.json();
        }
        throw new Error("No fue posible crear el producto");
    });
}

// PUT - Actualizar producto
const actualizarProducto = (id, name, imageUrl, price, categoria, description) => {
    return fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            imageUrl,
            price,
            categoria,
            description
        })
    })
    .then(respuesta => respuesta.json())
    .catch(error => console.log("Error al actualizar producto:", error));
}

// DELETE - Eliminar producto
const eliminarProducto = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error("No fue posible eliminar el producto");
        }
    });
}

export const productosServicios = {
    listaProductos,
    obtenerProductosPorCategoria,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
