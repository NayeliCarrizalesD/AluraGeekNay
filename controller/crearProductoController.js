import { productosServicios } from "../servicios/productos-servicios.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-form]');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = document.querySelector('[data-url]')?.value.trim() || '';
            const nombre = document.querySelector('[data-nombre]')?.value.trim() || '';
            const precio = document.querySelector('[data-precio]')?.value.trim() || '';
            const categoriaSelect = document.querySelector('[data-categoria]');
            const categoria = categoriaSelect ? categoriaSelect.value : '';
            const descripcion = document.querySelector('[data-descripcion]')?.value.trim() || '';

            if (!url || !nombre || !precio || !categoria || !descripcion) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Campos incompletos',
                        text: 'Por favor llena todos los campos del producto.',
                        icon: 'warning'
                    });
                } else {
                    alert('Por favor llena todos los campos.');
                }
                return;
            }

            try {
                await productosServicios.crearProducto(
                    nombre,
                    url,
                    precio.startsWith('$') ? precio : `$ ${precio}`,
                    categoria,
                    descripcion
                );

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: '¡Producto creado!',
                        text: 'El nuevo producto se ha registrado exitosamente.',
                        icon: 'success',
                        timer: 1800,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'adminProducts.html';
                    });
                } else {
                    alert('Producto creado exitosamente');
                    window.location.href = 'adminProducts.html';
                }
            } catch (error) {
                console.error('Error al crear producto:', error);
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Error',
                        text: 'No fue posible registrar el producto. Inténtalo de nuevo.',
                        icon: 'error'
                    });
                }
            }
        });
    }
});
