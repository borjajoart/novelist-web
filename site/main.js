// Mejora progresiva: sin JavaScript la página funciona igual, con la muestra de estilo ya marcada y sin destacar descarga.

// Destaca la descarga del sistema del visitante.
(() => {
  const platform = (navigator.userAgentData?.platform ?? navigator.platform ?? '').toLowerCase();
  const agent = navigator.userAgent.toLowerCase();
  const system =
    platform.includes('mac') || agent.includes('mac os')
      ? 'mac'
      : platform.includes('win') || agent.includes('windows')
        ? 'windows'
        : null;
  if (!system) return;

  const card = document.querySelector(`.descarga[data-sistema="${system}"]`);
  const link = card?.querySelector('a.boton');
  if (!card || !link) return;

  card.classList.add('descarga--recomendada');
  const badge = document.createElement('span');
  badge.className = 'recomendada';
  badge.textContent = system === 'mac' ? 'Para tu Mac, si tiene chip de Apple' : 'Para tu ordenador';
  card.prepend(badge);

  // El botón principal descarga directamente la versión de este sistema.
  const main = document.getElementById('boton-principal');
  if (main) {
    main.href = link.href;
    main.textContent = system === 'mac' ? 'Descargar para Mac' : 'Descargar para Windows';
  }
})();

// Las marcas de la muestra de estilo aparecen al llegar a ella.
(() => {
  const sample = document.querySelector('.muestra');
  if (!sample || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  sample.classList.add('muestra--pendiente');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      sample.classList.remove('muestra--pendiente');
      observer.disconnect();
    },
    { threshold: 0.5 },
  );
  observer.observe(sample);
})();
