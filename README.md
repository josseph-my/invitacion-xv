# Invitación XV · Mariana

Página estática (HTML + CSS + JS), sin dependencias ni paso de build.

## Estructura
```
index.html          contenido (una <section> por apartado)
css/styles.css      estilos; colores y fuentes en :root
js/config.js        DATOS DEL EVENTO (lo único que normalmente se edita)
js/main.js          puerta, reloj, cuenta regresiva, música, scroll, confirmación
assets/img/         fotos e ilustraciones (WebP)
assets/audio/       canción (MP3)
apps-script/Code.gs script de Google para guardar las confirmaciones
og-image.jpg        imagen de vista previa para WhatsApp (1200x630)
favicon.svg
```

## Probar en local
- VS Code > extensión **Live Server** > clic derecho en `index.html` > *Open with Live Server*.
- Sin VS Code: `python3 -m http.server 8000` dentro de la carpeta y abrir http://localhost:8000
- Celular: mismo Wi-Fi y abrir la IP de tu PC con el puerto (ej. http://192.168.1.10:5500).
- Las fuentes de Google necesitan internet.

## Pendientes antes de publicar
1. `js/config.js`: poner `photo` y `song` (copiar los archivos a `assets/`), revisar fecha, lugar y `rsvpBy`.
2. Crear la hoja de Google y el script (abajo) y pegar la URL `/exec` en `rsvpUrl`.
3. `index.html` (en el `<head>`): reemplazar `TU-DOMINIO` por tu URL real en `og:image`.
4. Probar el formulario con un nombre de prueba y borrar esa fila de la hoja.

## Confirmación de asistencia (Google Sheets + Apps Script)
1. Hoja nueva en Google Sheets. Pestaña llamada **Respuestas**. Fila 1: `Fecha | Nombre | Asistencia`.
2. Extensiones > Apps Script. Pegar el contenido de `apps-script/Code.gs`. Guardar.
3. Implementar > Nueva implementación > Aplicación web. Ejecutar como: **Yo**. Acceso: **Cualquier persona**. Autorizar.
4. Copiar la URL que termina en `/exec`; abrirla en el navegador debe mostrar `{"ok":true,"mensaje":"activo"}`.
5. Pegarla en `rsvpUrl` de `js/config.js`.
6. Si cambias el script: Implementar > Administrar implementaciones > editar > **Nueva versión**.

Reglas del formulario (una sola persona por invitación):
- Un único campo de nombre completo; se rechazan comas, "y", "&", "familia", "acompañante", "pareja", "hijos", etc.
- Un nombre = una fila: si la misma persona vuelve a responder, se actualiza su fila (no se duplica).
- Enlace personal opcional: `tusitio.com/?invitado=Ana%20Lopez` rellena el nombre y lo bloquea.
- Lista cerrada opcional: poner `VALIDAR_LISTA = true` en el script y los nombres permitidos en una pestaña **Invitados** (columna A).
- Sin `rsvpUrl` el formulario funciona en modo prueba y no guarda nada (lo indica en pantalla).
- Estas validaciones disuaden pero no son infalibles: la URL del script es visible en el código.

## Publicar
- **Netlify**: *Add new site > Deploy manually*, arrastrar la carpeta (o conectar el repositorio de GitHub). Sin comando de build.
- **GitHub Pages**: Settings > Pages > Deploy from a branch > main / root.
- Después: probar el enlace en WhatsApp (si la vista previa no cambia, agregar `?v=2` al enlace).
- Rutas siempre relativas (`assets/img/foto.webp`) y nombres en minúscula, sin espacios.
