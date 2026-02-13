// ====================================
// SISTEMA DE GESTIÓN DE IMÁGENES - KING DISEÑO
// ====================================

class ImageManager {
    constructor() {
        this.imageCache = new Map();
        this.placeholders = {
            productos: 'https://via.placeholder.com/300x300/1e40af/ffffff?text=KING+DISEÑO',
            banners: 'https://via.placeholder.com/800x200/f59e0b/000000?text=BANNER+PUBLICITARIO',
            logos: 'https://via.placeholder.com/200x80/8b5cf6/ffffff?text=KING+DISEÑO',
            avatars: 'https://via.placeholder.com/100x100/10b981/ffffff?text=USER'
        };
        this.imageSpecs = {
            productos: { width: 300, height: 300, format: 'webp,jpg,png', maxSize: '2MB' },
            banners: { width: 800, height: 200, format: 'webp,jpg,png', maxSize: '1MB' },
            logos: { width: 200, height: 80, format: 'svg,png,webp', maxSize: '500KB' },
            avatars: { width: 100, height: 100, format: 'webp,jpg,png', maxSize: '500KB' }
        };
    }

    // Generar placeholder personalizado
    generatePlaceholder(text, width = 300, height = 300, bgColor = '1e40af', textColor = 'ffffff') {
        return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
    }

    // Optimizar URL de imagen
    optimizeImage(url, width = null, height = null) {
        if (!url || url.includes('placeholder')) return url;

        // Para imágenes locales, agregar parámetros de optimización
        if (url.startsWith('IMAGENES/') || url.startsWith('./IMAGENES/')) {
            const params = new URLSearchParams();
            if (width) params.set('w', width);
            if (height) params.set('h', height);
            params.set('q', '80'); // Calidad
            params.set('f', 'webp'); // Formato

            return `${url}?${params.toString()}`;
        }

        return url;
    }

    // Cargar imagen con lazy loading
    lazyLoadImage(imgElement, src, placeholder = null) {
        if (!imgElement) return;

        // Establecer placeholder inicial
        if (placeholder) {
            imgElement.src = placeholder;
        }

        // Crear nueva imagen para precarga
        const img = new Image();
        img.onload = () => {
            imgElement.src = src;
            imgElement.classList.add('loaded');
        };
        img.onerror = () => {
            imgElement.src = this.getPlaceholder('productos');
            imgElement.classList.add('error');
        };
        img.src = src;
    }

    // Obtener placeholder por tipo
    getPlaceholder(type) {
        return this.placeholders[type] || this.placeholders.productos;
    }

    // Validar imagen antes de subir
    validateImage(file, type = 'productos') {
        const specs = this.imageSpecs[type];
        if (!specs) return { valid: false, error: 'Tipo de imagen no válido' };

        // Validar tamaño
        if (file.size > this.parseFileSize(specs.maxSize)) {
            return { valid: false, error: `Imagen demasiado grande. Máximo: ${specs.maxSize}` };
        }

        // Validar formato
        const allowedFormats = specs.format.split(',');
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedFormats.includes(fileExtension)) {
            return { valid: false, error: `Formato no permitido. Permitidos: ${specs.format}` };
        }

        return { valid: true };
    }

    // Convertir tamaño de archivo a bytes
    parseFileSize(sizeStr) {
        const units = { 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
        const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i);
        if (!match) return 0;

        const size = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        return size * (units[unit] || 1);
    }

    // Crear galería de imágenes
    createGallery(container, images, options = {}) {
        const defaults = {
            maxImages: 10,
            showCaptions: true,
            enableZoom: true,
            layout: 'grid' // grid, carousel, masonry
        };

        const config = { ...defaults, ...options };

        container.innerHTML = '';

        const gallery = document.createElement('div');
        gallery.className = `image-gallery gallery-${config.layout}`;

        images.slice(0, config.maxImages).forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = this.optimizeImage(image.src || image.url);
            img.alt = image.alt || image.caption || `Imagen ${index + 1}`;
            img.loading = 'lazy';

            if (config.enableZoom) {
                img.classList.add('zoomable');
                img.onclick = () => this.showZoomModal(img.src, img.alt);
            }

            item.appendChild(img);

            if (config.showCaptions && image.caption) {
                const caption = document.createElement('div');
                caption.className = 'gallery-caption';
                caption.textContent = image.caption;
                item.appendChild(caption);
            }

            gallery.appendChild(item);
        });

        container.appendChild(gallery);
    }

    // Mostrar modal de zoom
    showZoomModal(src, alt) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <img src="${src}" alt="${alt}" />
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar con ESC
        const closeModal = () => modal.remove();
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Sistema de iconos SVG integrado
    getIcon(name, size = 24) {
        const icons = {
            camera: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 7V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7ZM19 7H5V20H19V7Z"/></svg>`,
            upload: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>`,
            image: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/></svg>`,
            gallery: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6"/></svg>`,
            zoom: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.5L20.5 19L15.5 14M9.5 14C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14Z"/></svg>`,
            video: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/></svg>`,
            play: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M8,5.14V19.14L19,12.14L8,5.14Z"/></svg>`,
            film: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5,3H5V1.5A0.5,0.5 0 0,1 5.5,1A0.5,0.5 0 0,1 6,1.5V3H18V1.5A0.5,0.5 0 0,1 18.5,1A0.5,0.5 0 0,1 19,1.5V3H20.5A0.5,0.5 0 0,1 21,3.5V4A0.5,0.5 0 0,1 20.5,4.5H19V6H20.5A0.5,0.5 0 0,1 21,6.5V7A0.5,0.5 0 0,1 20.5,7.5H19V9H20.5A0.5,0.5 0 0,1 21,9.5V10A0.5,0.5 0 0,1 20.5,10.5H19V12H20.5A0.5,0.5 0 0,1 21,12.5V13A0.5,0.5 0 0,1 20.5,13.5H19V15H20.5A0.5,0.5 0 0,1 21,15.5V16A0.5,0.5 0 0,1 20.5,16.5H19V18H20.5A0.5,0.5 0 0,1 21,18.5V19A0.5,0.5 0 0,1 20.5,19.5H19V21H18V22.5A0.5,0.5 0 0,1 17.5,23A0.5,0.5 0 0,1 17,22.5V21H6V22.5A0.5,0.5 0 0,1 5.5,23A0.5,0.5 0 0,1 5,22.5V21H3.5A0.5,0.5 0 0,1 3,20.5V20A0.5,0.5 0 0,1 3.5,19.5H5V18H3.5A0.5,0.5 0 0,1 3,17.5V17A0.5,0.5 0 0,1 3.5,16.5H5V15H3.5A0.5,0.5 0 0,1 3,14.5V14A0.5,0.5 0 0,1 3.5,13.5H5V12H3.5A0.5,0.5 0 0,1 3,11.5V11A0.5,0.5 0 0,1 3.5,10.5H5V9H3.5A0.5,0.5 0 0,1 3,8.5V8A0.5,0.5 0 0,1 3.5,7.5H5V6H3.5A0.5,0.5 0 0,1 3,5.5V5A0.5,0.5 0 0,1 3.5,4.5H5V3H3.5A0.5,0.5 0 0,1 3,2.5V2A0.5,0.5 0 0,1 3.5,1.5H18.5A0.5,0.5 0 0,1 19,2V2.5A0.5,0.5 0 0,1 18.5,3H17V4.5A0.5,0.5 0 0,1 16.5,5A0.5,0.5 0 0,1 16,4.5V3H6V4.5A0.5,0.5 0 0,1 5.5,5A0.5,0.5 0 0,1 5,4.5V3H3.5M5,6V7H16V6H5M5,8V9H16V8H5M5,10V11H16V10H5M5,12V13H16V12H5M5,14V15H16V14H5M5,16V17H16V16H5M5,18V19H16V18H5Z"/></svg>`
        };

        return icons[name] || icons.image;
    }

    // Gestión de videos
    createVideoPlayer(container, videoSrc, options = {}) {
        const defaults = {
            autoplay: false,
            controls: true,
            loop: false,
            muted: false,
            poster: null,
            width: '100%',
            height: 'auto',
            preload: 'metadata'
        };

        const config = { ...defaults, ...options };

        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-player-container';
        videoContainer.style.cssText = `
            position: relative;
            width: ${config.width};
            max-width: 100%;
            margin: 20px 0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            background: #000;
        `;

        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = config.controls;
        video.autoplay = config.autoplay;
        video.loop = config.loop;
        video.muted = config.muted;
        video.preload = config.preload;
        video.poster = config.poster;
        video.style.cssText = `
            width: 100%;
            height: ${config.height};
            display: block;
            border-radius: 12px;
        `;

        // Overlay de carga
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'video-loading-overlay';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
            opacity: 1;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        loadingOverlay.innerHTML = `
            <div style="text-align: center;">
                <div style="width: 40px; height: 40px; border: 3px solid #fff; border-top: 3px solid var(--accent-orange); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                <div>Cargando video...</div>
            </div>
        `;

        video.addEventListener('loadstart', () => {
            loadingOverlay.style.opacity = '1';
        });

        video.addEventListener('canplay', () => {
            loadingOverlay.style.opacity = '0';
        });

        video.addEventListener('error', () => {
            loadingOverlay.innerHTML = `
                <div style="text-align: center; color: #ff6b6b;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">⚠️</div>
                    <div>Error al cargar el video</div>
                </div>
            `;
        });

        videoContainer.appendChild(video);
        videoContainer.appendChild(loadingOverlay);
        container.appendChild(videoContainer);

        return {
            video,
            container: videoContainer,
            play: () => video.play(),
            pause: () => video.pause(),
            stop: () => {
                video.pause();
                video.currentTime = 0;
            }
        };
    }

    // Galería de videos
    createVideoGallery(container, videos, options = {}) {
        const defaults = {
            maxVideos: 6,
            showTitles: true,
            autoplay: false,
            gridCols: 'repeat(auto-fit, minmax(300px, 1fr))'
        };

        const config = { ...defaults, ...options };

        container.innerHTML = '';

        const gallery = document.createElement('div');
        gallery.className = 'video-gallery';
        gallery.style.cssText = `
            display: grid;
            grid-template-columns: ${config.gridCols};
            gap: 20px;
            margin: 20px 0;
        `;

        videos.slice(0, config.maxVideos).forEach((videoData, index) => {
            const item = document.createElement('div');
            item.className = 'video-gallery-item';
            item.style.cssText = `
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: var(--shadow-md);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                cursor: pointer;
            `;

            // Miniatura del video
            const thumbnail = document.createElement('div');
            thumbnail.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 3rem;
                position: relative;
            `;

            // Ícono de play
            const playIcon = document.createElement('div');
            playIcon.innerHTML = this.getIcon('play', 60);
            playIcon.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                opacity: 0.8;
                transition: opacity 0.3s ease;
            `;

            thumbnail.appendChild(playIcon);

            // Información del video
            const info = document.createElement('div');
            info.style.cssText = `
                padding: 15px;
                background: white;
                border-top: 1px solid #eee;
            `;

            if (config.showTitles && videoData.title) {
                const title = document.createElement('h4');
                title.textContent = videoData.title;
                title.style.cssText = `
                    margin: 0 0 8px 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                `;
                info.appendChild(title);
            }

            if (videoData.description) {
                const desc = document.createElement('p');
                desc.textContent = videoData.description;
                desc.style.cssText = `
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                `;
                info.appendChild(desc);
            }

            // Evento de clic para reproducir
            item.addEventListener('click', () => {
                this.showVideoModal(videoData.src, videoData.title);
            });

            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
                item.style.boxShadow = 'var(--shadow-lg)';
                playIcon.style.opacity = '1';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = 'var(--shadow-md)';
                playIcon.style.opacity = '0.8';
            });

            item.appendChild(thumbnail);
            item.appendChild(info);
            gallery.appendChild(item);
        });

        container.appendChild(gallery);
    }

    // Modal para reproducir videos
    showVideoModal(videoSrc, title = '') {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        `;

        // Header del modal
        if (title) {
            const header = document.createElement('div');
            header.style.cssText = `
                padding: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                font-size: 1.2rem;
                font-weight: 600;
                text-align: center;
            `;
            header.textContent = title;
            modalContent.appendChild(header);
        }

        // Contenedor del video
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            position: relative;
        `;

        // Botón de cerrar
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        `;

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.9)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(0,0,0,0.7)';
        });

        closeBtn.onclick = () => modal.remove();

        modal.appendChild(modalContent);
        modalContent.appendChild(videoContainer);
        modalContent.appendChild(closeBtn);

        // Crear el reproductor de video
        this.createVideoPlayer(videoContainer, videoSrc, {
            controls: true,
            autoplay: true,
            width: '100%',
            height: 'auto'
        });

        document.body.appendChild(modal);

        // Cerrar con ESC
        const closeModal = () => modal.remove();
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });

        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// ====================================
// ESTILOS PARA EL SISTEMA DE IMÁGENES
// ====================================

const imageStyles = `
/* Galería de imágenes */
.image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.gallery-grid .gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-grid .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.gallery-item img.zoomable {
    cursor: pointer;
}

.gallery-item img.zoomable:hover {
    transform: scale(1.05);
}

.gallery-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: 15px;
    font-size: 14px;
    font-weight: 500;
}

/* Modal de imagen */
.image-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-content img {
    max-width: 100%;
    max-height: 90vh;
    display: block;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0,0,0,0.7);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.modal-close:hover {
    background: rgba(0,0,0,0.9);
}

/* Estados de carga de imágenes */
img[loading] {
    opacity: 0;
    transition: opacity 0.3s ease;
}

img.loaded {
    opacity: 1;
}

img.error {
    filter: grayscale(100%);
    opacity: 0.6;
}

/* Upload de imágenes */
.image-upload-area {
    border: 2px dashed var(--light-blue);
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    background: var(--bg-secondary);
}

.image-upload-area:hover,
.image-upload-area.dragover {
    border-color: var(--accent-orange);
    background: var(--light-blue);
}

.image-upload-area.dragover {
    transform: scale(1.02);
}

.upload-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    opacity: 0.6;
}

.image-upload-area p {
    margin: 10px 0 0 0;
    color: var(--text-secondary);
    font-size: 16px;
}

.image-upload-area span {
    color: var(--accent-orange);
    font-weight: 600;
}

/* Preview de imágenes */
.image-preview {
    position: relative;
    display: inline-block;
    margin: 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: var(--shadow-md);
}

.image-preview img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    display: block;
}

.image-preview .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background 0.3s ease;
}

.image-preview .remove-btn:hover {
    background: rgba(239, 68, 68, 1);
}

/* Responsive */
@media (max-width: 768px) {
    .image-gallery {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
    }

    .gallery-item img {
        height: 150px;
    }

    .modal-content {
        max-width: 95vw;
        max-height: 95vh;
    }
}
`;

// ====================================
// FUNCIONES DE UTILIDAD PARA IMÁGENES
// ====================================

// Generar especificaciones de imágenes para diseñadores
function generateImageSpecs() {
    return {
        productos: {
            descripcion: 'Imágenes de productos para la tienda',
            especificaciones: [
                'Resolución: 300x300 píxeles mínimo',
                'Formato: WebP, JPG, PNG',
                'Tamaño máximo: 2MB',
                'Fondo: Blanco o transparente',
                'Calidad: Alta (80-90%)',
                'Aspecto: Cuadrado (1:1)'
            ],
            ejemplos: [
                'Mouse gamer, teclado mecánico, monitor, laptop',
                'Tarjetas gráficas, procesadores, memorias RAM',
                'Auriculares, sillas gamer, routers'
            ]
        },
        banners: {
            descripcion: 'Banners publicitarios para promociones',
            especificaciones: [
                'Resolución: 800x200 píxeles',
                'Formato: WebP, JPG, PNG',
                'Tamaño máximo: 1MB',
                'Texto: Legible y contrastante',
                'Colores: Paleta KING DISEÑO',
                'Aspecto: Rectangular horizontal (4:1)'
            ],
            ejemplos: [
                'Ofertas especiales, descuentos',
                'Nuevos productos, promociones',
                'Eventos especiales, lanzamientos'
            ]
        },
        logos: {
            descripcion: 'Logotipos y marcas',
            especificaciones: [
                'Resolución: 200x80 píxeles',
                'Formato: SVG (preferido), PNG, WebP',
                'Tamaño máximo: 500KB',
                'Fondo: Transparente',
                'Colores: Azul KING (#1e40af)',
                'Aspecto: Rectangular (2.5:1)'
            ],
            ejemplos: [
                'Logo principal KING DISEÑO',
                'Iconos de categorías',
                'Marcas de productos'
            ]
        },
        avatars: {
            descripcion: 'Imágenes de perfil de usuarios',
            especificaciones: [
                'Resolución: 100x100 píxeles',
                'Formato: WebP, JPG, PNG',
                'Tamaño máximo: 500KB',
                'Forma: Cuadrada',
                'Contenido: Rostros o avatares',
                'Calidad: Media-alta'
            ],
            ejemplos: [
                'Fotos de perfil de clientes',
                'Avatares predeterminados',
                'Imágenes de administradores'
            ]
        }
    };
}

// Crear sistema de placeholders dinámicos
function createDynamicPlaceholders() {
    const categories = {
        accesorios: ['🖱️', '⌨️', '🖱️', '🎧', '🖨️', '💺', '📱', '🔌'],
        computadoras: ['💻', '🖥️', '⌨️', '🖱️', '📺', '🔧'],
        componentes: ['🔧', '💾', '🎮', '⚡', '🔌', '💿']
    };

    const colors = ['1e40af', 'f59e0b', '10b981', '8b5cf6', 'ef4444', '06b6d4'];

    return Object.keys(categories).reduce((acc, category) => {
        acc[category] = categories[category].map((emoji, index) => {
            const color = colors[index % colors.length];
            return `https://via.placeholder.com/300x300/${color}/ffffff?text=${encodeURIComponent(emoji + ' ' + category.toUpperCase())}`;
        });
        return acc;
    }, {});
}

// ====================================
// EXPORTAR FUNCIONES
// ====================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageManager, generateImageSpecs, createDynamicPlaceholders, imageStyles };
}

// Para uso en navegador
if (typeof window !== 'undefined') {
    window.ImageManager = ImageManager;
    window.generateImageSpecs = generateImageSpecs;
    window.createDynamicPlaceholders = createDynamicPlaceholders;
    window.imageStyles = imageStyles;
}

console.log('🎨 Sistema de Gestión de Imágenes KING DISEÑO cargado correctamente');
