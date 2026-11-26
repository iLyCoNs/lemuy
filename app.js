/**
 * REMANSO NATURAL - INTERACTIVE CONTROLLER
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
  initVideoDualSuite();
  initOwnerGalleryMarquee();
  initPhotoLightbox();
  initFaqAccordion();
  initContactForm();
  initPropertyDirectContactForm();
  initLiveWeather();
  initHeaderScrollProgress();
  initMaster3DCards();
  initPortfolioExplorer();
  initScrollReveal();
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
   4. REPRODUCTOR CINEMATOGRÁFICO EN MODAL + LIBERACIÓN DE DECODIFICADORES MÓVILES
   ========================================================================== */
let modalBackdrop, modalVideo, modalIframe, modalTitle, modalDesc, modalLoader;
let suspendedBackgroundVideos = [];
let restoreVideosTimer = null;
let dualSuiteObserver = null;
const IS_MOBILE_VIDEO_ENV = () =>
  window.matchMedia('(max-width: 991px), (pointer: coarse)').matches;

function initVideoModal() {
  modalBackdrop = document.getElementById('videoModal');
  if (!modalBackdrop) return;

  modalVideo = modalBackdrop.querySelector('.modal-video-element');
  modalIframe = modalBackdrop.querySelector('.modal-iframe-element');
  modalTitle = modalBackdrop.querySelector('#modalVideoTitle');
  modalDesc = modalBackdrop.querySelector('#modalVideoDesc');

  // Asegurar atributos iOS/Android inline y crear indicador sutil de carga
  const mediaWrap = modalBackdrop.querySelector('.video-modal-media-wrap');
  if (modalVideo) {
    modalVideo.setAttribute('playsinline', '');
    modalVideo.setAttribute('webkit-playsinline', '');
    modalVideo.preload = 'auto';

    if (mediaWrap && !mediaWrap.querySelector('.modal-video-loader')) {
      modalLoader = document.createElement('div');
      modalLoader.className = 'modal-video-loader';
      modalLoader.setAttribute('aria-hidden', 'true');
      modalLoader.innerHTML = '<span class="modal-loader-spinner"></span><span>Cargando video...</span>';
      mediaWrap.appendChild(modalLoader);
    } else if (mediaWrap) {
      modalLoader = mediaWrap.querySelector('.modal-video-loader');
    }

    const hideLoader = () => {
      if (modalLoader) modalLoader.classList.remove('is-visible');
    };
    const showLoader = () => {
      if (modalLoader && modalBackdrop.classList.contains('active') && modalVideo.style.display !== 'none') {
        modalLoader.classList.add('is-visible');
      }
    };

    modalVideo.addEventListener('loadstart', showLoader);
    modalVideo.addEventListener('waiting', showLoader);
    modalVideo.addEventListener('canplay', hideLoader);
    modalVideo.addEventListener('playing', hideLoader);
    modalVideo.addEventListener('error', hideLoader);
  }

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

function pauseInlineCinemaCards(exceptCard = null) {
  document.querySelectorAll('.video-card-cinema.is-playing, .video-card-reel.is-playing').forEach((card) => {
    if (exceptCard && card === exceptCard) return;
    card.classList.remove('is-playing');
    const vid = card.querySelector('.cinema-inline-video, .reel-inline-video');
    if (vid) {
      vid.pause();
      vid.removeAttribute('src');
      vid.load();
    }
    card.querySelector('.cinema-audio-unmute-pill')?.remove();
  });
}

function suspendBackgroundVideos() {
  if (restoreVideosTimer) {
    clearTimeout(restoreVideosTimer);
    restoreVideosTimer = null;
  }

  // Evita sobrescribir snapshots si ya hay una suspensión activa
  if (suspendedBackgroundVideos.length > 0) return;

  const allVideos = Array.from(document.querySelectorAll('video')).filter(v => {
    if (v === modalVideo) return false;
    // Ignorar videos inline inactivos que aún no tienen fuente cargada
    return Boolean(v.getAttribute('src') || v.querySelector('source[src]'));
  });
  suspendedBackgroundVideos = allVideos.map((v) => {
    const childSources = Array.from(v.querySelectorAll('source')).map(s => ({
      el: s,
      src: s.getAttribute('src')
    }));
    const directSrc = v.getAttribute('src');
    const wasPlaying = !v.paused && !v.ended && v.readyState > 0;
    const savedTime = Number.isFinite(v.currentTime) ? v.currentTime : 0;

    // Pausar y liberar explícitamente el decodificador de hardware y la descarga en curso
    try {
      v.pause();
      if (directSrc) v.removeAttribute('src');
      childSources.forEach(item => {
        if (item.src) item.el.removeAttribute('src');
      });
      v.load();
    } catch (err) {
      console.warn('Remanso Natural: No se pudo suspender un video de fondo:', err);
    }

    return {
      video: v,
      directSrc,
      childSources,
      wasPlaying,
      savedTime
    };
  });
}

function restoreBackgroundVideos() {
  if (!suspendedBackgroundVideos.length) return;
  const items = suspendedBackgroundVideos.slice();
  suspendedBackgroundVideos = [];
  const isMobile = IS_MOBILE_VIDEO_ENV();
  let resumedOneMobileLoop = false;

  items.forEach(({ video, directSrc, childSources, wasPlaying, savedTime }) => {
    if (!video || !video.isConnected) return;

    try {
      if (directSrc) video.setAttribute('src', directSrc);
      childSources.forEach(({ el, src }) => {
        if (src) el.setAttribute('src', src);
      });
      video.load();

      if (savedTime > 0) {
        const onMeta = () => {
          try {
            if (Number.isFinite(video.duration) && savedTime < video.duration) {
              video.currentTime = savedTime;
            }
          } catch (_) {}
        };
        video.addEventListener('loadedmetadata', onMeta, { once: true });
      }

      const rect = video.getBoundingClientRect();
      const inViewport = rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
      let shouldResume = wasPlaying;

      if (isMobile) {
        if (!inViewport) {
          shouldResume = false;
        } else if (video.classList.contains('loop-video')) {
          if (!resumedOneMobileLoop && (wasPlaying || rect.top < window.innerHeight * 0.75)) {
            resumedOneMobileLoop = true;
            shouldResume = true;
          } else {
            shouldResume = false;
          }
        } else if (video.classList.contains('hero-video-bg')) {
          shouldResume = inViewport;
        }
      }

      if (shouldResume) {
        video.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Remanso Natural: No se pudo restaurar un video de fondo:', err);
    }
  });
}

function openVideoModal(src, title, desc, isYoutube = false, isReel = false) {
  if (!modalBackdrop) return;

  pauseInlineCinemaCards();

  // 1. Liberar decodificadores de hardware y descargas en segundo plano ANTES de iniciar el modal
  suspendBackgroundVideos();

  const modalBox = modalBackdrop.querySelector('.video-modal-box');
  const isVertical = isReel || (typeof src === 'string' && src.toLowerCase().includes('reel'));

  if (modalBox) {
    modalBox.classList.toggle('aspect-9-16', isVertical);
  }

  const isYtUrl = isYoutube || (typeof src === 'string' && (src.includes('youtube.com') || src.includes('youtu.be') || src === 'UyUsmi38UsI'));

  document.body.classList.add('video-modal-active');
  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (isYtUrl) {
    let videoId = src;
    if (typeof src === 'string') {
      if (src.includes('youtu.be/')) {
        videoId = src.split('youtu.be/')[1].split('?')[0];
      } else if (src.includes('watch?v=')) {
        videoId = src.split('watch?v=')[1].split('&')[0];
      }
    }

    if (modalLoader) modalLoader.classList.remove('is-visible');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalVideo.load();
      modalVideo.style.display = 'none';
    }
    if (modalIframe) {
      modalIframe.style.display = 'block';
      modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
  } else {
    if (modalIframe) {
      modalIframe.removeAttribute('src');
      modalIframe.style.display = 'none';
    }
    if (modalVideo) {
      modalVideo.style.display = 'block';
      modalVideo.muted = false;
      modalVideo.controls = true;
      modalVideo.preload = 'auto';
      modalVideo.src = src;
      modalVideo.load();
      if (modalLoader) modalLoader.classList.add('is-visible');
      modalVideo.play().catch(() => {
        // Respaldo: si el navegador bloquea autoplay con audio, reproducir silenciado para que no quede detenido
        modalVideo.muted = true;
        modalVideo.play().catch(() => {
          if (modalLoader) modalLoader.classList.remove('is-visible');
        });
      });
    }
  }

  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;
}

function closeVideoModal() {
  if (!modalBackdrop) return;

  const modalBox = modalBackdrop.querySelector('.video-modal-box');
  if (modalBox) {
    modalBox.classList.remove('aspect-9-16');
  }
  if (modalLoader) modalLoader.classList.remove('is-visible');

  if (modalIframe) {
    modalIframe.removeAttribute('src');
    modalIframe.style.display = 'none';
  }
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
    modalVideo.style.display = 'block';
  }

  modalBackdrop.classList.remove('active');
  document.body.classList.remove('video-modal-active');
  document.body.style.overflow = '';

  // Esperar un ciclo breve para asegurar liberación completa del decodificador antes de restaurar fondo
  restoreVideosTimer = setTimeout(() => {
    restoreVideosTimer = null;
    restoreBackgroundVideos();
  }, 140);
}

/* ==========================================================================
   ESTUDIO AUDIOVISUAL DUAL: SELECTOR DE FORMATO & MODO TEATRO IN-PAGE
   ========================================================================== */
function initVideoDualSuite() {
  const loopVideos = Array.from(document.querySelectorAll('.video-dual-stage .loop-video'));
  const heroVideo = document.querySelector('.hero-video-bg');

  // Sincroniza qué previsualizaciones deben reproducirse según visibilidad y modo activo
  function syncDualStagePlayback(stage) {
    if (!stage || document.body.classList.contains('video-modal-active')) return;
    const isMobile = IS_MOBILE_VIDEO_ENV();
    const videos = Array.from(stage.querySelectorAll('.loop-video'));

    videos.forEach((v) => {
      const card = v.closest('.video-card-cinema, .video-card-reel');
      const isHiddenByFilter = !card || getComputedStyle(card).display === 'none';

      if (isHiddenByFilter) {
        if (!v.paused) v.pause();
        return;
      }

      if (!isMobile) {
        v.muted = true;
        v.playsInline = true;
        v.play().catch(() => {});
      }
    });
  }

  // Reproducción directa in-card al presionar Play en tarjetas horizontales y verticales (Reels)
  function startInlineCinemaCard(wrap) {
    const card = wrap.closest('.video-card-cinema, .video-card-reel');
    const vid = wrap.querySelector('.cinema-inline-video, .reel-inline-video');
    const videoSrc = wrap.getAttribute('data-video-src');
    if (!card || !vid || !videoSrc) return;

    pauseInlineCinemaCards(card);
    card.querySelector('.cinema-media-error-pill')?.remove();
    card.querySelector('.cinema-audio-unmute-pill')?.remove();

    if (vid.getAttribute('src') !== videoSrc) {
      vid.src = videoSrc;
    }
    vid.controls = true;
    vid.playsInline = true;
    vid.setAttribute('playsinline', '');
    vid.muted = false;

    const handleErr = () => {
      card.classList.remove('is-playing');
      vid.removeAttribute('src');
      vid.load();
      if (!wrap.querySelector('.cinema-media-error-pill')) {
        const msg = document.createElement('div');
        msg.className = 'cinema-media-error-pill';
        msg.textContent = 'Video disponible solo en servidor remoto o no encontrado';
        wrap.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
      }
    };
    vid.addEventListener('error', handleErr, { once: true });

    card.classList.add('is-playing');
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        if (!card.classList.contains('is-playing')) return;
        vid.muted = true;
        vid.play().then(() => {
          if (!wrap.querySelector('.cinema-audio-unmute-pill')) {
            const unmuteBtn = document.createElement('button');
            unmuteBtn.type = 'button';
            unmuteBtn.className = 'cinema-audio-unmute-pill';
            unmuteBtn.textContent = 'Activar audio';
            unmuteBtn.addEventListener('click', (ev) => {
              ev.stopPropagation();
              vid.muted = false;
              unmuteBtn.remove();
            });
            wrap.appendChild(unmuteBtn);
          }
        }).catch(() => {});
      });
    }
  }

  document.querySelectorAll('.cinema-screen-wrap[data-inline-video], .smartphone-screen-wrap[data-inline-video]').forEach(wrap => {
    wrap.addEventListener('click', (e) => {
      const card = wrap.closest('.video-card-cinema, .video-card-reel');
      if (card && card.classList.contains('is-playing')) return;
      if (e.target.closest('[data-open-inpage-video]') || e.target.closest('.cinema-audio-unmute-pill')) return;
      e.preventDefault();
      e.stopPropagation();
      startInlineCinemaCard(wrap);
    });
  });

  // Selector de Formato (16:9, 9:16 o Vista Dual Simultánea)
  const toolbars = document.querySelectorAll('.video-format-toolbar');
  toolbars.forEach(toolbar => {
    const buttons = toolbar.querySelectorAll('.video-format-btn');
    const section = toolbar.closest('section');
    const stage = section?.querySelector('.video-dual-stage');
    if (!stage) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const format = btn.getAttribute('data-format');

        stage.classList.remove('view-cinema-only', 'view-reel-only');
        section?.classList.remove('view-cinema-only', 'view-reel-only');
        if (format === '16-9') {
          stage.classList.add('view-cinema-only');
          section?.classList.add('view-cinema-only');
        } else if (format === '9-16') {
          stage.classList.add('view-reel-only');
          section?.classList.add('view-reel-only');
          pauseInlineCinemaCards();
        }
        syncDualStagePlayback(stage);
      });
    });

    syncDualStagePlayback(stage);
  });

  // En dispositivos móviles o táctiles: como máximo 1 video preview activo visible a la vez
  if ('IntersectionObserver' in window && (loopVideos.length || heroVideo)) {
    const visibleLoopVideos = new Set();
    dualSuiteObserver = new IntersectionObserver((entries) => {
      if (document.body.classList.contains('video-modal-active')) return;

      entries.forEach((entry) => {
        const video = entry.target;
        const isLoop = video.classList.contains('loop-video');

        if (isLoop) {
          const card = video.closest('.video-card-cinema, .video-card-reel');
          const visibleOnScreen = entry.isIntersecting && card && getComputedStyle(card).display !== 'none';
          if (visibleOnScreen) {
            visibleLoopVideos.add(video);
          } else {
            visibleLoopVideos.delete(video);
            if (!video.paused) video.pause();
          }
        } else {
          // Video de fondo del Hero: pausar al salir de pantalla para ahorrar recursos en móvil
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else if (IS_MOBILE_VIDEO_ENV() && !video.paused) {
            video.pause();
          }
        }
      });

      if (IS_MOBILE_VIDEO_ENV() && loopVideos.length) {
        // Reproducir únicamente la primera previsualización visible para no saturar decodificadores
        let playedOne = false;
        loopVideos.forEach((v) => {
          if (!playedOne && visibleLoopVideos.has(v)) {
            playedOne = true;
            v.muted = true;
            v.playsInline = true;
            v.play().catch(() => {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      }
    }, { threshold: 0.4 });

    loopVideos.forEach(v => dualSuiteObserver.observe(v));
    if (heroVideo) dualSuiteObserver.observe(heroVideo);
  }

  // Botones de Apertura In-Page (Modo Cine y Modo Reel sin nuevas ventanas)
  document.querySelectorAll('[data-open-inpage-video]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const videoSrc = btn.getAttribute('data-video-src');
      const videoTitle = btn.getAttribute('data-video-title') || 'Registro Aéreo 4K';
      const videoDesc = btn.getAttribute('data-video-desc') || 'Perspectiva aérea in situ de la propiedad.';
      const isReel = btn.getAttribute('data-is-reel') === 'true';
      if (videoSrc) {
        openVideoModal(videoSrc, videoTitle, videoDesc, false, isReel);
      }
    });
  });

  // Botones de Silenciar/Activar Audio In-Card
  document.querySelectorAll('.video-mute-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.video-card-cinema') || btn.closest('.video-card-reel') || btn.closest('.media-box-16-9');
      const vid = card?.querySelector('video');
      if (vid) {
        vid.muted = !vid.muted;
        btn.innerHTML = vid.muted
          ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/></svg> Audio desactivado`
          : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Audio activo`;
      }
    });
  });
}

/* ==========================================================================
   5. SELECTOR DIDÁCTICO DE LAS 3 PROPIEDADES (TABS)
   ========================================================================== */
const propertiesData = {
  parcela5000: {
    tag: "Cabaña & Vertiente",
    location: "Isla Lemuy • Cordillera & Mar",
    title: "Parcela de 5.200 m² en Isla Lemuy",
    description: "5.200 m² con cabaña renovada, vertiente mayor de agua natural, bosque nativo y vista despejada al mar interior y la cordillera nevada. Camino asfaltado hasta 100 m de la cabaña.",
    videoSrc: "https://github.com/iLyCoNs/lemuy/releases/download/videos/LEMUY_PROPIEDAD.mp4",
    poster: "images/posters/parcela_16_9.jpg",
    hasGallery: true,
    photos: [
      {
        url: "images/parcela5200/01_vista_aerea_parcela_bahia.jpg",
        thumb: "images/parcela5200/01_vista_aerea_parcela_bahia.jpg",
        caption: "1. Vista elevada de la parcela hacia el mar interior e islas"
      },
      {
        url: "images/parcela5200/02_cabana_living_panoramico.jpg",
        thumb: "images/parcela5200/02_cabana_living_panoramico.jpg",
        caption: "2. Cabaña renovada: living luminoso con vista frontal al mar"
      },
      {
        url: "images/parcela5200/03_cabana_estufa_sala.jpg",
        thumb: "images/parcela5200/03_cabana_estufa_sala.jpg",
        caption: "3. Sala de estar con combustión lenta a leña y madera blanca"
      },
      {
        url: "images/parcela5200/04_cabana_acceso_mar.jpg",
        thumb: "images/parcela5200/04_cabana_acceso_mar.jpg",
        caption: "4. Acceso acristalado de la cabaña con vista abierta al canal"
      },
      {
        url: "images/parcela5200/05_cabana_cocina_comedor.jpg",
        thumb: "images/parcela5200/05_cabana_cocina_comedor.jpg",
        caption: "5. Cocina y comedor integrado mirando al mar interior"
      },
      {
        url: "images/parcela5200/06_cabana_bano_renovado.jpg",
        thumb: "images/parcela5200/06_cabana_bano_renovado.jpg",
        caption: "6. Baño completo renovado con cabina de ducha"
      },
      {
        url: "images/parcela5200/07_ventana_bahia_barcos.jpg",
        thumb: "images/parcela5200/07_ventana_bahia_barcos.jpg",
        caption: "7. Despertar mirando barcos y la cordillera desde la ventana"
      },
      {
        url: "images/parcela5200/08_jardin_arcoiris_mar.jpg",
        thumb: "images/parcela5200/08_jardin_arcoiris_mar.jpg",
        caption: "8. Jardín frontal con arcoíris sobre la bahía de Lemuy"
      },
      {
        url: "images/parcela5200/09_pradera_arboles_nativos.jpg",
        thumb: "images/parcela5200/09_pradera_arboles_nativos.jpg",
        caption: "9. Pradera verde con arboleda y lomajes del terreno"
      },
      {
        url: "images/parcela5200/10_bodega_kayaks_botes.jpg",
        thumb: "images/parcela5200/10_bodega_kayaks_botes.jpg",
        caption: "10. Bodega equipada ideal para kayaks y equipo náutico"
      },
      {
        url: "images/parcela5200/11_cordillera_nevada_skorpios.jpg",
        thumb: "images/parcela5200/11_cordillera_nevada_skorpios.jpg",
        caption: "11. Vista despejada a cumbres nevadas sobre el mar interior"
      },
      {
        url: "images/parcela5200/12_doble_volcan_veleros.jpg",
        thumb: "images/parcela5200/12_doble_volcan_veleros.jpg",
        caption: "12. Cordillera nevada, volcanes y veleros en el horizonte"
      },
      {
        url: "images/parcela5200/13_velero_cordillera_nevada.jpg",
        thumb: "images/parcela5200/13_velero_cordillera_nevada.jpg",
        caption: "13. Navegación a vela frente a la cordillera nevada"
      }
    ],
    specs: [
      { label: "Superficie", val: "5.200 m² (0,52 ha)" },
      { label: "Edificación", val: "Cabaña Renovada" },
      { label: "Agua Natural", val: "Vertiente Mayor Viabilizada" },
      { label: "Acceso", val: "Asfalto hasta 100 m" }
    ],
    benefits: [
      "Vista despejada al mar interior de Chiloé y a la cordillera nevada.",
      "Cabaña renovada y camino asfaltado hasta solo 100 m del acceso.",
      "Gestión directa y confidencial con el propietario."
    ],
    whatsappMsg: "Hola, me interesa la Parcela de 5.200 m2 en Isla Lemuy. Quisiera solicitar más información técnica y coordinar una visita."
  },
  fundo5ha: {
    tag: "Casa + 2 Bodegas • APR",
    location: "Isla Lemuy • Sector Panorámico",
    title: "Parcela de 5 Hectáreas (50.000 m²)",
    description: "Parcela de 50.000 m² con casa habitación, 2 bodegas, Agua Potable Rural (APR) operativa, vertiente natural (sin viabilizar), praderas limpias y bosque nativo silvestre.",
    videoSrc: "https://github.com/iLyCoNs/austral-drones/releases/download/videos/16_9_ISLA_LEMUY.mp4",
    poster: "images/posters/fundo5ha_16_9.jpg",
    hasGallery: true,
    photos: [
      {
        url: "images/fundo5ha/01_casa_principal_loma.jpg",
        thumb: "images/fundo5ha/01_casa_principal_loma.jpg",
        caption: "1. Casa principal sobre la loma con corredor y vista panorámica"
      },
      {
        url: "images/fundo5ha/02_casa_bodega_mar_volcanes.jpg",
        thumb: "images/fundo5ha/02_casa_bodega_mar_volcanes.jpg",
        caption: "2. Casa y bodega frente al mar interior y volcanes nevados"
      },
      {
        url: "images/fundo5ha/03_bodega_praderas_ovejas.jpg",
        thumb: "images/fundo5ha/03_bodega_praderas_ovejas.jpg",
        caption: "3. Bodega techada entre praderas limpias con vista al canal"
      },
      {
        url: "images/fundo5ha/04_vista_aerea_playa_bosque.jpg",
        thumb: "images/fundo5ha/04_vista_aerea_playa_bosque.jpg",
        caption: "4. Vista aérea del borde costero y bosque nativo"
      },
      {
        url: "images/fundo5ha/05_volcanes_nevados_mar.jpg",
        thumb: "images/fundo5ha/05_volcanes_nevados_mar.jpg",
        caption: "5. Volcanes nevados y cordillera frente al predio"
      },
      {
        url: "images/fundo5ha/06_borde_costero_atardecer.jpg",
        thumb: "images/fundo5ha/06_borde_costero_atardecer.jpg",
        caption: "6. Orilla serena con vista a islas al atardecer"
      },
      {
        url: "images/fundo5ha/07_playa_piedrecilla_costa.jpg",
        thumb: "images/fundo5ha/07_playa_piedrecilla_costa.jpg",
        caption: "7. Amplia playa de piedrecilla fina y bosque costero"
      },
      {
        url: "images/fundo5ha/08_bosque_nalcas_orilla.jpg",
        thumb: "images/fundo5ha/08_bosque_nalcas_orilla.jpg",
        caption: "8. Nalcas gigantes, chilcos en flor y bosque en la orilla"
      },
      {
        url: "images/fundo5ha/09_sendero_tranquera_mar.jpg",
        thumb: "images/fundo5ha/09_sendero_tranquera_mar.jpg",
        caption: "9. Sendero sombreado bajo árboles hacia el borde marino"
      },
      {
        url: "images/fundo5ha/10_porton_salida_playa.jpg",
        thumb: "images/fundo5ha/10_porton_salida_playa.jpg",
        caption: "10. Tranquera rural y nalcas abriendo directo a la costa"
      },
      {
        url: "images/fundo5ha/11_arrayanes_nativos_playa.jpg",
        thumb: "images/fundo5ha/11_arrayanes_nativos_playa.jpg",
        caption: "11. Arrayanes centenarios frente al canal interior"
      },
      {
        url: "images/fundo5ha/12_pradera_arboleda_luz.jpg",
        thumb: "images/fundo5ha/12_pradera_arboleda_luz.jpg",
        caption: "12. Arboleda frutal y bosque con luz de mañana"
      }
    ],
    specs: [
      { label: "Superficie", val: "50.000 m² (5,0 ha)" },
      { label: "Infraestructura", val: "Casa + 2 Bodegas" },
      { label: "Agua", val: "APR Activo (Vertiente s/viabilizar)" },
      { label: "Estatus Legal", val: "Rol Propio y Títulos al Día" }
    ],
    benefits: [
      "Casa habitación y 2 bodegas instaladas sobre praderas limpias.",
      "Red de Agua Potable Rural (APR) en servicio y vertiente natural por habilitar.",
      "Atención privada y coordinación directa sin intermediarios."
    ],
    whatsappMsg: "Hola, me interesa la Parcela de 5 Hectáreas en Isla Lemuy. Deseo conocer planos, estatus de títulos y coordinar una visita."
  },
  fundo17ha: {
    tag: "Borde Costero • UF 8.900",
    location: "Isla Taucolón • Archipiélago de Chauques",
    title: "Parcela Costera 15,93 Has (410m de Playa)",
    description: "Parcela silvestre con 410 metros de playa protegida de piedrecilla y anfiteatro natural con vistas a los canales. Cuenta con vertientes de agua pura y tendido eléctrico.",
    videoSrc: "https://github.com/iLyCoNs/lemuy/releases/download/videos/video.taucolon.mp4",
    poster: "images/posters/taucolon_clip_03.jpg",
    hasGallery: true,
    photos: [
      {
        url: "images/taucolon/01_bahia_playa.jpg",
        thumb: "images/taucolon/01_bahia_playa.jpg",
        caption: "1. Vista frontal de la bahía y canal interior"
      },
      {
        url: "images/taucolon/10_archipielago_chauques_altura.jpg",
        thumb: "images/taucolon/10_archipielago_chauques_altura.jpg",
        caption: "2. Islas de las Chauques y canales desde la altura"
      },
      {
        url: "images/taucolon/02_orilla_410m.jpg",
        thumb: "images/taucolon/02_orilla_410m.jpg",
        caption: "3. 410 metros continuos de playa de piedrecilla fina"
      },
      {
        url: "images/taucolon/11_pradera_flores_islas.jpg",
        thumb: "images/taucolon/11_pradera_flores_islas.jpg",
        caption: "4. Pradera florida en altura con vista al archipiélago"
      },
      {
        url: "images/taucolon/03_playa_bosque.jpg",
        thumb: "images/taucolon/03_playa_bosque.jpg",
        caption: "5. Borde costero y ladera con bosque nativo"
      },
      {
        url: "images/taucolon/12_bahia_lanchas_atardecer.jpg",
        thumb: "images/taucolon/12_bahia_lanchas_atardecer.jpg",
        caption: "6. Ensenada protegida y fondeo natural de embarcaciones"
      },
      {
        url: "images/taucolon/04_anfiteatro_canales.jpg",
        thumb: "images/taucolon/04_anfiteatro_canales.jpg",
        caption: "7. Topografía en anfiteatro natural hacia los canales"
      },
      {
        url: "images/taucolon/13_playa_continua_piedrecilla.jpg",
        thumb: "images/taucolon/13_playa_continua_piedrecilla.jpg",
        caption: "8. Extensa playa limpia y canal navegado por aguas calmas"
      },
      {
        url: "images/taucolon/05_praderas_limpias.jpg",
        thumb: "images/taucolon/05_praderas_limpias.jpg",
        caption: "9. Praderas limpias y áreas listas para edificar"
      },
      {
        url: "images/taucolon/14_vista_mar_bosque_ladera.jpg",
        thumb: "images/taucolon/14_vista_mar_bosque_ladera.jpg",
        caption: "10. Ensenada, pradera y ladera boscosa vista desde el agua"
      },
      {
        url: "images/taucolon/06_vista_chauques.jpg",
        thumb: "images/taucolon/06_vista_chauques.jpg",
        caption: "11. Vista panorámica al archipiélago de las Chauques"
      },
      {
        url: "images/taucolon/15_sendero_nalcas_bahia.jpg",
        thumb: "images/taucolon/15_sendero_nalcas_bahia.jpg",
        caption: "12. Sendero costero con nalcas gigantes junto a la playa"
      },
      {
        url: "images/taucolon/07_islas_mechuque_anihue.jpg",
        thumb: "images/taucolon/07_islas_mechuque_anihue.jpg",
        caption: "13. Entorno insular: Mechuque y Añihué a minutos"
      },
      {
        url: "images/taucolon/08_sendero_bosque_nativo.jpg",
        thumb: "images/taucolon/08_sendero_bosque_nativo.jpg",
        caption: "14. Sendero interior y bosque nativo maduro"
      },
      {
        url: "images/taucolon/09_vertientes_entorno.jpg",
        thumb: "images/taucolon/09_vertientes_entorno.jpg",
        caption: "15. Vertientes de agua pura y naturaleza silvestre"
      }
    ],
    specs: [
      { label: "Superficie", val: "15,93 Has (159.300 m²)" },
      { label: "Frente de Playa", val: "410 metros de piedrecilla" },
      { label: "Precio Referencial", val: "UF 8.900" },
      { label: "Estatus Legal", val: "Rol Propio SAG & CBR Castro" }
    ],
    benefits: [
      "410m de playa calma para fondeo seguro de veleros y lanchas.",
      "Frente a marina de Puduhuapi y a 10 min de Mechuque.",
      "Tendido eléctrico en el predio y vertientes de agua viva."
    ],
    whatsappMsg: "Hola, me comunico por la Parcela de 15,93 Hectáreas con 410m de playa en Isla Taucolón (Chauques, Chiloé - UF 8.900). Quisiera recibir antecedentes técnicos y coordinar contacto directo con el dueño."
  },
  villarrica: {
    tag: "Orillas Río Toltén • UF 7.770",
    location: "Orillas Río Toltén • Villarrica",
    title: "Departamento Vista Río, Lago & Volcán",
    description: "Exclusivo departamento en 5° piso en Condominio La Rivera, a orillas del río Toltén, con vista panorámica al río, lago y volcán Villarrica. 113 m² totales, terraza cerrada en cristal, muelle privado y piscina.",
    videoSrc: "https://github.com/iLyCoNs/lemuy/releases/download/videos/VILLARRICA.CLIENTE.mp4",
    poster: "images/posters/villarrica_clip_01.jpg",
    hasGallery: true,
    photos: [
      {
        url: "images/villarrica/01_vista_panoramica_rio_lago_volcan.jpg",
        thumb: "images/villarrica/01_vista_panoramica_rio_lago_volcan.jpg",
        caption: "1. Vista panorámica al puente del río Toltén, lago y volcán Villarrica"
      },
      {
        url: "images/villarrica/02_terraza_abierta_volcan_rio.jpg",
        thumb: "images/villarrica/02_terraza_abierta_volcan_rio.jpg",
        caption: "2. Terraza abierta mirando al río Toltén, lago y volcán Villarrica"
      },
      {
        url: "images/villarrica/03_terraza_cristal_lumon_atardecer.jpg",
        thumb: "images/villarrica/03_terraza_cristal_lumon_atardecer.jpg",
        caption: "3. Atardecer y bruma matinal desde la terraza cerrada en cristal Lumon"
      },
      {
        url: "images/villarrica/04_terraza_cerrada_descanso.jpg",
        thumb: "images/villarrica/04_terraza_cerrada_descanso.jpg",
        caption: "4. Sala de descanso en terraza acristalada con vista al volcán"
      },
      {
        url: "images/villarrica/05_vista_terraza_lumon_lago.jpg",
        thumb: "images/villarrica/05_vista_terraza_lumon_lago.jpg",
        caption: "5. Vista despejada desde la terraza Lumon hacia el lago y puente"
      },
      {
        url: "images/villarrica/06_vista_lago_volcan_despejado.jpg",
        thumb: "images/villarrica/06_vista_lago_volcan_despejado.jpg",
        caption: "6. Día despejado sobre el lago y el volcán Villarrica"
      },
      {
        url: "images/villarrica/07_volcan_villarrica_fumarola.jpg",
        thumb: "images/villarrica/07_volcan_villarrica_fumarola.jpg",
        caption: "7. Acercamiento directo al cono nevado del volcán Villarrica"
      },
      {
        url: "images/villarrica/08_vista_panoramica_entorno.jpg",
        thumb: "images/villarrica/08_vista_panoramica_entorno.jpg",
        caption: "8. Horizonte cordillerano completo desde el departamento"
      },
      {
        url: "images/villarrica/09_living_comedor_amoblado.jpg",
        thumb: "images/villarrica/09_living_comedor_amoblado.jpg",
        caption: "9. Living comedor integrado con terminaciones en madera natural"
      },
      {
        url: "images/villarrica/10_living_comedor_perspectiva.jpg",
        thumb: "images/villarrica/10_living_comedor_perspectiva.jpg",
        caption: "10. Perspectiva del comedor hacia la terraza panorámica"
      },
      {
        url: "images/villarrica/11_living_estar_amoblado.jpg",
        thumb: "images/villarrica/11_living_estar_amoblado.jpg",
        caption: "11. Sala de estar y distribución luminosa del living"
      },
      {
        url: "images/villarrica/12_dormitorio_principal_suite.jpg",
        thumb: "images/villarrica/12_dormitorio_principal_suite.jpg",
        caption: "12. Dormitorio principal en suite"
      },
      {
        url: "images/villarrica/13_bano_suite_walkin_closet.jpg",
        thumb: "images/villarrica/13_bano_suite_walkin_closet.jpg",
        caption: "13. Baño principal en suite y walk-in closet"
      },
      {
        url: "images/villarrica/14_plano_distribucion_97m2.png",
        thumb: "images/villarrica/14_plano_distribucion_97m2.png",
        caption: "14. Plano oficial de arquitectura y distribución interior (97,54 m² útiles)"
      }
    ],
    specs: [
      { label: "Superficie", val: "113 m² Totales (90 m² Útiles)" },
      { label: "Dormitorios / Baños", val: "3 Dormitorios • 2 Baños (Suite)" },
      { label: "Estacionamiento", val: "1 Techado + Bodega" },
      { label: "Condominio", val: "Muelle Privado, Piscina, Quincho, 24/7" }
    ],
    benefits: [
      "Terraza panorámica de 23 m² cerrada en cristal con vista al río Toltén, lago y volcán.",
      "Muelle náutico privado para embarcaciones y deportes acuáticos a pasos.",
      "Condominio de primer nivel con conserjería 24/7, piscina, quincho y áreas verdes."
    ],
    whatsappMsg: "Hola, me interesa el departamento en Condominio La Rivera, Villarrica (UF 7.770). Quisiera más antecedentes y coordinar una visita."
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

  // Vinculación de los segmentos de selección rápida del Hero
  const heroPills = document.querySelectorAll('.hero-property-pill[data-tab-target], .hero-segment-item[data-tab-target]');
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
   GALERÍA EN MOVIMIENTO CONTINUO (FILAS PARALELAS PROPIEDAD 5 HAS)
   ========================================================================== */
function initOwnerGalleryMarquee() {
  const rows = document.getElementById('ownerMarqueeRows');
  const toggleBtn = document.getElementById('ownerMarqueeToggle');
  if (!rows || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const paused = rows.classList.toggle('is-paused');
    toggleBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    toggleBtn.innerHTML = paused
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg><span>Reanudar movimiento</span>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pausar movimiento</span>`;
  });
}

/* ==========================================================================
   VISOR MODAL LIGHTBOX PARA FOTOS EN ALTA RESOLUCIÓN + ZOOM INTERACTIVO
   ========================================================================== */
let photoModal, photoModalImg, photoModalCounter, photoModalCaption, photoModalContent;
let photoZoomState = { scale: 1, tx: 0, ty: 0, dragging: false, moved: false, startX: 0, startY: 0, origTx: 0, origTy: 0 };
let photoZoomLevelBtn = null;

function applyPhotoLightboxTransform() {
  if (!photoModalImg) return;
  const s = photoZoomState.scale;
  photoModalImg.style.transform = `translate3d(${photoZoomState.tx}px, ${photoZoomState.ty}px, 0) scale(${s})`;
  if (photoModalContent) {
    photoModalContent.classList.toggle('is-zoomable', s === 1);
    photoModalContent.classList.toggle('is-zoomed', s > 1);
  }
  if (photoZoomLevelBtn) {
    photoZoomLevelBtn.textContent = `${Math.round(s * 100)}%`;
    photoZoomLevelBtn.classList.toggle('is-active', s > 1);
  }
}

function setPhotoLightboxZoom(nextScale) {
  const clamped = Math.max(1, Math.min(3.5, Math.round(nextScale * 100) / 100));
  photoZoomState.scale = clamped;
  if (clamped <= 1) {
    photoZoomState.tx = 0;
    photoZoomState.ty = 0;
  } else if (photoModalContent) {
    const maxOffset = (clamped - 1) * 260;
    photoZoomState.tx = Math.max(-maxOffset, Math.min(maxOffset, photoZoomState.tx));
    photoZoomState.ty = Math.max(-maxOffset, Math.min(maxOffset, photoZoomState.ty));
  }
  applyPhotoLightboxTransform();
}

function resetPhotoLightboxZoom() {
  photoZoomState = { scale: 1, tx: 0, ty: 0, dragging: false, moved: false, startX: 0, startY: 0, origTx: 0, origTy: 0 };
  if (photoModalContent) photoModalContent.classList.remove('is-dragging');
  applyPhotoLightboxTransform();
}

function initPhotoLightbox() {
  photoModal = document.getElementById('photoModal');
  if (!photoModal) return;

  photoModalImg = document.getElementById('photoModalImg');
  photoModalCounter = document.getElementById('photoModalCounter');
  photoModalCaption = document.getElementById('photoModalCaption');
  photoModalContent = photoModal.querySelector('.photo-lightbox-content');

  const header = photoModal.querySelector('.photo-lightbox-header');
  const closeBtn = document.getElementById('closePhotoModal');
  const prevBtn = document.getElementById('photoModalPrev');
  const nextBtn = document.getElementById('photoModalNext');

  if (header && !header.querySelector('.photo-lightbox-zoom-bar')) {
    const zoomBar = document.createElement('div');
    zoomBar.className = 'photo-lightbox-zoom-bar';
    zoomBar.innerHTML = `
      <button type="button" class="photo-zoom-btn" id="photoZoomOutBtn" aria-label="Alejar foto">&minus;</button>
      <button type="button" class="photo-zoom-btn" id="photoZoomResetBtn" aria-label="Restablecer zoom">100%</button>
      <button type="button" class="photo-zoom-btn" id="photoZoomInBtn" aria-label="Acercar foto">+</button>
    `;
    header.insertBefore(zoomBar, closeBtn || null);

    photoZoomLevelBtn = zoomBar.querySelector('#photoZoomResetBtn');
    zoomBar.querySelector('#photoZoomOutBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setPhotoLightboxZoom(photoZoomState.scale - 0.6);
    });
    zoomBar.querySelector('#photoZoomInBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      setPhotoLightboxZoom(photoZoomState.scale + 0.6);
    });
    photoZoomLevelBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (photoZoomState.scale > 1) {
        resetPhotoLightboxZoom();
      } else {
        setPhotoLightboxZoom(2);
      }
    });
  }

  if (photoModalContent && photoModalImg) {
    photoModalImg.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      photoZoomState.dragging = true;
      photoZoomState.moved = false;
      photoZoomState.startX = e.clientX;
      photoZoomState.startY = e.clientY;
      photoZoomState.origTx = photoZoomState.tx;
      photoZoomState.origTy = photoZoomState.ty;
      if (photoZoomState.scale > 1) {
        photoModalContent.classList.add('is-dragging');
        photoModalImg.setPointerCapture?.(e.pointerId);
      }
    });

    photoModalImg.addEventListener('pointermove', (e) => {
      if (!photoZoomState.dragging) return;
      const dx = e.clientX - photoZoomState.startX;
      const dy = e.clientY - photoZoomState.startY;
      if (Math.hypot(dx, dy) > 5) {
        photoZoomState.moved = true;
      }
      if (photoZoomState.scale > 1) {
        const maxOffset = (photoZoomState.scale - 1) * 320;
        photoZoomState.tx = Math.max(-maxOffset, Math.min(maxOffset, photoZoomState.origTx + dx));
        photoZoomState.ty = Math.max(-maxOffset, Math.min(maxOffset, photoZoomState.origTy + dy));
        applyPhotoLightboxTransform();
      }
    });

    const endDrag = () => {
      photoZoomState.dragging = false;
      photoModalContent.classList.remove('is-dragging');
    };
    photoModalImg.addEventListener('pointerup', (e) => {
      const wasMoved = photoZoomState.moved;
      endDrag();
      if (!wasMoved) {
        setPhotoLightboxZoom(photoZoomState.scale > 1 ? 1 : 2);
      }
    });
    photoModalImg.addEventListener('pointercancel', endDrag);

    photoModalContent.addEventListener('wheel', (e) => {
      if (!photoModal.classList.contains('active')) return;
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.35 : -0.35;
      setPhotoLightboxZoom(photoZoomState.scale + step);
    }, { passive: false });
  }

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

  document.querySelectorAll('.taucolon-photo-card, .villarrica-photo-card, .owner-marquee-card').forEach(card => {
    card.addEventListener('click', () => {
      const propKey = card.getAttribute('data-gallery-prop') || (card.classList.contains('villarrica-photo-card') ? 'villarrica' : 'fundo17ha');
      if (propertiesData[propKey] && propertiesData[propKey].photos) {
        currentGalleryPhotos = propertiesData[propKey].photos;
      } else {
        currentGalleryPhotos = propertiesData.fundo17ha.photos;
      }
      const index = parseInt(card.getAttribute('data-gallery-index'), 10) || 0;
      openPhotoLightbox(index);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('active')) return;
    if (e.key === 'Escape') closePhotoLightbox();
    if (e.key === 'ArrowLeft') navigatePhotoLightbox(currentGalleryIndex - 1);
    if (e.key === 'ArrowRight') navigatePhotoLightbox(currentGalleryIndex + 1);
    if (e.key === '+' || e.key === '=') setPhotoLightboxZoom(photoZoomState.scale + 0.6);
    if (e.key === '-' || e.key === '_') setPhotoLightboxZoom(photoZoomState.scale - 0.6);
    if (e.key === '0') resetPhotoLightboxZoom();
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

  resetPhotoLightboxZoom();

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
  resetPhotoLightboxZoom();
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

/* ==========================================================================
   9. FORMULARIO DIRECTO EN PÁGINAS DEDICADAS DE PROPIEDAD
   ========================================================================== */
function initPropertyDirectContactForm() {
  const form = document.getElementById('propertyDirectContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const propName = form.querySelector('#pageProperty')?.value || 'Terreno en Chiloé';
    const name = form.querySelector('#propUserName')?.value.trim() || 'Interesado';
    const phone = form.querySelector('#propUserPhone')?.value.trim() || 'No informado';
    const message = form.querySelector('#propUserMessage')?.value.trim() || 'Deseo consultar precio, rol y coordinar visita.';

    const formattedMessage = `*Consulta Oficial - Remanso Natural*\n\n` +
      `*Propiedad:* ${propName}\n` +
      `*Nombre:* ${name}\n` +
      `*Teléfono:* ${phone}\n` +
      `*Mensaje:* ${message}`;

    const whatsappUrl = getWhatsAppUrl(formattedMessage);
    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   10. WIDGET DE CLIMA EN VIVO SATELITAL (Open-Meteo API)
   ========================================================================== */
const WMO_WEATHER_MAP = {
  0: { label: "Despejado", icon: "☀️" },
  1: { label: "Mayormente Despejado", icon: "🌤️" },
  2: { label: "Parcialmente Nublado", icon: "⛅" },
  3: { label: "Nublado", icon: "☁️" },
  45: { label: "Neblina", icon: "🌫️" },
  48: { label: "Neblina con Escarcha", icon: "🌫️" },
  51: { label: "Llovizna Ligera", icon: "🌦️" },
  53: { label: "Llovizna Moderada", icon: "🌦️" },
  55: { label: "Llovizna Intensa", icon: "🌧️" },
  61: { label: "Lluvia Ligera", icon: "🌧️" },
  63: { label: "Lluvia Moderada", icon: "🌧️" },
  65: { label: "Lluvia Fuerte", icon: "🌧️" },
  71: { label: "Nevada Ligera", icon: "🌨️" },
  73: { label: "Nevada Moderada", icon: "🌨️" },
  75: { label: "Nevada Intensa", icon: "❄️" },
  80: { label: "Chubascos Aislados", icon: "🌦️" },
  81: { label: "Chubascos Moderados", icon: "🌧️" },
  82: { label: "Chubascos Fuertes", icon: "⛈️" },
  95: { label: "Tormenta Eléctrica", icon: "⛈️" },
  96: { label: "Tormenta con Granizo", icon: "⛈️" },
  99: { label: "Tormenta Severa", icon: "⛈️" }
};

function getVisitAdvisory(code, rainProb) {
  if (rainProb >= 65 || [63, 65, 81, 82, 95, 96, 99].includes(code)) {
    return 'Lluvia austral • Llevar abrigo e impermeable';
  } else if (rainProb >= 35 || [51, 53, 55, 61, 80].includes(code)) {
    return 'Chubascos suaves • Caminata y miradores factibles';
  } else if ([0, 1].includes(code)) {
    return 'Día radiante • Óptimo para playa y navegación';
  } else {
    return 'Tiempo apacible • Ideal para visitar en terreno';
  }
}

function initLiveWeather() {
  const weatherCards = document.querySelectorAll('.weather-card[data-lat][data-lon]');
  if (!weatherCards.length) return;

  weatherCards.forEach(async (card) => {
    // Configurar botón interactivo para desplegar/plegar el pronóstico extendido
    const toggleBtn = card.querySelector('.weather-toggle-btn');
    const forecastBox = card.querySelector('.weather-forecast-container');
    if (toggleBtn && forecastBox) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = forecastBox.classList.toggle('is-open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        const textSpan = toggleBtn.querySelector('.weather-toggle-text');
        if (textSpan) {
          textSpan.textContent = isOpen 
            ? 'Ocultar Pronóstico Extendido' 
            : 'Ver Pronóstico de los Próximos Días';
        }
      });
    }

    const lat = card.getAttribute('data-lat');
    const lon = card.getAttribute('data-lon');
    if (!lat || !lon) return;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FSantiago&forecast_days=4`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Respuesta no válida');
      const data = await response.json();

      if (data && data.current) {
        const cur = data.current;
        const weatherInfo = WMO_WEATHER_MAP[cur.weather_code] || { label: "Templado", icon: "⛅" };

        const iconEl = card.querySelector('.weather-icon');
        const tempEl = card.querySelector('.weather-temp-val');
        const condEl = card.querySelector('.weather-condition-text');
        const metrics = card.querySelectorAll('.metric-val');

        if (iconEl) iconEl.textContent = weatherInfo.icon;
        if (tempEl) tempEl.textContent = `${Math.round(cur.temperature_2m)}°C`;
        if (condEl) condEl.textContent = weatherInfo.label;

        // Metrics: [0]=Sensación, [1]=Viento, [2]=Humedad, [3]=Precipitación
        if (metrics.length >= 4) {
          metrics[0].textContent = `${Math.round(cur.apparent_temperature)}°C`;
          metrics[1].textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
          metrics[2].textContent = `${Math.round(cur.relative_humidity_2m)}%`;
          metrics[3].textContent = `${cur.precipitation.toFixed(1)} mm`;
        }
      }

      // Renderizar pronóstico extendido de los próximos días
      if (data && data.daily && data.daily.time) {
        const forecastGrid = card.querySelector('.weather-forecast-grid');
        if (forecastGrid) {
          let forecastHTML = '';
          const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

          for (let i = 1; i < Math.min(4, data.daily.time.length); i++) {
            const dateStr = data.daily.time[i];
            const dateObj = new Date(dateStr + 'T12:00:00');
            const dayTitle = (i === 1) ? 'Mañana' : (dayNames[dateObj.getDay()] || dateStr);
            const formattedDate = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`;

            const dayCode = (data.daily.weather_code && data.daily.weather_code[i] != null) ? data.daily.weather_code[i] : 2;
            const dayInfo = WMO_WEATHER_MAP[dayCode] || { label: 'Parcialmente Nublado', icon: '⛅' };
            const maxT = Math.round(data.daily.temperature_2m_max[i]);
            const minT = Math.round(data.daily.temperature_2m_min[i]);
            const rainProb = (data.daily.precipitation_probability_max && data.daily.precipitation_probability_max[i] != null)
              ? data.daily.precipitation_probability_max[i]
              : 15;
            const advisory = getVisitAdvisory(dayCode, rainProb);

            forecastHTML += `
              <div class="forecast-card">
                <div class="forecast-day-header">
                  <span>${dayTitle}</span>
                  <span style="font-size: 0.72rem; color: #b7cbbf; font-weight: 500;">${formattedDate}</span>
                </div>
                <div class="forecast-body">
                  <span class="forecast-icon">${dayInfo.icon}</span>
                  <div>
                    <div class="forecast-temps">${maxT}°C <span class="temp-min">/ ${minT}°C</span></div>
                    <div class="forecast-cond">${dayInfo.label}</div>
                  </div>
                </div>
                <div class="forecast-advisory">${advisory}</div>
              </div>
            `;
          }
          forecastGrid.innerHTML = forecastHTML;
        }
      }
    } catch (err) {
      console.warn('Remanso Natural: No se pudo actualizar el widget de clima satelital:', err);
      const condEl = card.querySelector('.weather-condition-text');
      if (condEl && condEl.textContent.includes('Cargando')) {
        condEl.textContent = 'Clima Templado Austral';
      }
      const tempEl = card.querySelector('.weather-temp-val');
      if (tempEl && tempEl.textContent === '--°C') {
        tempEl.textContent = '14°C';
      }
    }
  });
}

/* ==========================================================================
   11. TARJETAS MAESTRAS 3D CON TILT ESPACIAL, DESTELLO CHAMPAGNE & BARRA KPI
   ========================================================================== */
function initMaster3DCards() {
  const cards = document.querySelectorAll('.taucolon-3d-card, .master-3d-card');
  if (!cards.length) return;

  const canTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach((card) => {
    // Asegurar capa de reflejo champagne sin mutar estructura visual
    if (!card.querySelector('.card-3d-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.prepend(glare);
    }

    if (!canTilt) return;

    let rafId = null;

    card.addEventListener('pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;

        card.style.setProperty('--mx', `${(relX * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(relY * 100).toFixed(1)}%`);
      });
    });

    card.addEventListener('pointerleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
    });
  });

  // Vinculación interactiva entre la Barra KPI Dossier y las tarjetas inferiores
  const ribbons = document.querySelectorAll('.master-dossier-ribbon');
  ribbons.forEach((ribbon) => {
    const section = ribbon.closest('section');
    if (!section) return;

    const sectionCards = Array.from(section.querySelectorAll('.taucolon-3d-card, .master-3d-card'));
    const kpiItems = Array.from(ribbon.querySelectorAll('.dossier-kpi-item[data-highlight-card]'));
    if (!sectionCards.length || !kpiItems.length) return;

    let lockedIndex = null;

    function applyHighlight(targetSpec) {
      const targets = String(targetSpec)
        .split(',')
        .map((n) => parseInt(n.trim(), 10))
        .filter((n) => !Number.isNaN(n));

      sectionCards.forEach((c, idx) => {
        const isHit = targets.includes(idx);
        c.classList.toggle('is-kpi-highlighted', isHit);
        c.classList.toggle('is-kpi-dimmed', !isHit);
      });
    }

    function clearHighlight() {
      kpiItems.forEach((item) => item.classList.remove('is-active'));
      sectionCards.forEach((c) => {
        c.classList.remove('is-kpi-highlighted', 'is-kpi-dimmed');
      });
    }

    kpiItems.forEach((item, idx) => {
      const spec = item.getAttribute('data-highlight-card');

      item.addEventListener('mouseenter', () => {
        if (lockedIndex !== null) return;
        kpiItems.forEach((k) => k.classList.remove('is-active'));
        item.classList.add('is-active');
        applyHighlight(spec);
      });

      item.addEventListener('focus', () => {
        kpiItems.forEach((k) => k.classList.remove('is-active'));
        item.classList.add('is-active');
        applyHighlight(spec);
      });

      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (lockedIndex === idx) {
          lockedIndex = null;
          clearHighlight();
        } else {
          lockedIndex = idx;
          kpiItems.forEach((k) => k.classList.remove('is-active'));
          item.classList.add('is-active');
          applyHighlight(spec);

          const firstTargetIdx = parseInt(String(spec).split(',')[0].trim(), 10);
          const firstCard = sectionCards[firstTargetIdx];
          if (firstCard && window.innerWidth <= 991) {
            const headerOffset = document.querySelector('.main-header')?.offsetHeight || 68;
            const y = firstCard.getBoundingClientRect().top + window.pageYOffset - headerOffset - 16;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      });
    });

    ribbon.addEventListener('mouseleave', () => {
      if (lockedIndex === null) clearHighlight();
    });

    ribbon.addEventListener('focusout', (e) => {
      if (lockedIndex === null && !ribbon.contains(e.relatedTarget)) {
        clearHighlight();
      }
    });

    document.addEventListener('click', (e) => {
      if (lockedIndex !== null && !ribbon.contains(e.target)) {
        lockedIndex = null;
        clearHighlight();
      }
    });
  });

  // Destello champagne sutil en tarjetas editoriales complementarias
  const glareTargets = document.querySelectorAll('.secure-step-card.is-luxury-step, .reason-card');
  if (canTilt && glareTargets.length) {
    glareTargets.forEach((card) => {
      if (!card.querySelector('.card-3d-glare')) {
        const g = document.createElement('div');
        g.className = 'card-3d-glare';
        g.setAttribute('aria-hidden', 'true');
        card.prepend(g);
      }
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        card.style.setProperty('--mx', `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      });
    });
  }
}

/* ==========================================================================
   12. HILO DE PROGRESO DORADO & ELEVACIÓN ADAPTATIVA DE CABECERA
   ========================================================================== */
function initHeaderScrollProgress() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  let progressEl = header.querySelector('.header-scroll-progress');
  if (!progressEl) {
    progressEl = document.createElement('div');
    progressEl.className = 'header-scroll-progress';
    progressEl.setAttribute('aria-hidden', 'true');
    header.appendChild(progressEl);
  }

  let ticking = false;
  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

    header.classList.toggle('is-scrolled', scrollTop > 40);
    progressEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* ==========================================================================
   13. COREOGRAFÍA DE APARICIÓN AL SCROLL (Progresiva y Respetuosa)
   ========================================================================== */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [];
  document.querySelectorAll('.section-header, .master-dossier-ribbon, .interactive-map-wrapper, .contact-card').forEach((el) => {
    targets.push({ el, delay: 0 });
  });

  const gridSelectors = [
    '.property-preview-grid',
    '.taucolon-master-grid',
    '.secure-steps-grid',
    '.reasons-grid',
    '.villarrica-gallery-grid',
    '.taucolon-gallery-grid',
    '.faq-list'
  ];
  gridSelectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((grid) => {
      Array.from(grid.children).forEach((child, idx) => {
        targets.push({ el: child, delay: Math.min(idx % 3, 2) * 85 });
      });
    });
  });

  if (!targets.length) return;

  targets.forEach(({ el, delay }) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', '');
      if (delay > 0) el.style.setProperty('--reveal-delay', `${delay}ms`);
    }
  });

  document.documentElement.classList.add('reveal-ready');

  const vh = window.innerHeight || 900;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '60px 0px 60px 0px' });

  targets.forEach(({ el }) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.98) {
      el.classList.add('is-revealed');
    } else {
      observer.observe(el);
    }
  });
}

/* ==========================================================================
   14. FILTRO CURADO DE PORTAFOLIO & MATRIZ COMPARATIVA (INDEX)
   ========================================================================== */
function initPortfolioExplorer() {
  const toolbar = document.querySelector('.portfolio-curated-toolbar');
  const grid = document.querySelector('.property-preview-grid');
  if (!toolbar || !grid) return;

  const filterBtns = Array.from(toolbar.querySelectorAll('.portfolio-filter-btn[data-filter]'));
  const cards = Array.from(grid.querySelectorAll('.property-preview-card'));

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      let visibleCount = 0;
      cards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        const match = cat === 'all' || categories.includes(cat);
        card.classList.toggle('is-filtered-out', !match);
        if (match) {
          visibleCount += 1;
          card.classList.add('is-revealed');
        }
      });

      grid.classList.toggle('is-2-cols', visibleCount === 2);
    });
  });

  const compareToggle = document.getElementById('portfolioCompareBtn');
  const compareDrawer = document.getElementById('portfolioCompareDrawer');
  if (compareToggle && compareDrawer) {
    compareToggle.addEventListener('click', () => {
      const isOpen = compareDrawer.classList.toggle('is-open');
      compareToggle.classList.toggle('active', isOpen);
      compareToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
}
