# Guía Estratégica & Técnica: Alojamiento de Videos y Venta de Terrenos en Isla Lemuy y Chiloé
**Preparado para:** Australdrone.cl & Propietario de Terrenos en Chiloé  
**Objetivo:** Venta independiente de Parcela de 5.000 m², Fundo de 5 ha (Isla Lemuy) y Fundo Costero de ~17 ha (Archipiélago de Chiloé).

---

## 1. El Problema del Video Web: Por qué no funcionan los métodos tradicionales

En su carpeta local tenemos videos de altísima calidad grabados por **Australdrone**:
- `HORIZONTAL\16_9_ISLA_LEMUY.mp4` (~2.1 GB)
- `HORIZONTAL\TERRENO.mp4` (~1.3 GB)
- `HORIZONTAL\FRENTE_PLAYA.mp4` (~615 MB)
- `REELS\*.mp4` (archivos de 600 MB a 1.1 GB)

### ¿Por qué NO se pueden subir tal cual a un hosting web normal?
1. **Peso masivo:** Un archivo de 2 GB demorará entre 20 y 60 segundos en comenzar a reproducirse en la conexión de un usuario promedio, consumiendo todo su plan móvil.
2. **Google Drive / Dropbox / OneDrive:** Están diseñados para descargas, no para streaming. Al cabo de 10 o 20 reproducciones, Google bloquea el enlace temporalmente por "exceso de cuota de descarga" y no soportan el protocolo HTTP 206 (carga fraccionada por bloques).
3. **YouTube:** Si insertas un iframe de YouTube, no permite hacer el efecto suave de *“reproducir en silencio solo al pasar el ratón”* (hover). Además, muestra el logo de YouTube, banners de cookies y al terminar recomienda videos de otros canales (incluyendo competidores de parcelas).

---

## 2. Dónde y Cómo Alojar los Videos para Reproducción Automática en Hover

Para lograr el efecto **"hover to play"** (pasar el cursor y que el video ruede al instante en silencio), se utiliza la estrategia de **doble capa (Teaser de 3 a 5 MB + Video Completo)**:

### Plataformas de Alojamiento Recomendadas (Ordenadas por efectividad):

| Plataforma | Costo Estimado | Facilidad | ¿Permite URL directa .mp4 / HLS? | ¿Sin marcas ni anuncios? |
| :--- | :--- | :--- | :--- | :--- |
| **1. Bunny.net Stream (LA MEJOR OPCIÓN)** | ~$1 a $3 USD/mes (pago por uso: $0.01 por GB) | Muy fácil | **Sí, óptimo y ultrarrápido** (CDN global con punto en Santiago) | 100% limpia |
| **2. Cloudflare Stream** | $5 USD/mes por cada 1.000 minutos guardados | Media | **Sí, streaming adaptativo** | 100% limpia |
| **3. Vimeo Starter / Plus** | ~$10 - $15 USD/mes | Muy fácil | **Sí**, permite reproductor incrustado sin logos ni videos sugeridos | 100% limpia |
| **4. Cloudinary (Plan Gratuito)** | $0 (hasta 25 GB de ancho de banda al mes) | Media | **Sí, genera enlace directo .mp4** | 100% limpia |
| **5. Alojamiento propio comprimido (Netlify / Vercel / GitHub Pages)** | $0 | Fácil | **Sí**, si comprimes clips cortos de 3-5 MB para el hover | 100% limpia |

---

## 3. La Estrategia Técnica Recomendada: "Teaser vs Master"

Para que la página web vuele y la experiencia de usuario sea de lujo:

### A) El Video Previo (Hover Teaser):
1. Tomas los mejores 8 a 15 segundos de cada video (por ejemplo, con un programa gratuito como **HandBrake** o el mismo software de edición de Australdrone).
2. Lo exportas en resolución **720p o 1080p a 2.000 kbps**.
3. El archivo resultante pesará **solo 3 a 5 MB**.
4. Este archivo liviano es el que se coloca en la tarjeta web con los atributos:
   ```html
   <video muted loop playsinline preload="metadata" src="URL_DEL_TEASER.mp4"></video>
   ```
   *Al pesar 4 MB, empieza a reproducirse en 0,1 segundos apenas el usuario toca o pasa el cursor.*

### B) El Video Completo (Modal en Pantalla Completa):
- Cuando el usuario hace clic en **"Ver video completo en 4K"**, se abre el reproductor cinematográfico (Lightbox) que ya dejamos programado en la página, reproduciendo el video extendido con audio relajante o locución.

---

## 4. Opciones de Nombre de Marca y Dominios para el Cliente

Como el cliente no solo vende en Isla Lemuy, sino que también ofrece un **gran fundo de ~17 hectáreas en otra isla de Chiloé**, el nombre del sitio debe sonar prestigioso, patrimonial y permitir agrupar ambas ubicaciones:

### Opción A (Enfocada en Refugio y Naturaleza - Muy atractiva para profesionales 50+):
- **SantuarioLemuy.cl** (Nombre sugerido actual en la maqueta)
- **RefugiosDeChiloe.cl** (Excelente si planea seguir comercializando propiedades en el archipiélago)
- **SantuarioAustral.cl**

### Opción B (Enfocada en Tierra y Patrimonio - Máxima confianza jurídica):
- **TierrasDeLemuy.cl**
- **TierrasDeChiloe.cl**
- **PatrimonioChiloe.cl**

### Opción C (Enfocada en Exclusividad Insular):
- **IslasDeChiloe.cl**
- **OrillasDeChiloe.cl**

---

## 5. Perfil Psicológico del Comprador Objetivo (45 a 70+ años)

Este perfil de comprador no busca un "loteo masivo con canchas de pádel". Busca:
1. **Certeza Legal Absoluta:**
   - Gran temor: Las estafas de cesión de derechos o subdivisiones ilegales.
   - Solución en la web: Se destaca en la barra superior y en el FAQ que todas cuentan con **Rol Propio individual**, aprobación SAG y títulos saneados en el Conservador de Bienes Raíces de Castro.
2. **Aislamiento sin Abandono (Conectividad Real):**
   - Gran temor: Quedar atrapado por temporales o no tener acceso a emergencias médicas.
   - Solución en la web: Se incorporó la línea de tiempo didáctica que explica el vuelo directo Santiago-Castro (1h 40min), el transbordador continuo cada 15 min (gratuito para residentes) y el hospital de Castro a 45 minutos.
3. **El Microclima de Lemuy:**
   - La ventaja secreta de Isla Lemuy frente a otros lugares del sur es que se encuentra en los **canales interiores**, resguardada de las tempestades del océano abierto, lo que propicia praderas verdes, huertos y navegación tranquila.
4. **Venta Directa con el Dueño:**
   - A este público le agrada el trato honesto, saber quién es el dueño anterior, conocer la historia de la tierra y **ahorrarse el 2% a 4% de comisión de corretaje**.

---

## 6. Estructura de Archivos Creada en su Computador

En la carpeta `c:\Users\LyCoNs\Desktop\ISLA LEMUY`, ya hemos dejado funcionando:
- **`index.html`**: Estructura completa de la página web con las 3 propiedades, los videos interactivos, la sección didáctica de Chiloé, preguntas frecuentes y contacto.
- **`styles.css`**: Hoja de estilos de lujo con tipografía de alto contraste (Playfair Display + Plus Jakarta Sans), paleta de colores verde bosque patagónico y acentos dorados.
- **`app.js`**: Controlador interactivo para hover automático en desktop, reproducción táctil en móviles, cambio dinámico de pestañas y apertura de modal con audio.
- **`HORIZONTAL/` y `REELS/`**: Sus videos originales ya vinculados directamente en el código para que pueda probar la página de inmediato haciendo doble clic en `index.html`.

---

## 7. Próximos Pasos Sugeridos
1. **Haga doble clic en `index.html`** en su explorador de archivos para ver la página en vivo en su navegador.
2. Si desea ajustar los datos exactos del propietario (nombre del caballero, teléfono de WhatsApp o precios exactos en UF/CLP), podemos editarlos de inmediato.
3. Para publicar la página en internet con su dominio definitivo (`.cl`), se puede subir de forma gratuita a **Cloudflare Pages, Vercel o Netlify**, asociándole un servicio como Bunny.net para los videos en 4K.
