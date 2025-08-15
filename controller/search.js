// Funcionalidad de búsqueda
import { productosServicios } from "../servicios/productos-servicios.js";

// Función para mostrar resultados de búsqueda
const mostrarResultadosBusqueda = (productos, termino) => {
    // Crear contenedor de resultados si no existe
    let resultadosContainer = document.getElementById('search-results');
    if (!resultadosContainer) {
        resultadosContainer = document.createElement('div');
        resultadosContainer.id = 'search-results';
        resultadosContainer.className = 'search-results-container';
        
        // Insertar después del header
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(resultadosContainer, main.firstChild);
        }
    }
    
    // Limpiar resultados anteriores
    resultadosContainer.innerHTML = '';
    
    if (productos.length === 0) {
        resultadosContainer.innerHTML = `
            <div class="search-no-results">
                <h3>No se encontraron resultados para "${termino}"</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }
    
    // Mostrar resultados
    resultadosContainer.innerHTML = `
        <div class="search-results-header">
            <h3>Resultados para "${termino}" (${productos.length} productos encontrados)</h3>
            <button class="close-search" onclick="cerrarResultadosBusqueda()">✕</button>
        </div>
        <div class="search-results-grid" id="search-grid"></div>
    `;
    
    const grid = document.getElementById('search-grid');
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.className = 'product__card search-result';
        card.innerHTML = `
            <div class="imgContainer">
                <img class="product__card--img" src="${producto.imageUrl}" alt="${producto.name}">
            </div>
            <div class="product__card--info">
                <p class="product__card--title">${producto.name}</p>
                <p class="product__card--price">${producto.price}</p>
                <p class="product__card--category">${producto.categoria}</p>
                <a href="screens/viewProducts.html?id=${producto.id}" class="product__card-boton">Ver producto</a>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Hacer scroll a los resultados
    resultadosContainer.scrollIntoView({ behavior: 'smooth' });
}

// Función para cerrar resultados de búsqueda
window.cerrarResultadosBusqueda = () => {
    const resultadosContainer = document.getElementById('search-results');
    if (resultadosContainer) {
        resultadosContainer.remove();
    }
}

// Función de búsqueda
const realizarBusqueda = async (termino) => {
    if (!termino || termino.length < 2) {
        alert('Por favor, ingresa al menos 2 caracteres para buscar');
        return;
    }
    
    try {
        // Mostrar indicador de carga
        const searchButton = document.getElementById('search__action');
        const originalText = searchButton.innerHTML;
        searchButton.innerHTML = '<img src="assets/img/loading.gif" alt="Cargando..." style="width: 16px; height: 16px;">';
        searchButton.disabled = true;
        
        const todosLosProductos = await productosServicios.listaProductos();
        const productosFiltrados = todosLosProductos.filter(producto => 
            producto.name.toLowerCase().includes(termino.toLowerCase()) ||
            producto.categoria.toLowerCase().includes(termino.toLowerCase()) ||
            (producto.description && producto.description.toLowerCase().includes(termino.toLowerCase()))
        );
        
        mostrarResultadosBusqueda(productosFiltrados, termino);
        
        // Restaurar botón
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
        
    } catch (error) {
        console.error('Error al realizar búsqueda:', error);
        alert('Error al realizar la búsqueda. Por favor, intenta nuevamente.');
        
        // Restaurar botón en caso de error
        const searchButton = document.getElementById('search__action');
        searchButton.innerHTML = '<img src="assets/img/header/search.svg" alt="" class="header__search-icon">';
        searchButton.disabled = false;
    }
}

// Inicializar funcionalidad de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search__action');
    const searchInput = document.getElementById('search__items');
    
    if (searchButton && searchInput) {
        // Búsqueda por click en botón
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const termino = searchInput.value.trim();
            realizarBusqueda(termino);
        });
        
        // Búsqueda por Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const termino = searchInput.value.trim();
                realizarBusqueda(termino);
            }
        });
        
        // Limpiar resultados cuando se borra el input
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim() === '') {
                cerrarResultadosBusqueda();
            }
        });
    }
});

export { realizarBusqueda, mostrarResultadosBusqueda };
