import { PRODUCTOS_INICIALES } from "../servicios/productos-data.js";

// En memoria para la sesión del servidor (se reinicializa si Vercel suspende la función)
let productos = [...PRODUCTOS_INICIALES];

export default function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        if (id) {
            const encontrado = productos.find(p => String(p.id) === String(id));
            if (encontrado) return res.status(200).json(encontrado);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        return res.status(200).json(productos);
    }

    if (req.method === 'POST') {
        const body = req.body || {};
        const nuevo = {
            id: String(Date.now()),
            name: body.name || 'Nuevo Producto',
            price: body.price || '$ 0.00',
            imageUrl: body.imageUrl || 'assets/img/productos/product_details/starwar_glass2.png',
            categoria: body.categoria || 'Diversos',
            description: body.description || ''
        };
        productos.push(nuevo);
        return res.status(201).json(nuevo);
    }

    if (req.method === 'PUT') {
        if (!id) return res.status(400).json({ error: 'Falta ID' });
        const body = req.body || {};
        const index = productos.findIndex(p => String(p.id) === String(id));
        if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });
        productos[index] = { ...productos[index], ...body, id: String(id) };
        return res.status(200).json(productos[index]);
    }

    if (req.method === 'DELETE') {
        if (!id) return res.status(400).json({ error: 'Falta ID' });
        productos = productos.filter(p => String(p.id) !== String(id));
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
