# JMael — J. Samuel

Sitio personal de J. Samuel, desarrollador full stack y consultor de software.

- Sitio: https://jmael.me/
- Publicación: GitHub Pages desde `main`, directorio raíz.
- Tecnología: HTML, CSS y JavaScript sin dependencias ni compilación.

## Desarrollo local

Ejecuta `python -m http.server 8080` desde la raíz y abre http://localhost:8080/.

## Archivos principales

- `index.html`: contenido y diálogos.
- `style.css`: diseño adaptable.
- `app.js`: navegación, proyectos y preparación de consultas.
- `assets/`: retrato, máscara y tipografía local con su licencia.
- `CNAME`: dominio personalizado; conservar `jmael.me`.

El retrato conserva los píxeles de la fotografía original mediante WebP sin pérdida y una máscara alfa independiente. Los proyectos en desarrollo se identifican como tales. Las consultas se preparan en WhatsApp o correo y el visitante decide enviarlas; no hay backend ni almacenamiento de formularios.

Versión del diseño migrada desde el commit `77c24d03186dd1959e7241226cdd5ed3a86c9c23` del entorno de diseño. La página anterior permanece recuperable en el historial de Git.


## Movimiento y composición

- `editorial-v2.css`: composición editorial y una sola animación de entrada por bloque.
- `story-engine.css` / `story-engine.js`: escenas opcionales con scroll nativo, activas desde 1100 × 640 cuando todo el contenido cabe. Las transiciones muestran un solo panel a la vez.
- En pantallas pequeñas, con movimiento reducido o cuando el contenido no cabe, se conserva el documento con scroll normal y todas las acciones disponibles.
- Los detalles de proyectos distinguen referencias visuales de capturas reales. La captura de JMael corresponde a la portada publicada; BRACKET y Control de costos conservan referencias identificadas.

Validación de esta actualización: revisión visual en Chromium a 1536 × 720, 1440 × 900, 1366 × 768, 1024 × 768, 390 × 844 y 320 × 740; navegación de escenas; apertura de detalles; menú móvil y Escape; servicio preseleccionado y rechazo de consultas vacías. Se comprobó la sintaxis de ambos scripts con `node --check`. No hay compilación ni suite de pruebas automatizadas en este sitio.
