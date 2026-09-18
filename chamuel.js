// Form handler for Chamuel consultation via WhatsApp
const form = document.getElementById('admission-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const name = String(f.get('name') || '').trim();
    const consultation = String(f.get('message') || '').trim();
    const message = [
      'Hola, me gustaría solicitar una consulta en Chamuel.',
      '',
      'Nombre completo: ' + name,
      '¿Cómo podemos ayudarle?: ' + consultation
    ].join('\n');
    window.open('https://wa.me/50664836199?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
}
