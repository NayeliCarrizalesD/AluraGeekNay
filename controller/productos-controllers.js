import { productosServicios } from "../servicios/productos-servicios.js";

// Función para crear la tarjeta de producto
const nuevoProducto = (name, imageUrl, price, id) => {
    const card = document.createElement("div");
    card.className = "product__card";
    const esAdmin = window.location.pathname.includes("adminProducts");
    const esScreens = window.location.pathname.includes("screens");
    const rutaBase = esScreens ? "" : "screens/";
    const rutaAssets = esScreens ? "../" : "";

    const contenido = `
        <div class="product__card-edit ${esAdmin ? '' : 'hidden'}">
            <button class="btnDelete" type="button"><img src="${rutaAssets}assets/img/icons/delete.svg" alt="delete_icon" class="iconEdit" data-delete></button>
            <a href="${rutaBase}edit-product.html?id=${id}"><img src="${rutaAssets}assets/img/icons/edit.svg" alt="edit_icon" class="iconEdit" data-edit></a>
        </div>
        <div class="imgContainer">
            <img class="product__card--img" src="${imageUrl}" alt="imagen_del_producto">
        </div>
        <div class="product__card--info">
            <p class="product__card--title">${name}</p>
            <p class="product__card--price">${price}</p>
            <a href="${rutaBase}viewProducts.html?id=${id}" class="product__card-boton" data-verProducto>Ver producto</a>
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
        
        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            contenedor.innerHTML = '<p class="no-products">No hay productos disponibles en esta categoría</p>';
            return;
        }

        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Limitar la cantidad de productos mostrados
        const productosLimitados = productos.slice(0, limite);
        
        if (Array.isArray(productosLimitados)) productosLimitados.forEach(producto => {
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

// Función para cargar todos los productos por categorías o en vista general
const cargarProductosPorCategorias = async () => {
    // Contenedores de las diferentes categorías en la página principal
    const starWarsContainer = document.querySelector('[data-starWarsCategory], [data-starwarscategory]');
    const consolasContainer = document.querySelector('[data-consolasCategoria], [data-consolascategoria]');
    const diversosContainer = document.querySelector('[data-diversosCategoria], [data-diversoscategoria]');
    const adminProductsContainer = document.querySelector('[data-adminProducts], [data-adminproducts]');

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

    // Renderizar todos los productos si estamos en allProducts o adminProducts
    if (adminProductsContainer) {
        try {
            const todos = await productosServicios.listaProductos();
            if (todos && todos.length > 0) {
                adminProductsContainer.innerHTML = '';
                todos.forEach(producto => {
                    const tarjeta = nuevoProducto(producto.name, producto.imageUrl, producto.price, producto.id);
                    adminProductsContainer.appendChild(tarjeta);
                });
            } else {
                adminProductsContainer.innerHTML = '<p class="no-products">No hay productos registrados</p>';
            }
        } catch (e) {
            console.error('Error al cargar lista completa de productos:', e);
        }
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
    
    // Delegación de eventos para eliminar producto
    document.addEventListener('click', async (e) => {
        const btnDelete = e.target.closest('.btnDelete') || (e.target.matches('[data-delete]') ? e.target : null);
        if (btnDelete) {
            e.preventDefault();
            const card = btnDelete.closest('.product__card');
            const id = card ? card.dataset.id : null;
            if (!id) return;

            const confirmar = typeof Swal !== 'undefined'
                ? await Swal.fire({
                    title: '¿Eliminar producto?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then(res => res.isConfirmed)
                : confirm('¿Deseas eliminar este producto?');

            if (confirmar) {
                try {
                    await productosServicios.eliminarProducto(id);
                    if (card) card.remove();
                    if (typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'Eliminado',
                            text: 'El producto ha sido eliminado.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                } catch (err) {
                    console.error('Error al eliminar producto:', err);
                }
            }
        }
    });

    // Configurar búsqueda si existe el elemento
    const searchButton = document.getElementById('search__action');
    const searchInput = document.getElementById('search__items');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const termino = searchInput.value.trim();
            if (termino) {
                const resultados = await buscarProductos(termino);
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
