// Mejora progresiva: sin JavaScript la página funciona igual; con él se destaca la descarga del sistema del visitante.
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
  badge.textContent = 'Para tu ordenador';
  card.prepend(badge);

  // El botón principal descarga directamente la versión de este sistema.
  const main = document.getElementById('boton-principal');
  if (main) {
    main.href = link.href;
    main.textContent = system === 'mac' ? 'Descargar para Mac' : 'Descargar para Windows';
  }
})();
