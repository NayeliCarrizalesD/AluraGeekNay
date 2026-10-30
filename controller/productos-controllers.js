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

// Función auxiliar para renderizar una lista de productos en un contenedor
const renderizarLista = (contenedor, productos, limite = 6) => {
    if (!contenedor) return;
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        contenedor.innerHTML = '<p class="no-products">No hay productos disponibles en esta categoría</p>';
        return;
    }
    contenedor.innerHTML = '';
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
};

// Función para actualizar el título H2 visible de una sección
const actualizarTituloSeccion = (contenedor, nuevoTitulo) => {
    try {
        const seccion = contenedor.closest('.products');
        if (seccion) {
            const tituloH2 = seccion.querySelector('.product__title');
            if (tituloH2 && nuevoTitulo) {
                tituloH2.textContent = nuevoTitulo;
            }
        }
    } catch (e) {
        console.warn('No se pudo actualizar título de sección:', e);
    }
};

// Función para renderizar productos por categoría (compatibilidad)
const renderizarProductos = async (contenedor, categoria, limite = 6) => {
    try {
        const productos = await productosServicios.obtenerProductosPorCategoria(categoria);
        renderizarLista(contenedor, productos, limite);
    } catch (error) {
        console.error(`Error al renderizar productos de ${categoria}:`, error);
        contenedor.innerHTML = '<p class="error-message">Error al cargar los productos</p>';
    }
}

// Función inteligente para cargar y adaptar productos por categorías
const cargarProductosPorCategorias = async () => {
    // Contenedores de las diferentes categorías en la página principal
    const starWarsContainer = document.querySelector('[data-starWarsCategory], [data-starwarscategory]');
    const consolasContainer = document.querySelector('[data-consolasCategoria], [data-consolascategoria]');
    const diversosContainer = document.querySelector('[data-diversosCategoria], [data-diversoscategoria]');
    const adminProductsContainer = document.querySelector('[data-adminProducts], [data-adminproducts]');

    // Si estamos en allProducts o adminProducts (vista completa)
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
        return;
    }

    // Si estamos en el home (index.html):
    if (starWarsContainer || consolasContainer || diversosContainer) {
        try {
            const todos = await productosServicios.listaProductos();
            if (!todos || todos.length === 0) return;

            // Agrupar productos por categoría real
            const categoriasMap = new Map();
            todos.forEach(p => {
                const catRaw = (p.categoria || p.category || 'General').trim();
                const key = catRaw.replace(/\s+/g, '').toLowerCase();
                if (!categoriasMap.has(key)) {
                    categoriasMap.set(key, { nombreOriginal: catRaw, productos: [] });
                }
                categoriasMap.get(key).productos.push(p);
            });

            // Verificar si coinciden con las 3 clásicas
            const swGroup = categoriasMap.get('starwars');
            const coGroup = categoriasMap.get('consolas');
            const diGroup = categoriasMap.get('diversos');

            if (swGroup || coGroup || diGroup) {
                // Hay coincidencia con las clásicas
                if (starWarsContainer && swGroup) {
                    renderizarLista(starWarsContainer, swGroup.productos, 6);
                }
                if (consolasContainer && coGroup) {
                    renderizarLista(consolasContainer, coGroup.productos, 6);
                }
                if (diversosContainer && diGroup) {
                    renderizarLista(diversosContainer, diGroup.productos, 6);
                }

                // Si alguna quedó vacía, rellenarla con otras categorías disponibles
                const otras = [...categoriasMap.entries()]
                    .filter(([k]) => k !== 'starwars' && k !== 'consolas' && k !== 'diversos')
                    .map(([, v]) => v);

                if (starWarsContainer && (!swGroup || swGroup.productos.length === 0) && otras[0]) {
                    actualizarTituloSeccion(starWarsContainer, otras[0].nombreOriginal);
                    renderizarLista(starWarsContainer, otras[0].productos, 6);
                    otras.shift();
                }
                if (consolasContainer && (!coGroup || coGroup.productos.length === 0) && otras[0]) {
                    actualizarTituloSeccion(consolasContainer, otras[0].nombreOriginal);
                    renderizarLista(consolasContainer, otras[0].productos, 6);
                    otras.shift();
                }
                if (diversosContainer && (!diGroup || diGroup.productos.length === 0) && otras[0]) {
                    actualizarTituloSeccion(diversosContainer, otras[0].nombreOriginal);
                    renderizarLista(diversosContainer, otras[0].productos, 6);
                    otras.shift();
                }
            } else {
                // Las categorías son completamente dinámicas (ej. de MockAPI o personalizadas)
                const listaGrupos = [...categoriasMap.values()];
                const contenedores = [starWarsContainer, consolasContainer, diversosContainer].filter(Boolean);

                if (listaGrupos.length >= contenedores.length) {
                    // Hay 3 o más categorías: asignar cada una a un contenedor y actualizar título
                    contenedores.forEach((contenedor, i) => {
                        const grupo = listaGrupos[i];
                        actualizarTituloSeccion(contenedor, grupo.nombreOriginal);
                        renderizarLista(contenedor, grupo.productos, 6);
                    });
                } else if (listaGrupos.length > 0) {
                    // Hay 1 o 2 categorías: asignar las disponibles y distribuir el resto
                    contenedores.forEach((contenedor, i) => {
                        if (listaGrupos[i]) {
                            actualizarTituloSeccion(contenedor, listaGrupos[i].nombreOriginal);
                            renderizarLista(contenedor, listaGrupos[i].productos, 6);
                        } else {
                            const offset = i * 6;
                            const porcion = todos.slice(offset, offset + 6);
                            if (porcion.length > 0) {
                                actualizarTituloSeccion(contenedor, `Más Productos`);
                                renderizarLista(contenedor, porcion, 6);
                            }
                        }
                    });
                } else {
                    // Caso sin categorías: repartir en bloques de 6
                    contenedores.forEach((contenedor, i) => {
                        const porcion = todos.slice(i * 6, (i + 1) * 6);
                        renderizarLista(contenedor, porcion, 6);
                    });
                }
            }
        } catch (error) {
            console.error('Error al cargar productos adaptativos:', error);
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
