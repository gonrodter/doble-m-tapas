# Doble M · web

Web estática de una página (HTML + CSS + JS sin dependencias), con la estructura de malasana-web adaptada a Doble M. Datos e investigación en `research/BRIEF.md`.

Ver en local: `python3 -m http.server 8766` y abrir http://localhost:8766

## Estructura

- `index.html` · secciones: hero con vídeo, la casa, imprescindibles, platos, el local, galería, opiniones, a domicilio, contacto (horario + mapa bajo demanda), preguntas frecuentes
- **Carta**: no está en el HTML. El cliente la actualiza en Kekomo (kekomo.es/carta/doble-m) y la web la abre en un modal con iframe, así siempre está al día. Cualquier enlace a `#carta` lo abre. Si Kekomo da acceso oficial a sus datos, se puede volver a pintar como texto (mejor SEO) con una función en Vercel
- Hero: vídeo a pantalla completa con el titular encima (el vídeo es 720×1280, se ve algo blando en pantallas grandes; pedir versión horizontal)
- `privacidad.html`, `aviso-legal.html` (noindex) con los datos del titular que publica su web de eatbu
- `assets/img/` WebP 1080 + 640 (q76, sRGB, sin metadatos) con nombres SEO; la foto grande de imprescindibles tiene además 1600. Solo está lo que usa la web: lo que sobra va a `source-assets/sin-usar/`
- `assets/video/` hero sin audio (recortados los 2 primeros segundos del reel) en AV1 (`hero-av1.mp4`, ~1,1 MB, Chrome/Android/Firefox) y H.264 de respaldo (`hero.mp4`, ~1,8 MB, Safari) + póster
- `assets/fonts/` Jost + Manrope (mismas que Malasaña), self-hosted
- `vercel.json`: caché de 1 año para fuentes y 7 días para fotos y vídeo. **Si se cambia una foto, guardarla con otro nombre** (si no, quien ya entró puede ver la vieja unos días)
- `.vercelignore`: no sube `source-assets/`, `research/` ni este README
- Logo sacado del vector de su carta PDF (`source-assets/eatbu/Carta.pdf`, pág. 2) y pasado a monocromo: blanco en cabecera, verde en el pie. Iconos y favicon con el monograma
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.ico`, `assets/og-doble-m.jpg`

## SEO

- JSON-LD: `Restaurant` (dirección, geo, horario, servicios, zona Gelves/Aljarafe/Sevilla, ReserveAction), `hasMenu` apuntando a la carta de Kekomo, `FAQPage` que coincide con la sección visible de preguntas, `WebSite`
- Sin `aggregateRating`: Google no admite valoraciones propias en la web del negocio; las estrellas salen de la ficha de Google
- Un solo H1, H2 por sección (platos y galería con H2 oculto), alt descriptivos, Open Graph + Twitter, `max-image-preview:large`, sitemap con imágenes

## Transiciones

Hovers solo con ratón (`@media(hover:hover)`), pulsación con `scale` en táctil, botones con relleno que sube, fotos grandes que se descubren con máscara, listas en cascada, FAQ animado, modales con entrada/salida (hoja desde abajo en móvil), vídeo que aparece sobre el póster. Todo se desactiva con `prefers-reduced-motion`.

## A domicilio

Sección `#domicilio` (también en menú, pie y FAQ) con enlaces a sus fichas, comprobadas el 2026-11-10 con la dirección del bar:
- Uber Eats: https://www.ubereats.com/es/store/doble-m/o5EhBGKuWZ6DT2A-9VeDoA (hay otra ficha "Doble M old", `yHhZPscy…`, de baja desde feb 2023: no usarla)
- Glovo: https://glovoapp.com/es/es/sevilla/stores/doble-m-sevilla

Si cambian de plataforma o de ficha, cambiar los enlaces en la sección, el pie, la FAQ (visible y JSON-LD) y el `OrderAction` del JSON-LD.

## Reservas y carta

Widget de DISH (el que ya usan en doblem.eatbu.com) y carta de Kekomo, cada uno en su modal (`.frame-modal`); el iframe se carga la primera vez que se abre. Enlaces a `#reservar` y `#carta`.

## Pendiente antes de publicar

- [x] **Dominio** `doblemtapas.es` (GoDaddy, cuenta de Gonzalo) publicado el 2026-11-09 en Vercel, cuenta de la agencia (its.terron.studio, proyecto `doble-m-tapas`, repo `gonrodter/doble-m-tapas`, se publica solo con cada push a `main`). DNS en GoDaddy: A `@` 216.198.79.1 y 64.29.17.1, CNAME `www` 88d10190d5847f1d.vercel-dns-017.com; `www` redirige a la raíz. Pendiente: titular a nombre de Manuel y bloqueo de dominio en GoDaddy
- [x] **Horario** confirmado por el cliente el 2026-11-09: todos los días 13:30–16:00 y 21:00–23:30 (cambiado dos veces el mismo día; la última es la buena) (HTML, JSON-LD, FAQ, pie y `app.js`)
- [x] Datos fiscales confirmados por el cliente el 2026-11-09 (Manuel Márquez Carrabeo, 45811491E, mismo domicilio): coinciden con aviso legal y privacidad
- [ ] Confirmar la cifra "abrimos en 2019" (sale de Diario de Sevilla)
- [ ] Permiso para usar las fotos de Instagram (son suyas, profesionales) y pedir originales en alta si los tienen
- [ ] Logo en vector limpio (SVG/AI): el actual viene de rasterizar la carta de 2023
- [ ] Revisar cada temporada que los imprescindibles siguen en la carta de Kekomo
- [x] Imprescindibles cambiados el 2026-11-09 a petición del cliente (canelón, croquetas, bravas, mantecaíto, tosta de atún Gadira; fotos originales en `source-assets/cliente-2026-11-09/`). Subtítulos copiados de su carta de Kekomo; bravas y croquetas no tienen descripción allí, así que van sin subtítulo
- [ ] Tras publicar: poner la URL en Google Business e Instagram, alta en Search Console y enviar el sitemap
