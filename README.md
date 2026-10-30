# Novelist · web

Página de presentación de [Novelist](https://borjajoart.github.io/novelist-web/): qué hace la aplicación, descargas de los
instaladores y manuales en PDF.

- **Web:** <https://borjajoart.github.io/novelist-web/>
- **Instaladores:** en [Releases](https://github.com/borjajoart/novelist-web/releases) (el código de la aplicación es
  privado; aquí solo se publican los binarios).

## Estructura

| Ruta                | Contenido                                                                 |
| ------------------- | ------------------------------------------------------------------------- |
| `site/`             | Lo que se publica: HTML, CSS, JS, capturas y PDF. Sin compilación.        |
| `tests/`            | Pruebas con Playwright: accesibilidad (axe, WCAG 2.2 AA), enlaces, móvil… |
| `scripts/serve.mjs` | Servidor estático local, sin dependencias.                                |

Buenas prácticas aplicadas: HTML semántico con un solo `h1` y encabezados en orden, enlace para saltar la navegación,
foco visible, contraste AA en tema claro y oscuro (`prefers-color-scheme`), `prefers-reduced-motion`, imágenes con texto
alternativo y dimensiones (sin saltos de diseño), carga diferida, política de seguridad de contenido estricta y ninguna
petición a terceros (sin fuentes externas ni analítica). JavaScript solo como mejora: destaca la descarga del sistema
del visitante.

## Desarrollo

```bash
npm install
npx playwright install chromium
npm start        # http://localhost:4173
npm run lint     # html-validate + prettier
npm test         # pruebas en escritorio y móvil
```

Cada `push` a `main` pasa las pruebas y publica `site/` en GitHub Pages (`.github/workflows/pages.yml`).

## Nueva versión de la aplicación

1. Crear una Release `vX.Y.Z` en este repositorio con `Novelist-X.Y.Z-win-x64.exe` y `Novelist-X.Y.Z-mac-arm64.dmg`.
2. Actualizar en `site/index.html` la versión, los enlaces y los tamaños.
3. Copiar los PDF de `novelist-desktop/docs` y las capturas (`npm run docs:manual` allí) si han cambiado.
