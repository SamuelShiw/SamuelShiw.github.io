# JMael · Portafolio profesional

Sitio personal de **J. Samuel (Jose Samuel Quispe Mamani)**, desarrollador full-stack y estudiante de Ingeniería de Software con IA en SENATI.

**Sitio público:** https://jmael.me/

## Propósito

Ofrecer una presentación clara a dos audiencias:
- **Empresas / reclutadores** que quieren conocer experiencia, proyectos, tecnologías y criterio de ingeniería.
- **Clientes / colaboradores** que necesitan evaluar un desarrollo de software.

El sitio conserva una identidad editorial de fondo oscuro, tipografía condensada y retrato personal, pero prioriza casos reales, contenido verificable y caminos claros para contactar.

## Tecnología

GitHub Pages desde `main` y raíz del repositorio; HTML, CSS y JavaScript estáticos, sin backend ni proceso de compilación.

Archivos activos:
- `index.html`: estructura, SEO y contenido.
- `creative-portfolio.css`: diseño adaptable y estilo editorial.
- `creative-portfolio.js`: menú móvil, progreso de lectura y mejoras opcionales de movimiento.
- `assets/j-samuel-portrait-lossless.webp` y `assets/j-samuel-alpha.webp`: fotografía y su máscara alineadas en proporción 2:3.
- `assets/display-bold.otf`: tipografía local (ver `assets/font-license.txt`).
- `CNAME`: dominio personalizado. **No eliminarlo ni cambiarlo**.
- `robots.txt` / `sitemap.xml`: descubrimiento básico.

Los archivos `style.css`, `app.js`, `editorial-v2.css` y `story-engine.*` corresponden a versiones anteriores y ya no se cargan en el documento principal. Se conservan para facilitar referencia histórica y rollback.

## Casos y privacidad

- **BRACKET**: trabajo en contexto de prácticas preprofesionales para una clínica real. El código funcional y los datos privados no se publican ni se enlazan. La representación gráfica en la web es *conceptual*, no una captura real.
- **EcoRegistro**: aplicación Android académica, enlazada a su repositorio público, con descripción acorde con su README.
- **JMael**: este sitio, con repositorio público enlazado.

No se publican testimonios, métricas, cifras de impacto o estados de producción sin evidencia.

## Comprobaciones

La acción `JMael Creative Portfolio Checks` valida:
1. Sintaxis de `creative-portfolio.js` con `node --check`.
2. Existencia de archivos y referencias enlazadas.
3. IDs/anchors, recursos, el archivo CNAME y reglas básicas de accesibilidad/semántica.

También se debe comprobar visualmente en pantallas de escritorio y móvil. Una acción correcta no sustituye esa revisión.

## Desarrollo local

```bash
python -m http.server 8080
```

Abrir http://localhost:8080 y verificar navegación, contacto, proyectos, ajustes de movimiento y diseños responsive.

## Publicación y rollback

GitHub Pages publica automáticamente los cambios fusionados a `main`. Para revertir una entrega, restaurar el commit anterior o revertir el merge desde GitHub. Conservar `CNAME` y `.nojekyll`.

## Contacto

- Correo: sumailqm10@gmail.com
- GitHub: https://github.com/SamuelShiw
- LinkedIn: https://www.linkedin.com/in/j-samuell/
