import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

for (const colorScheme of /** @type {const} */ (['light', 'dark'])) {
  test(`sin problemas de accesibilidad (tema ${colorScheme === 'light' ? 'claro' : 'oscuro'})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    // Abrir las preguntas para analizar también su contenido.
    for (const d of await page.locator('details').all()) await d.evaluate((el) => el.setAttribute('open', ''));
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
  });
}

test('estructura: un h1, encabezados en orden y textos alternativos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  const levels = await page.locator('h1, h2, h3').evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  for (const img of await page.locator('img').all()) expect(await img.getAttribute('alt')).not.toBeNull();
});

test('el enlace «Saltar al contenido» es lo primero al tabular', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Sin teclado en móvil');
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contenido$/);
});

test('todas las imágenes, PDF y enlaces internos existen', async ({ page, request }) => {
  await page.goto('/');
  const urls = await page.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll('img[src], a[href], link[href], script[src]')]
        .map((el) => el.getAttribute('src') ?? el.getAttribute('href') ?? '')
        .filter((u) => u && !u.startsWith('#') && !u.startsWith('http')),
    ),
  ]);
  expect(urls.length).toBeGreaterThan(10);
  for (const url of urls) expect((await request.get(url)).status(), url).toBe(200);
  for (const id of await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
    if (id !== '#') await expect(page.locator(id), id).toHaveCount(1);
  }
});

test('los instaladores apuntan a la versión publicada', async ({ page }) => {
  await page.goto('/');
  const links = page.locator('.descarga a.boton');
  await expect(links).toHaveCount(2);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
    expect(href).toMatch(/^https:\/\/github\.com\/borjajoart\/novelist-web\/releases\/download\/v\d+\.\d+\.\d+\//);
  }
  await expect(page.locator('body')).not.toContainText(/TAMANO_/);
});

test('destaca la descarga del sistema del visitante', async ({ browser }) => {
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.descarga--recomendada')).toHaveAttribute('data-sistema', 'mac');
  await expect(page.locator('#boton-principal')).toHaveText('Descargar para Mac');
  await context.close();
});

test('sin desplazamiento horizontal en pantallas pequeñas', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('sin errores en la consola', async ({ page }) => {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});
