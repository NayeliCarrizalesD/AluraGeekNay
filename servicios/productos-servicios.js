import { PRODUCTOS_INICIALES } from "./productos-data.js";

// URL de tu MockAPI activa en la nube (puedes reemplazarla con tu URL propia de MockAPI)
const API_URL = "https://6ae3c202933120ae20f9257e.mockapi.io/api/v1/productos";

// Helper para almacenamiento local persistente (Fallback automático)
const obtenerDeLocalStorage = () => {
    try {
        const guardados = localStorage.getItem("alurageek_productos");
        if (guardados) {
            const parsed = JSON.parse(guardados);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn("No se pudo leer localStorage:", e);
    }
    // Si no hay datos guardados aún, inicializamos con los 18 productos por defecto
    guardarEnLocalStorage(PRODUCTOS_INICIALES);
    return PRODUCTOS_INICIALES;
};

const guardarEnLocalStorage = (productos) => {
    try {
        localStorage.setItem("alurageek_productos", JSON.stringify(productos));
    } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
    }
};

// GET - Obtener todos los productos (con fallback resiliente)
const listaProductos = async () => {
    try {
        // Intentar conectar con la API en la nube con un timeout de 2.5s
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const respuesta = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            if (Array.isArray(datos) && datos.length > 0) {
                guardarEnLocalStorage(datos);
                return datos;
            }
        }
    } catch (error) {
        console.log("MockAPI no disponible o sin datos, usando catálogo integrado:", error);
    }

    // Fallback garantizado: si la API en la nube falla o está vacía, devuelve el catálogo completo
    return obtenerDeLocalStorage();
}

// GET - Obtener productos por categoría (filtro seguro)
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
        if (respuesta.ok) {
            return await respuesta.json();
        }
    } catch (error) {
        console.log(`Error al obtener producto ${id} de API:`, error);
    }

    // Fallback local por ID
    const todos = obtenerDeLocalStorage();
    return todos.find(p => String(p.id) === String(id)) || null;
}

// POST - Crear un nuevo producto
const crearProducto = async (name, imageUrl, price, categoria, description) => {
    const nuevo = {
        name,
        imageUrl,
        price,
        categoria,
        description,
        id: String(Date.now())
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevo)
        });
        if (respuesta.ok) {
            const data = await respuesta.json();
            const actuales = obtenerDeLocalStorage();
            actuales.push(data);
            guardarEnLocalStorage(actuales);
            return data;
        }
    } catch (error) {
        console.warn("No se pudo conectar a MockAPI al crear producto, guardando localmente:", error);
    }

    const actuales = obtenerDeLocalStorage();
    actuales.push(nuevo);
    guardarEnLocalStorage(actuales);
    return nuevo;
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
        if (respuesta.ok) {
            const data = await respuesta.json();
            const actuales = obtenerDeLocalStorage();
            const index = actuales.findIndex(p => String(p.id) === String(id));
            if (index !== -1) {
                actuales[index] = data;
                guardarEnLocalStorage(actuales);
            }
            return data;
        }
    } catch (error) {
        console.log("Error al actualizar producto en API, actualizando localmente:", error);
    }

    const actuales = obtenerDeLocalStorage();
    const index = actuales.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
        actuales[index] = { ...actuales[index], name, imageUrl, price, categoria, description };
        guardarEnLocalStorage(actuales);
        return actuales[index];
    }
}

// DELETE - Eliminar producto
const eliminarProducto = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (respuesta.ok) {
            const actuales = obtenerDeLocalStorage().filter(p => String(p.id) !== String(id));
            guardarEnLocalStorage(actuales);
            return;
        }
    } catch (error) {
        console.warn("No se pudo eliminar de API, eliminando localmente:", error);
    }

    const actuales = obtenerDeLocalStorage().filter(p => String(p.id) !== String(id));
    guardarEnLocalStorage(actuales);
}

export const productosServicios = {
    listaProductos,
    obtenerProductosPorCategoria,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
