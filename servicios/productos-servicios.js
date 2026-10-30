import { PRODUCTOS_INICIALES } from "./productos-data.js";

// URL de tu MockAPI activa en la nube
const API_URL = "https://6ae3c202933120ae20f9257e.mockapi.io/api/v1/productos";

// Normalizar producto para tolerar nombres de campos en español o inglés (ej. categoria vs category)
const normalizarProducto = (p, index) => {
    return {
        id: String(p.id || index + 1),
        name: p.name || p.nombre || p.title || `Producto ${index + 1}`,
        imageUrl: p.imageUrl || p.image || p.img || p.foto || p.avatar || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60",
        price: p.price || p.precio || "$ 25.00",
        categoria: (p.categoria || p.category || p.seccion || "Diversos").trim(),
        description: p.description || p.descripcion || p.detalle || ""
    };
};

// Helper para almacenamiento local persistente (Fallback automático)
const obtenerDeLocalStorage = () => {
    try {
        const guardados = localStorage.getItem("alurageek_productos");
        if (guardados) {
            const parsed = JSON.parse(guardados);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map((p, i) => normalizarProducto(p, i));
            }
        }
    } catch (e) {
        console.warn("No se pudo leer localStorage:", e);
    }
    // Si no hay datos guardados aún, inicializamos con los 18 productos por defecto
    const iniciales = PRODUCTOS_INICIALES.map((p, i) => normalizarProducto(p, i));
    guardarEnLocalStorage(iniciales);
    return iniciales;
};

const guardarEnLocalStorage = (productos) => {
    try {
        localStorage.setItem("alurageek_productos", JSON.stringify(productos));
    } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
    }
};

// GET - Obtener todos los productos (con normalización y fallback resiliente)
const listaProductos = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const respuesta = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            if (Array.isArray(datos) && datos.length > 0) {
                const normalizados = datos.map((p, i) => normalizarProducto(p, i));
                guardarEnLocalStorage(normalizados);
                return normalizados;
            }
        }
    } catch (error) {
        console.log("MockAPI no disponible o sin datos, usando catálogo integrado:", error);
    }

    return obtenerDeLocalStorage();
}

// GET - Obtener productos por categoría (filtro flexible e insensible a espacios o mayúsculas)
const obtenerProductosPorCategoria = async (categoria) => {
    try {
        const todosLosProductos = await listaProductos();
        if (!Array.isArray(todosLosProductos)) return [];

        const catObjetivo = categoria.replace(/\s+/g, '').toLowerCase();

        return todosLosProductos.filter(producto => {
            const catProducto = (producto.categoria || producto.category || '').replace(/\s+/g, '').toLowerCase();
            return catProducto === catObjetivo;
        });
    } catch (error) {
        console.log(`Error al obtener productos de ${categoria}:`, error);
        return [];
    }
}

// GET - Obtener categorías únicas presentes en los datos
const obtenerCategorias = async () => {
    const todos = await listaProductos();
    const set = new Set();
    todos.forEach(p => {
        if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
}

// GET - Obtener producto por ID
const obtenerProducto = async (id) => {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (respuesta.ok) {
            const data = await respuesta.json();
            return normalizarProducto(data, 0);
        }
    } catch (error) {
        console.log(`Error al obtener producto ${id} de API:`, error);
    }

    const todos = obtenerDeLocalStorage();
    return todos.find(p => String(p.id) === String(id)) || null;
}

// POST - Crear un nuevo producto
const crearProducto = async (name, imageUrl, price, categoria, description) => {
    const nuevo = {
        name,
        imageUrl,
        price,
        categoria: categoria || "Diversos",
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
            const norm = normalizarProducto(data, 0);
            const actuales = obtenerDeLocalStorage();
            actuales.push(norm);
            guardarEnLocalStorage(actuales);
            return norm;
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
    const actualizado = {
        name,
        imageUrl,
        price,
        categoria,
        description
    };

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(actualizado)
        });
        if (respuesta.ok) {
            const data = await respuesta.json();
            const norm = normalizarProducto(data, 0);
            const actuales = obtenerDeLocalStorage();
            const index = actuales.findIndex(p => String(p.id) === String(id));
            if (index !== -1) {
                actuales[index] = norm;
                guardarEnLocalStorage(actuales);
            }
            return norm;
        }
    } catch (error) {
        console.log("Error al actualizar producto en API, actualizando localmente:", error);
    }

    const actuales = obtenerDeLocalStorage();
    const index = actuales.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
        actuales[index] = { ...actuales[index], ...actualizado, id: String(id) };
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
    obtenerCategorias,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}
