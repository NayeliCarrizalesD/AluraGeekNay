import { productosServicios } from "../servicios/productos-servicios.js";

// Función para crear la tarjeta de producto
const nuevoProducto = (name, imageUrl, price, id) => {
    const card = document.createElement("div");
    card.className = "product__card";
    const contenido = `
        <div class="product__card-edit hidden">
            <button class="btnDelete" type="button"><img src="assets/img/icons/delete.svg" alt="delete_icon" class="iconEdit" data-delete></button>
            <a href="screens/edit-product.html?id=${id}"><img src="assets/img/icons/edit.svg" alt="edit_icon" class="iconEdit" data-edit></a>
        </div>
        <div class="imgContainer">
            <img class="product__card--img" src="${imageUrl}" alt="imagen_del_producto">
        </div>
        <div class="product__card--info">
            <p class="product__card--title">${name}</p>
            <p class="product__card--price">${price}</p>
            <a href="screens/viewProducts.html?id=${id}" class="product__card-boton" data-verProducto>Ver producto</a>
        </div>
    `;
    card.innerHTML = contenido;
    card.dataset.id = id;
    return card;
}

// Función para renderizar productos en un contenedor específico
const renderizarProductos = async (contenedor, categoria, limite = 6) => {
    try {
        const productos = await productosServicios.obtenerProductosPorCategoria(categoria);
        
        if (!productos || productos.length === 0) {
            contenedor.innerHTML = '<p class="no-products">No hay productos disponibles en esta categoría</p>';
            return;
        }

        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Limitar la cantidad de productos mostrados
        const productosLimitados = productos.slice(0, limite);
        
        productosLimitados.forEach(producto => {
            const tarjetaProducto = nuevoProducto(
                producto.name,
                producto.imageUrl,
                producto.price,
                producto.id
            );
            contenedor.appendChild(tarjetaProducto);
        });
        
    } catch (error) {
        console.error(`Error al renderizar productos de ${categoria}:`, error);
        contenedor.innerHTML = '<p class="error-message">Error al cargar los productos</p>';
    }
}

// Función para cargar todos los productos por categorías
const cargarProductosPorCategorias = async () => {
    // Contenedores de las diferentes categorías
    const starWarsContainer = document.querySelector('[data-starWarsCategory]');
    const consolasContainer = document.querySelector('[data-consolasCategoria]');
    const diversosContainer = document.querySelector('[data-diversosCategoria]');

    // Renderizar productos por categoría
    if (starWarsContainer) {
        await renderizarProductos(starWarsContainer, 'StarWars');
    }
    
    if (consolasContainer) {
        await renderizarProductos(consolasContainer, 'Consolas');
    }
    
    if (diversosContainer) {
        await renderizarProductos(diversosContainer, 'Diversos');
    }
}

// Función para buscar productos
const buscarProductos = async (termino) => {
    try {
        const todosLosProductos = await productosServicios.listaProductos();
        const productosFiltrados = todosLosProductos.filter(producto => 
            producto.name.toLowerCase().includes(termino.toLowerCase()) ||
            producto.categoria.toLowerCase().includes(termino.toLowerCase())
        );
        return productosFiltrados;
    } catch (error) {
        console.error('Error al buscar productos:', error);
        return [];
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosPorCategorias();
    
    // Configurar búsqueda si existe el elemento
    const searchButton = document.getElementById('search__action');
    const searchInput = document.getElementById('search__items');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const termino = searchInput.value.trim();
            if (termino) {
                const resultados = await buscarProductos(termino);
                // Aquí puedes agregar lógica para mostrar los resultados de búsqueda
                console.log('Resultados de búsqueda:', resultados);
            }
        });

        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const termino = searchInput.value.trim();
                if (termino) {
                    const resultados = await buscarProductos(termino);
                    console.log('Resultados de búsqueda:', resultados);
                }
            }
        });
    }
});

// Exportar funciones para uso en otros módulos
export {
    nuevoProducto,
    renderizarProductos,
    cargarProductosPorCategorias,
    buscarProductos
};