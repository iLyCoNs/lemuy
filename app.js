/**
 * SANTUARIO LEMUY & CHILOÉ - INTERACTIVE CONTROLLER
 * Especialmente diseñado para la reproducción interactiva en hover,
 * visualizador de propiedades, modal cinematográfico y conexión directa WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHoverVideos();
  initPropertyTabs();
  initVideoModal();
  initFaqAccordion();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   1. SISTEMA DE REPRODUCCIÓN AUTOMÁTICA AL PASAR EL CURSOR (HOVER TO PLAY)
   ========================================================================== */
function initHoverVideos() {
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const mediaContainer = card.querySelector('.video-card-media');
    if (!video) return;

    // Asegurar que el video esté silenciado por política de autoplay de navegadores
    video.muted = true;
    video.playsInline = true;

    // 1. Hover en Desktop: Reproducir al entrar el cursor
    mediaContainer.addEventListener('mouseenter', () => {
      // Manejar la promesa de reproducción para evitar advertencias en consola
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

    // 2. Hover en Desktop: Pausar al salir el cursor
    mediaContainer.addEventListener('mouseleave', () => {
      video.pause();
      card.classList.remove('is-playing');
    });

    // 3. Clic: Abrir el video en el reproductor completo (Modal con audio)
    mediaContainer.addEventListener('click', (e) => {
      const videoSrc = video.getAttribute('data-full-src') || video.currentSrc || video.querySelector('source')?.src;
      const title = card.querySelector('.video-card-title')?.textContent || 'Video Aéreo';
      const desc = card.querySelector('.video-card-desc')?.textContent || '';
      openVideoModal(videoSrc, title, desc);
    });

    const expandBtn = card.querySelector('.btn-video-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const videoSrc = video.getAttribute('data-full-src') || video.currentSrc || video.querySelector('source')?.src;
        const title = card.querySelector('.video-card-title')?.textContent || 'Video Aéreo';
        const desc = card.querySelector('.video-card-desc')?.textContent || '';
        openVideoModal(videoSrc, title, desc);
      });
    }
  });

  // Soporte móvil: Si la pantalla es táctil, usar IntersectionObserver para reproducción suave en viewport
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
   2. REPRODUCTOR CINEMATOGRÁFICO EN MODAL (PANTALLA COMPLETA CON AUDIO)
   ========================================================================== */
let modalBackdrop, modalVideo, modalTitle, modalDesc, modalCloseBtn;

function initVideoModal() {
  modalBackdrop = document.getElementById('videoModal');
  if (!modalBackdrop) return;

  modalVideo = modalBackdrop.querySelector('.modal-video-element');
  modalTitle = modalBackdrop.querySelector('#modalVideoTitle');
  modalDesc = modalBackdrop.querySelector('#modalVideoDesc');
  modalCloseBtn = modalBackdrop.querySelector('.video-modal-close');

  modalCloseBtn.addEventListener('click', closeVideoModal);

  // Cerrar al hacer clic en el fondo oscuro exterior
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

function openVideoModal(src, title, desc) {
  if (!modalBackdrop || !modalVideo) return;

  modalVideo.src = src;
  modalVideo.muted = false; // Permitir audio en vista completa
  modalVideo.controls = true;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo

  modalVideo.play().catch(e => console.log('Reproducción asistida requerida:', e));
}

function closeVideoModal() {
  if (!modalBackdrop || !modalVideo) return;

  modalVideo.pause();
  modalVideo.currentTime = 0;
  modalVideo.src = '';
  modalBackdrop.classList.remove('active');
  document.body.style.overflow = ''; // Restaurar scroll
}

/* ==========================================================================
   3. SELECTOR DIDÁCTICO DE LAS 3 PROPIEDADES (TABS)
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
    tag: "Santuario Patrimonial de Gran Escala",
    location: "Isla del Archipiélago de Chiloé (Frente Costero)",
    title: "Gran Fundo Costero de ~17 Hectáreas (170.000 m²)",
    description: "Una joya territorial de características escasas en el sur de Chile. Gran extensión de 17 hectáreas con frente marítimo, bahías tranquilas protegidas del oleaje y lomajes vírgenes. Un legado patrimonial de clase mundial para inversión o reserva natural privada.",
    videoSrc: "HORIZONTAL/FRENTE_PLAYA.mp4",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    specs: [
      { label: "Superficie Total", val: "Aprox. 170.000 m² (17 ha)" },
      { label: "Estatus Legal", val: "Rol Propio e inscripción al día" },
      { label: "Frente Costero", val: "Acceso a playa y orilla de mar" },
      { label: "Acceso Marítimo", val: "Caleta natural protegida para bote/lancha" },
      { label: "Naturaleza", val: "Flora costera austral, avifauna marina" },
      { label: "Potencial", val: "Reserva privada / Marina / Santuario" }
    ],
    benefits: [
      "Propiedad de escala irrepetible con borde de mar virgen.",
      "Máxima plusvalía y resguardo de capital en tierras australes.",
      "Ideal para quienes valoran la navegación y la privacidad total.",
      "Documentación legal completa lista para firma en Notaría."
    ],
    whatsappMsg: "Hola, me comunico por el Fundo de 17 Hectáreas con borde costero en Chiloé. Quisiera recibir la carpeta de títulos y agendar una llamada."
  }
};

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
}

function renderPropertyDetail(data) {
  const container = document.getElementById('propertyDetailBox');
  if (!container) return;

  // Video y Visual
  const visualPane = container.querySelector('.prop-visual-pane');
  const video = visualPane.querySelector('video');
  const ribbon = visualPane.querySelector('.prop-tag-ribbon');

  if (ribbon) ribbon.textContent = data.tag;
  if (video) {
    video.src = data.videoSrc;
    video.poster = data.poster;
    video.load();
    video.play().catch(() => {});
  }

  // Textos
  container.querySelector('.prop-location-badge span').textContent = data.location;
  container.querySelector('.prop-title').textContent = data.title;
  container.querySelector('.prop-description').textContent = data.description;

  // Tabla de especificaciones técnicas
  const specsContainer = container.querySelector('.prop-specs-table');
  if (specsContainer) {
    specsContainer.innerHTML = data.specs.map(item => `
      <div class="spec-item">
        <span class="spec-label">${item.label}</span>
        <span class="spec-val">${item.val}</span>
      </div>
    `).join('');
  }

  // Lista de ventajas
  const benefitsContainer = container.querySelector('.prop-benefits-list');
  if (benefitsContainer) {
    benefitsContainer.innerHTML = data.benefits.map(b => `
      <li>
        <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${b}</span>
      </li>
    `).join('');
  }

  // Botón directo a WhatsApp
  const btnWhatsapp = container.querySelector('.btn-prop-whatsapp');
  if (btnWhatsapp) {
    const encoded = encodeURIComponent(data.whatsappMsg);
    btnWhatsapp.href = `https://wa.me/56976228383?text=${encoded}`;
  }
}

/* ==========================================================================
   4. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
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
   5. FORMULARIO DE CONTACTO CON ENVÍO DIRECTO A WHATSAPP
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

    const whatsappUrl = `https://wa.me/56976228383?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   6. NAVEGACIÓN Y SCROLL SUAVE
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
