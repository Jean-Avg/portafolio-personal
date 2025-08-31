
const arroRight = document.querySelector('.portafolio-box .navigation .arrow-right');
const arroLeft = document.querySelector('.portafolio-box .navigation .arrow-left');
const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
const totalImages = document.querySelectorAll('.portfolio-carousel .img-item').length;
const portafolioDetails = document.querySelectorAll('.portafolio-detail'); // Selecciona los detalles del portafolio

let index = 0;

//Función para descargar el currículum
function downloadCV() {
    const button = document.getElementById('downloadCV');
    const cvUrl = button.getAttribute('data-cv-url');
    const action = button.getAttribute('data-action') || 'download';
    
    // Validar que existe la URL
    if (!cvUrl) {
        alert('Error: Link del CV no configurado');
        return;
    }
    
    try {
        if (action === 'view') {
            // Solo abrir en nueva pestaña para visualizar
            window.open(cvUrl, '_blank');
        } else {
            // Descargar el archivo
            const link = document.createElement('a');
            link.href = cvUrl;
            link.download = 'CV_Jean_Aleman.pdf'; // Nombre para la descarga
            link.target = '_blank';
            
            // Agregar al DOM temporalmente
            document.body.appendChild(link);
            
            // Simular clic para iniciar descarga
            link.click();
            
            // Limpiar: remover elemento temporal
            document.body.removeChild(link);
            
            console.log('Descarga de CV iniciada desde GitHub');
        }
        
    } catch (error) {
        console.error('Error al descargar CV:', error);
        // Fallback: abrir en nueva pestaña
        window.open(cvUrl, '_blank');
    }
}

// Event listener (mantiene lo mismo)
document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('downloadCV');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadCV);
        
        // Efecto visual opcional al hacer clic
        downloadButton.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    }
});


// Función para actualizar el estado activo del carrusel y los detalles
const activePortafolio = () => {
    // Mueve las imágenes del carrusel
    imgSlide.style.transform = `translateX(${index * -100}%)`;

    // Habilita o deshabilita los botones de navegación
    arroLeft.classList.toggle('disabled', index === 0);
    arroRight.classList.toggle('disabled', index === totalImages - 1);

    // Actualiza los detalles del portafolio
    portafolioDetails.forEach(detail => detail.classList.remove('active')); // Elimina la clase activa
    portafolioDetails[index].classList.add('active'); // Activa el detalle correspondiente
};

// Evento para el botón derecho
arroRight.addEventListener('click', () => {
    if (index < totalImages - 1) {
        index++;
        activePortafolio();
    }
});

// Evento para el botón izquierdo
arroLeft.addEventListener('click', () => {
    if (index > 0) {
        index--;
        activePortafolio();
    }
});

// Inicializa el carrusel y los detalles del portafolio
activePortafolio();

// === MENÚ MÓVIL ===
const nav = document.getElementById('nav');
function mostrarOcultarMenu() { nav.classList.toggle('open'); }
function seleccionar()        { nav.classList.remove('open'); }

// ==========================================
// MAPA ARCGIS PARA SECCIÓN CONTACTO
// ==========================================

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/geometry/Point",
    "esri/symbols/PictureMarkerSymbol",
    "esri/PopupTemplate",
    "esri/widgets/Locate"
], function(Map, MapView, Graphic, Point, PictureMarkerSymbol, PopupTemplate, Locate) {

    // Crear el mapa
    const map = new Map({
        basemap: "dark-gray-vector" // Basemap oscuro que combina con tu diseño
    });

    // Crear la vista del mapa centrada en Heredia, Costa Rica
    const view = new MapView({
        container: "mapDiv",
        map: map,
        center: [-84.1165, 9.9975], // Coordenadas de Heredia, Costa Rica
        zoom: 13,
        ui: {
            components: ["attribution"] // Solo mostrar atribución
        }
    });

    // Símbolo personalizado para la ubicación
    const locationSymbol = new PictureMarkerSymbol({
        url: "data:image/svg+xml;base64," + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
                <circle cx="12" cy="12" r="10" fill="#087aa9" stroke="#fff" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="#fff"/>
                <circle cx="12" cy="12" r="2" fill="#087aa9"/>
            </svg>
        `),
        width: 40,
        height: 40
    });

    // Crear punto de ubicación
    const locationPoint = new Point({
        longitude: -84.1165,
        latitude: 9.9975
    });

    // Template para el popup
    const popupTemplate = new PopupTemplate({
        title: "📍 Jean Alemán",
        content: `
            <div style="font-family: 'Work Sans', sans-serif; padding: 10px;">
                <h4 style="color: #087aa9; margin: 0 0 10px 0;">Geógrafo & Técnico GIS</h4>
                <p style="margin: 5px 0;"><strong>📍 Ubicación:</strong> Heredia, Costa Rica</p>
                <p style="margin: 5px 0;"><strong>📱 Teléfono:</strong> +506 8460-5741</p>
                <p style="margin: 5px 0;"><strong>✉️ Email:</strong> jean.aleman.v@gmail.com</p>
                <hr style="margin: 15px 0; border: 1px solid #087aa9;">
                <p style="margin: 10px 0 0 0; font-style: italic; color: #666;">
                    Experto en Sistemas de Información Geográfica y desarrollo web
                </p>
            </div>
        `
    });

    // Crear el gráfico de ubicación
    const locationGraphic = new Graphic({
        geometry: locationPoint,
        symbol: locationSymbol,
        popupTemplate: popupTemplate
    });

    // Agregar el gráfico al mapa
    view.graphics.add(locationGraphic);

    // Agregar widget de localización
    const locateWidget = new Locate({
        view: view,
        graphic: new Graphic({
            symbol: { 
                type: "simple-marker",
                color: "#7cf03d",
                size: 12,
                outline: {
                    color: "#ffffff",
                    width: 2
                }
            }
        })
    });

    view.ui.add(locateWidget, "top-left");

    // Animar hacia la ubicación cuando se carga la vista
    view.when(function() {
        view.goTo({
            target: locationGraphic,
            zoom: 14
        }, {
            duration: 2000,
            easing: "ease-in-out"
        });
    });

    // Efecto de pulso en el marcador (opcional)
    setInterval(() => {
        if (view.graphics.includes(locationGraphic)) {
            view.graphics.remove(locationGraphic);
            setTimeout(() => {
                view.graphics.add(locationGraphic);
            }, 100);
        }
    }, 3000);

});

// ==========================================
// FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const btnEnviar = document.querySelector('.btn-enviar');
    const btnText = document.querySelector('.btn-text');
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remover errores previos
        field.classList.remove('error');
        
        // Validaciones específicas
        switch(field.type) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showFieldError(field, 'Ingresa un email válido');
                }
                break;
            case 'tel':
                if (value && !isValidPhone(value)) {
                    showFieldError(field, 'Ingresa un teléfono válido');
                }
                break;
        }
        
        // Validación de campos requeridos
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo es requerido');
        }
    }

    function clearError(e) {
        const field = e.target;
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        
        // Remover mensaje de error previo
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    // Manejar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showFieldError(input, 'Este campo es requerido');
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Simular envío (aquí integrarías con tu backend)
        btnText.textContent = 'Enviando...';
        btnEnviar.disabled = true;
        
        setTimeout(() => {
            // Simular éxito
            btnText.textContent = 'Mensaje Enviado!';
            btnEnviar.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            
            // Resetear formulario
            form.reset();
            
            // Mostrar notificación de éxito
            showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
            
            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                btnText.textContent = 'Enviar Mensaje';
                btnEnviar.disabled = false;
                btnEnviar.style.background = 'linear-gradient(135deg, var(--accent-color), #065a7a)';
            }, 3000);
            
        }, 2000);
    });

    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 100);

        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
});

// Agregar estilos para validación y notificaciones
const styles = `
<style>
.input-group input.error,
.input-group select.error,
.input-group textarea.error {
    border-color: #e74c3c !important;
    background: rgba(231, 76, 60, 0.1) !important;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.error-message::before {
    content: "⚠️";
    font-size: 12px;
}

.notification {
    position: fixed;
    top: 100px;
    right: 30px;
    background: rgba(30, 35, 38, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    transform: translateX(400px);
    transition: all 0.3s ease;
    max-width: 350px;
}

.notification.show {
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #fff;
}

.notification-success {
    border-left: 4px solid #28a745;
}

.notification-error {
    border-left: 4px solid #e74c3c;
}

.notification-info {
    border-left: 4px solid #087aa9;
}

@media (max-width: 600px) {
    .notification {
        right: 15px;
        left: 15px;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', styles);
