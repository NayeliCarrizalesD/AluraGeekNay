import { productosServicios } from "../servicios/productos-servicios.js";

const resolverRutaImagen = (url) => {
    const fallback = '../assets/img/productos/product_details/starwar_glass2.png';
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    const limpia = url.replace(/^\.?\/?(screens\/)?/, '');
    return encodeURI(`../${limpia}`);
};

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const imgElement = document.querySelector('[data-img]');
    const nameElement = document.querySelector('[data-name]');
    const priceElement = document.querySelector('[data-price]');
    const descElement = document.querySelector('[data-descripcion]');
    const similaresContainer = document.querySelector('[data-products]');
    const fallbackImg = '../assets/img/productos/product_details/starwar_glass2.png';

    if (!id) return;

    try {
        const producto = await productosServicios.obtenerProducto(id);

        if (producto) {
            if (imgElement) {
                imgElement.src = resolverRutaImagen(producto.imageUrl);
                imgElement.onerror = () => { imgElement.src = fallbackImg; };
            }
            if (nameElement) nameElement.textContent = producto.name;
            if (priceElement) priceElement.textContent = producto.price;
            if (descElement) descElement.textContent = producto.description;

            // Cargar productos similares de la misma categoría
            if (similaresContainer && producto.categoria) {
                const similares = await productosServicios.obtenerProductosPorCategoria(producto.categoria);
                const otros = similares.filter(p => String(p.id) !== String(id)).slice(0, 6);

                similaresContainer.innerHTML = '';
                otros.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'product__card';
                    const srcImg = resolverRutaImagen(p.imageUrl);
                    card.innerHTML = `
                        <div class="imgContainer">
                            <img class="product__card--img" src="${srcImg}" alt="${p.name}" onerror="this.onerror=null; this.src='${fallbackImg}';">
                        </div>
                        <div class="product__card--info">
                            <p class="product__card--title">${p.name}</p>
                            <p class="product__card--price">${p.price}</p>
                            <a href="viewProducts.html?id=${p.id}" class="product__card-boton">Ver producto</a>
                        </div>
                    `;
                    similaresContainer.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar detalle del producto:', error);
    }
});
