import { productosServicios } from "../servicios/productos-servicios.js";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const form = document.querySelector('[data-form]');
    const urlInput = document.querySelector('[data-url]');
    const nombreInput = document.querySelector('[data-nombre]');
    const precioInput = document.querySelector('[data-precio]');
    const categoriaSelect = document.querySelector('[data-categoria]');
    const descInput = document.querySelector('[data-descripcion]');

    if (!id) return;

    try {
        const producto = await productosServicios.obtenerProducto(id);
        if (producto) {
            if (urlInput) urlInput.value = producto.imageUrl || '';
            if (nombreInput) nombreInput.value = producto.name || '';
            if (precioInput) precioInput.value = producto.price || '';
            if (categoriaSelect) categoriaSelect.value = producto.categoria || '';
            if (descInput) descInput.value = producto.description || '';
        }
    } catch (e) {
        console.error('Error al cargar datos para edición:', e);
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = urlInput?.value.trim() || '';
            const nombre = nombreInput?.value.trim() || '';
            const precio = precioInput?.value.trim() || '';
            const categoria = categoriaSelect ? categoriaSelect.value : '';
            const descripcion = descInput?.value.trim() || '';

            try {
                await productosServicios.actualizarProducto(
                    id,
                    nombre,
                    url,
                    precio.startsWith('$') ? precio : `$ ${precio}`,
                    categoria,
                    descripcion
                );

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Producto actualizado!',
                        text: 'Los cambios se han guardado con éxito.',
                        icon: 'success',
                        timer: 1800,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'adminProducts.html';
                    });
                } else {
                    alert('Producto actualizado con éxito');
                    window.location.href = 'adminProducts.html';
                }
            } catch (error) {
                console.error('Error al actualizar producto:', error);
            }
        });
    }
});
