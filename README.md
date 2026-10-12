# Invitación XV · Mariana

Página estática (HTML + CSS + JS), sin dependencias ni paso de build.

## Estructura
```
index.html          contenido (una <section> por apartado)
css/styles.css      estilos; colores y fuentes en :root
js/config.js        DATOS DEL EVENTO 
js/main.js          puerta, reloj, cuenta regresiva, música, scroll, confirmación
assets/img/         fotos e ilustraciones 
assets/audio/       canción 
apps-script/Code.gs script de Google para guardar las confirmaciones
og-image.jpg        imagen de vista previa opengraph
favicon.svg
```

## Pendientes antes de publicar
3. `index.html` (en el `<head>`): reemplazar `TU-DOMINIO` por tu URL real en `og:image`.

## Confirmación de asistencia (Google Sheets + Apps Script)
Implementado en appscript con el script en este proyecto
Script operando `{"ok":true,"mensaje":"activo"}`.

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

## Git comandos
cd invitacion-xv
git init
git add .
git commit -m "Invitación XV"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/invitacion-xv.git
git push -u origin main