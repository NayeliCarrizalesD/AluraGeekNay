// URL de tu MockAPI activa en la nube
const API_URL = "https://6ae3c202933120ae20f9257e.mockapi.io/api/v1/productos";

// GET - Obtener todos los productos
const listaProductos = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) return [];
        const datos = await respuesta.json();
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.log("Error al obtener productos:", error);
        return [];
    }
}

// GET - Obtener productos por categoría (con filtro seguro en cliente)
const obtenerProductosPorCategoria = async (categoria) => {
    try {
        const todosLosProductos = await listaProductos();
        if (!Array.isArray(todosLosProductos)) return [];

        const catObjetivo = categoria.replace(/\s+/g, '').toLowerCase();

        return todosLosProductos.filter(producto => {
            if (!producto || !producto.categoria) return false;
            const catProducto = producto.categoria.replace(/\s+/g, '').toLowerCase();
            return catProducto === catObjetivo;
        });
    } catch (error) {
        console.log(`Error al obtener productos de ${categoria}:`, error);
        return [];
    }
}

// GET - Obtener producto por ID
const obtenerProducto = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) return null;
        return await respuesta.json();
    } catch (error) {
        console.log(`Error al obtener producto ${id}:`, error);
        return null;
    }
}

// POST - Crear un nuevo producto
const crearProducto = async (name, imageUrl, price, categoria, description) => {
    const respuesta = await fetch(API_URL, {
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
    });
    if (respuesta.ok) {
        return await respuesta.json();
    }
    throw new Error("No fue posible crear el producto");
}

// PUT - Actualizar producto
const actualizarProducto = async (id, name, imageUrl, price, categoria, description) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
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
        });
        return await respuesta.json();
    } catch (error) {
        console.log("Error al actualizar producto:", error);
    }
}

// DELETE - Eliminar producto
const eliminarProducto = async (id) => {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
    if (!respuesta.ok) {
        throw new Error("No fue posible eliminar el producto");
    }
}

export const productosServicios = {
    listaProductos,
    obtenerProductosPorCategoria,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
