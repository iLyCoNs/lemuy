/**
 * SANTUARIO LEMUY & CHILOÉ - INTERACTIVE CONTROLLER
 * Especialmente diseñado para la reproducción interactiva en hover,
 * visualizador de propiedades, modal cinematográfico (Video local + YouTube 4K),
 * showcase de Reel en formato celular y menú móvil responsivo.
 */

// ==========================================================================
// CONFIGURACIÓN DE CONTACTO (Fácilmente modificable cuando el cliente entregue su número)
// ==========================================================================
const CONFIG_WHATSAPP_PHONE = ""; // Escribir aquí el número real del propietario (ej: "56912345678"). Si está vacío, abre WhatsApp para seleccionar destinatario.

function getWhatsAppUrl(text) {
  const encoded = encodeURIComponent(text);
  if (CONFIG_WHATSAPP_PHONE && CONFIG_WHATSAPP_PHONE.trim() !== "") {
    return `https://wa.me/${CONFIG_WHATSAPP_PHONE.replace(/\D/g, '')}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHoverVideos();
  initSmartphoneReel();
  initPropertyTabs();
  initVideoModal();
  initPhotoLightbox();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. MENÚ MÓVIL Y NAVEGACIÓN RESPONSIVA
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      openMobileDrawer();
    }
  });

  // Cerrar al hacer clic en cualquier enlace del menú móvil
  drawer.querySelectorAll('.mobile-drawer-link, .btn').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  function openMobileDrawer() {
    toggleBtn.classList.add('is-active');
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    toggleBtn.classList.remove('is-active');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   2. SISTEMA DE REPRODUCCIÓN AUTOMÁTICA AL PASAR EL CURSOR (HOVER TO PLAY)
   ========================================================================== */
function initHoverVideos() {
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const mediaContainer = card.querySelector('.video-card-media');
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    // Hover Desktop: reproducir
    mediaContainer.addEventListener('mouseenter', () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            card.classList.add('is-playing');
          })
          .catch(err => {
            console.log('Autoplay bloqueado o en carga:', err);
          });
      }
    });

    // Hover Desktop: pausar
    mediaContainer.addEventListener('mouseleave', () => {
      video.pause();
      card.classList.remove('is-playing');
    });

    // Clic: Abrir en reproductor modal
    mediaContainer.addEventListener('click', () => {
      const isYoutube = card.getAttribute('data-youtube-id');
      if (isYoutube) {
        openVideoModal(isYoutube, 'Isla Lemuy en 4K Ultra HD', 'Producción Audiovisual Aérea en Alta Definición', true);
        return;
      }
      const videoSrc = video.getAttribute('data-full-src') || video.currentSrc || video.querySelector('source')?.src;
      const title = card.querySelector('.video-card-title')?.textContent || 'Video Aéreo';
      const desc = card.querySelector('.video-card-desc')?.textContent || '';
      openVideoModal(videoSrc, title, desc, false);
    });

    const expandBtn = card.querySelector('.btn-video-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isYoutube = card.getAttribute('data-youtube-id');
        if (isYoutube) {
          openVideoModal(isYoutube, 'Isla Lemuy en 4K Ultra HD', 'Producción Audiovisual Aérea en Alta Definición', true);
          return;
        }
        const videoSrc = video.getAttribute('data-full-src') || video.currentSrc || video.querySelector('source')?.src;
        const title = card.querySelector('.video-card-title')?.textContent || 'Video Aéreo';
        const desc = card.querySelector('.video-card-desc')?.textContent || '';
        openVideoModal(videoSrc, title, desc, false);
      });
    }
  });

  // Soporte táctil en móviles mediante IntersectionObserver
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          entry.target.classList.add('is-playing');
        } else {
          video.pause();
          entry.target.classList.remove('is-playing');
        }
      });
    }, { threshold: 0.65 });

    videoCards.forEach(card => observer.observe(card));
  }
}

/* ==========================================================================
   3. SMARTPHONE REEL SHOWCASE (Formato Celular Vertical)
   ========================================================================== */
function initSmartphoneReel() {
  const reelVideo = document.getElementById('smartphoneReelVideo');
  const audioBtn = document.getElementById('reelAudioToggle');
  const screen = document.querySelector('.smartphone-screen');
  const expandReelBtn = document.getElementById('btnExpandReel');

  if (reelVideo) {
    reelVideo.muted = true;
    reelVideo.playsInline = true;
    reelVideo.play().catch(() => {});

    // Alternar audio al pulsar el botón del celular
    if (audioBtn) {
      audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        reelVideo.muted = !reelVideo.muted;
        if (reelVideo.muted) {
          audioBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
        } else {
          audioBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        }
      });
    }

    // Tocar la pantalla del celular pausa o reanuda
    if (screen) {
      screen.addEventListener('click', () => {
        if (reelVideo.paused) {
          reelVideo.play().catch(() => {});
        } else {
          reelVideo.pause();
        }
      });
    }

    // Expandir en pantalla completa
    if (expandReelBtn) {
      expandReelBtn.addEventListener('click', () => {
        const src = reelVideo.currentSrc || reelVideo.querySelector('source')?.src;
        openVideoModal(src, 'Recorrido en Formato Celular', 'Isla Lemuy • Perspectiva vertical panorámica', false);
      });
    }
  }

  // Botones para ver en YouTube 4K
  document.querySelectorAll('.btn-play-youtube').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const ytId = btn.getAttribute('data-youtube-id') || 'UyUsmi38UsI';
      openVideoModal(ytId, 'Isla Lemuy en 4K Ultra HD (YouTube)', 'Producción Audiovisual Aérea en Alta Definición', true);
    });
  });
}

/* ==========================================================================
   4. REPRODUCTOR CINEMATOGRÁFICO EN MODAL (Video MP4 o YouTube 4K)
   ========================================================================== */
let modalBackdrop, modalVideo, modalIframe, modalTitle, modalDesc;

function initVideoModal() {
  modalBackdrop = document.getElementById('videoModal');
  if (!modalBackdrop) return;

  modalVideo = modalBackdrop.querySelector('.modal-video-element');
  modalIframe = modalBackdrop.querySelector('.modal-iframe-element');
  modalTitle = modalBackdrop.querySelector('#modalVideoTitle');
  modalDesc = modalBackdrop.querySelector('#modalVideoDesc');
  
  // Soporte para todos los botones de cerrar (superior y pie)
  const closeButtons = modalBackdrop.querySelectorAll('.video-modal-close, .btn-modal-close-footer');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeVideoModal);
  });

  // Cerrar al hacer clic en el fondo exterior
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeVideoModal();
    }
  });

  // Cerrar con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeVideoModal();
    }
  });
}

function openVideoModal(src, title, desc, isYoutube = false) {
  if (!modalBackdrop) return;

  const isYtUrl = isYoutube || (typeof src === 'string' && (src.includes('youtube.com') || src.includes('youtu.be') || src === 'UyUsmi38UsI'));

  if (isYtUrl) {
    // Modo YouTube en 4K
    let videoId = src;
    if (typeof src === 'string') {
      if (src.includes('youtu.be/')) {
        videoId = src.split('youtu.be/')[1].split('?')[0];
      } else if (src.includes('watch?v=')) {
        videoId = src.split('watch?v=')[1].split('&')[0];
      }
    }

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.style.display = 'none';
      modalVideo.src = '';
    }
    if (modalIframe) {
      modalIframe.style.display = 'block';
      modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
  } else {
    // Modo Video MP4 local/remoto
    if (modalIframe) {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    if (modalVideo) {
      modalVideo.style.display = 'block';
      modalVideo.src = src;
      modalVideo.muted = false;
      modalVideo.controls = true;
      modalVideo.play().catch(e => console.log('Reproducción requerida por usuario:', e));
    }
  }

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  if (!modalBackdrop) return;

  if (modalIframe) {
    modalIframe.src = '';
    modalIframe.style.display = 'none';
  }
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    modalVideo.style.display = 'block';
  }

  modalBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   5. SELECTOR DIDÁCTICO DE LAS 3 PROPIEDADES (TABS)
   ========================================================================== */
const propertiesData = {
  parcela5000: {
    tag: "Oportunidad Residencial & Retiro",
    location: "Isla Lemuy, Archipiélago de Chiloé (Sector Costero)",
    title: "Parcela de 5.000 m² en Isla Lemuy",
    description: "La dimensión perfecta para construir un refugio de retiro o segunda vivienda austral. Emplazada en una loma suave protegida con vista privilegiada al canal y entorno de bosque nativo. Accesible todo el año con camino de ripio consolidado a pocos minutos de la rampa de transbordadores.",
    videoSrc: "HORIZONTAL/TERRENO.mp4",
    poster: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    specs: [
      { label: "Superficie Total", val: "5.000 m² (0,5 ha)" },
      { label: "Estatus Legal", val: "Rol Propio Individual (SAG / CBR)" },
      { label: "Acceso y Camino", val: "Ripio consolidado todo el año" },
      { label: "Factibilidad Eléctrica", val: "Tendido a orilla de camino" },
      { label: "Agua", val: "Factibilidad APR / Pozo / Vertiente" },
      { label: "Topografía", val: "Loma suave con drenaje natural" }
    ],
    benefits: [
      "Vista despejada al mar interior y amaneceres sobre los canales.",
      "Entorno de bosque nativo con coigües, canelos y arrayanes.",
      "A solo 12 minutos de la rampa del ferry Chonchi - Lemuy.",
      "Trato directo con su dueño, sin comisiones de corretaje."
    ],
    whatsappMsg: "Hola, me interesa la Parcela de 5.000 m2 en Isla Lemuy. Quisiera solicitar más información técnica y coordinar una visita."
  },
  fundo5ha: {
    tag: "Exclusividad & Conservación Familiar",
    location: "Isla Lemuy, Chiloé (Sector Alto Panorámico)",
    title: "Fundo Privado de 5 Hectáreas (50.000 m²)",
    description: "Una extensión de campo excepcional para quienes buscan máxima privacidad, un proyecto familiar o desarrollo ecoturístico boutique. Cuenta con praderas limpias para construcción, un bosque nativo maduro de alta densidad biológica y vertiente natural de agua pura.",
    videoSrc: "https://github.com/iLyCoNs/austral-drones/releases/download/videos/16_9_ISLA_LEMUY.mp4",
    poster: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    specs: [
      { label: "Superficie Total", val: "50.000 m² (5,0 ha)" },
      { label: "Estatus Legal", val: "Títulos saneados y Rol Propio" },
      { label: "Vegetación", val: "Bosque nativo maduro + praderas" },
      { label: "Recursos Hídricos", val: "Vertientes y napas superficiales" },
      { label: "Vistas", val: "Panorámica 360° al archipiélago" },
      { label: "Uso Recomendado", val: "Fundo familiar / Lodge / Eco-refugio" }
    ],
    benefits: [
      "Total aislamiento sonoro y pureza de aire insuperable.",
      "Topografía diversa que permite múltiples puntos de edificación.",
      "Potencial para proyecto de conservación o agroturismo sustentable.",
      "Ubicado en una de las islas más tranquilas y seguras de Chile."
    ],
    whatsappMsg: "Hola, me interesa el Fundo de 5 Hectáreas en Isla Lemuy. Deseo conocer planos, estatus de títulos y coordinar una visita."
  },
  fundo17ha: {
    tag: "Santuario Náutico • 410m de Playa",
    location: "Isla Taucolón, Archipiélago de las Chauques (Quemchi, Chiloé)",
    title: "Fundo Isla Taucolón • 15,93 Hectáreas (410 m de Borde Costero)",
    description: "Excepcional predio virgen de 15,93 hectáreas con aprox. 410 metros lineales de orilla de playa protegida de piedrecilla fina y aguas calmas. Su topografía en forma de suave anfiteatro natural se eleva gradualmente desde la orilla costera hacia la cumbre del cerro, otorgando imponentes vistas panorámicas a los canales interiores e islas vecinas. Cuenta con praderas limpias, bosque nativo maduro, vertientes de agua pura viva y tendido eléctrico en el predio. Una oportunidad patrimonial insustituible para refugio privado, proyecto de conservación o inversión náutica de primer nivel.",
    videoSrc: "HORIZONTAL/FRENTE_PLAYA.mp4",
    poster: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_f360ec",
    hasGallery: true,
    photos: [
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_f360ec",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_f360ec",
        caption: "Vista panorámica frontal de la bahía y canal interior desde la orilla de Isla Taucolón"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_184990",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_184990",
        caption: "410 metros continuos de playa de piedrecilla fina y aguas calmas para desembarque de embarcaciones"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_7016c9",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_7016c9",
        caption: "Borde costero con suave pendiente ascendente hacia el bosque nativo templado"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_a69194",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_a69194",
        caption: "Topografía en anfiteatro natural: vistas despejadas a canales e islas vecinas"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_95bc10",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_95bc10",
        caption: "Áreas despejadas y praderas limpias ideales para construcción sin talar"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_b33c19",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_b33c19",
        caption: "Orilla este con vista al archipiélago de las Chauques y navegación protegida"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_f038a5",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_f038a5",
        caption: "Vista hacia las islas vecinas Mechuque y Añihué (a minutos en embarcación)"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_d2f84e",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_d2f84e",
        caption: "Sendero interior y bosque nativo maduro hasta la cumbre del cerro"
      },
      {
        url: "https://photos.encuentra24.com/t_or_fh_l/f_auto/v1/cl/30/58/56/72/30585672_fd7773",
        thumb: "https://photos.encuentra24.com/t_or_fh_m/f_auto/v1/cl/30/58/56/72/30585672_fd7773",
        caption: "Entorno virgen con vertientes naturales de agua dulce viva en la propiedad"
      }
    ],
    specs: [
      { label: "Superficie Total", val: "15,93 Hectáreas (159.300 m²)" },
      { label: "Frente de Playa", val: "410 m de orilla de piedrecilla fina" },
      { label: "Precio Referencial", val: "UF 8.900 (Trato directo • 0% comisión)" },
      { label: "Estatus Legal", val: "Rol Propio individual y títulos saneados" },
      { label: "Electricidad", val: "Tendido eléctrico pasa por el predio" },
      { label: "Agua Dulce", val: "Múltiples vertientes naturales permanentes" },
      { label: "Conectividad", val: "20 min en lancha rápida desde Tenaún" },
      { label: "Telecomunicaciones", val: "Excelente señal celular 4G" }
    ],
    benefits: [
      "410 metros continuos de playa calma protegida, ideal para fondeo, kayak y veleros.",
      "A solo 20 minutos de navegación en lancha rápida desde Tenaún (Chiloé continental).",
      "Al frente de Isla Puduhuapi (con marina privada, muelle e instalaciones náuticas).",
      "A 10 min de palafitos y gastronomía en Mechuque, y vecina al viñedo de Viña Montes en Añihué.",
      "Pista de aterrizaje para avionetas en la vecina Isla Batachauques (a 4 millas náuticas).",
      "Topografía en anfiteatro con praderas limpias y bosque nativo virgen hasta la cumbre."
    ],
    whatsappMsg: "Hola, me comunico por el Fundo de 15,93 Hectáreas con 410m de playa en Isla Taucolón (Chauques, Chiloé - UF 8.900). Quisiera recibir antecedentes técnicos y coordinar contacto directo con el dueño."
  }
};

let currentGalleryPhotos = [];
let currentGalleryIndex = 0;

function initPropertyTabs() {
  const tabButtons = document.querySelectorAll('.prop-tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const propKey = btn.getAttribute('data-property');
      if (!propKey || !propertiesData[propKey]) return;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderPropertyDetail(propertiesData[propKey]);
    });
  });

  // Vinculación de los pills de selección rápida del Hero
  const heroPills = document.querySelectorAll('.hero-property-pill[data-tab-target]');
  heroPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetIndex = parseInt(pill.getAttribute('data-tab-target'), 10);
      if (!isNaN(targetIndex) && tabButtons[targetIndex]) {
        tabButtons[targetIndex].click();
      }
    });
  });
}

function renderPropertyDetail(data) {
  const container = document.getElementById('propertyDetailBox');
  if (!container) return;

  const visualPane = container.querySelector('.prop-visual-pane');
  
  if (data.hasGallery && data.photos && data.photos.length > 0) {
    currentGalleryPhotos = data.photos;
    currentGalleryIndex = 0;

    visualPane.innerHTML = `
      <div class="prop-gallery-wrapper">
        <div class="prop-gallery-main" id="propGalleryMain" title="Haga clic para ampliar foto en alta resolución">
          <img class="prop-gallery-main-img" id="propGalleryActiveImg" src="${data.photos[0].url}" alt="${data.photos[0].caption}">
          <span class="prop-tag-ribbon">${data.tag}</span>
          <div class="prop-gallery-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span id="propGalleryCounter">1 / ${data.photos.length}</span>
          </div>
          <button type="button" class="prop-gallery-expand-btn" id="propGalleryExpandBtn" aria-label="Ampliar foto" title="Ver en pantalla completa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          </button>
          <button type="button" class="prop-gallery-arrow prev" id="propGalleryPrev" aria-label="Foto anterior">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button type="button" class="prop-gallery-arrow next" id="propGalleryNext" aria-label="Foto siguiente">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div class="prop-gallery-caption-bar">
            <span id="propGalleryCaption">${data.photos[0].caption}</span>
          </div>
        </div>
        <div class="prop-gallery-thumbs-wrap">
          <div class="prop-gallery-thumbs" id="propGalleryThumbs">
            ${data.photos.map((p, idx) => `
              <button type="button" class="prop-gallery-thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Ver foto ${idx + 1}">
                <img src="${p.thumb}" alt="Miniatura ${idx + 1}" loading="lazy">
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setupGalleryListeners();
  } else {
    visualPane.innerHTML = `
      <span class="prop-tag-ribbon">${data.tag}</span>
      <div class="prop-visual-video-wrap">
        <video class="prop-visual-video" autoplay muted loop playsinline poster="${data.poster}">
          <source src="${data.videoSrc}" type="video/mp4">
        </video>
      </div>
    `;
    const v = visualPane.querySelector('video');
    if (v) {
      v.load();
      v.play().catch(() => {});
    }
  }

  container.querySelector('.prop-location-badge span').textContent = data.location;
  container.querySelector('.prop-title').textContent = data.title;
  container.querySelector('.prop-description').textContent = data.description;

  const specsContainer = container.querySelector('.prop-specs-table');
  if (specsContainer) {
    specsContainer.innerHTML = data.specs.map(item => `
      <div class="spec-item">
        <span class="spec-label">${item.label}</span>
        <span class="spec-val">${item.val}</span>
      </div>
    `).join('');
  }

  const benefitsContainer = container.querySelector('.prop-benefits-list');
  if (benefitsContainer) {
    benefitsContainer.innerHTML = data.benefits.map(b => `
      <li>
        <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${b}</span>
      </li>
    `).join('');
  }

  const btnWhatsapp = container.querySelector('.btn-prop-whatsapp');
  if (btnWhatsapp) {
    btnWhatsapp.href = getWhatsAppUrl(data.whatsappMsg);
  }
}

function updateGalleryView(index) {
  if (!currentGalleryPhotos || !currentGalleryPhotos.length) return;
  if (index < 0) index = currentGalleryPhotos.length - 1;
  if (index >= currentGalleryPhotos.length) index = 0;
  currentGalleryIndex = index;

  const img = document.getElementById('propGalleryActiveImg');
  const counter = document.getElementById('propGalleryCounter');
  const caption = document.getElementById('propGalleryCaption');
  const thumbs = document.querySelectorAll('.prop-gallery-thumb-btn');

  if (img) {
    img.src = currentGalleryPhotos[index].url;
    img.alt = currentGalleryPhotos[index].caption;
  }
  if (counter) counter.textContent = `${index + 1} / ${currentGalleryPhotos.length}`;
  if (caption) caption.textContent = currentGalleryPhotos[index].caption;

  thumbs.forEach((t, i) => {
    if (i === index) {
      t.classList.add('active');
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      t.classList.remove('active');
    }
  });
}

function setupGalleryListeners() {
  const prevBtn = document.getElementById('propGalleryPrev');
  const nextBtn = document.getElementById('propGalleryNext');
  const expandBtn = document.getElementById('propGalleryExpandBtn');
  const mainBox = document.getElementById('propGalleryMain');
  const thumbs = document.querySelectorAll('.prop-gallery-thumb-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGalleryView(currentGalleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateGalleryView(currentGalleryIndex + 1);
    });
  }

  if (expandBtn) {
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPhotoLightbox(currentGalleryIndex);
    });
  }

  if (mainBox) {
    mainBox.addEventListener('click', (e) => {
      if (e.target.closest('.prop-gallery-arrow') || e.target.closest('.prop-gallery-expand-btn')) return;
      openPhotoLightbox(currentGalleryIndex);
    });
  }

  thumbs.forEach(t => {
    t.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(t.getAttribute('data-index'), 10);
      updateGalleryView(idx);
    });
  });
}

/* ==========================================================================
   VISOR MODAL LIGHTBOX PARA FOTOS EN ALTA RESOLUCIÓN
   ========================================================================== */
let photoModal, photoModalImg, photoModalCounter, photoModalCaption;

function initPhotoLightbox() {
  photoModal = document.getElementById('photoModal');
  if (!photoModal) return;

  photoModalImg = document.getElementById('photoModalImg');
  photoModalCounter = document.getElementById('photoModalCounter');
  photoModalCaption = document.getElementById('photoModalCaption');

  const closeBtn = document.getElementById('closePhotoModal');
  const prevBtn = document.getElementById('photoModalPrev');
  const nextBtn = document.getElementById('photoModalNext');

  if (closeBtn) closeBtn.addEventListener('click', closePhotoLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigatePhotoLightbox(currentGalleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigatePhotoLightbox(currentGalleryIndex + 1);
    });
  }

  photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
      closePhotoLightbox();
    }
  });

  document.querySelectorAll('.taucolon-photo-card').forEach(card => {
    card.addEventListener('click', () => {
      currentGalleryPhotos = propertiesData.fundo17ha.photos;
      const index = parseInt(card.getAttribute('data-gallery-index'), 10) || 0;
      openPhotoLightbox(index);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('active')) return;
    if (e.key === 'Escape') closePhotoLightbox();
    if (e.key === 'ArrowLeft') navigatePhotoLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') navigatePhotoLightbox(currentGalleryIndex + 1);
  });
}

function openPhotoLightbox(index = 0) {
  if (!photoModal || !currentGalleryPhotos.length) return;
  navigatePhotoLightbox(index);
  photoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function navigatePhotoLightbox(index) {
  if (!currentGalleryPhotos || !currentGalleryPhotos.length) return;
  if (index < 0) index = currentGalleryPhotos.length - 1;
  if (index >= currentGalleryPhotos.length) index = 0;
  currentGalleryIndex = index;

  if (photoModalImg) {
    photoModalImg.src = currentGalleryPhotos[index].url;
    photoModalImg.alt = currentGalleryPhotos[index].caption;
  }
  if (photoModalCounter) {
    photoModalCounter.textContent = `${index + 1} / ${currentGalleryPhotos.length}`;
  }
  if (photoModalCaption) {
    photoModalCaption.textContent = currentGalleryPhotos[index].caption;
  }

  updateGalleryView(index);
}

function closePhotoLightbox() {
  if (!photoModal) return;
  photoModal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   6. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. FORMULARIO DE CONTACTO CON ENVÍO DIRECTO A WHATSAPP
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('directContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#userName').value.trim();
    const phone = form.querySelector('#userPhone').value.trim();
    const property = form.querySelector('#userProperty').value;
    const message = form.querySelector('#userMessage').value.trim();

    const formattedMessage = `*Consulta Web - Refugios Chiloé*\n\n` +
      `*Nombre:* ${name}\n` +
      `*Teléfono:* ${phone}\n` +
      `*Propiedad de interés:* ${property}\n` +
      `*Mensaje:* ${message || 'Solicito coordinar una llamada o visita a terreno.'}`;

    const whatsappUrl = getWhatsAppUrl(formattedMessage);
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   8. NAVEGACIÓN Y SCROLL SUAVE
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 64;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
