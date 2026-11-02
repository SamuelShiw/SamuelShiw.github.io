const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function setMenu(open, restoreFocus = false) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  menu.querySelector('.menu-label').textContent = open ? 'Cerrar' : 'Menú';
  menu.querySelector('.menu-symbol').textContent = open ? '×' : '＋';
  nav.classList.toggle('open', open);
  if (restoreFocus) menu.focus();
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header') && menu.getAttribute('aria-expanded') === 'true') setMenu(false);
});
window.matchMedia('(min-width: 721px)').addEventListener('change', () => setMenu(false));
const projects = {
  jmael: {type:'WEB PERSONAL / EN DESARROLLO', title:'El espacio JMael', description:'Mi espacio personal en internet: un lugar para presentarme, compartir trabajos y exploraciones y conectar con personas que quieran construir algo conmigo.', status:'En desarrollo. Primera versión de la estructura y la identidad visual.', focus:'Una presencia personal clara que pueda crecer junto con mis proyectos, contenidos y servicios.'},
  ia: {type:'LABORATORIO / EXPLORACIÓN INICIAL', title:'IA aplicada', description:'Una línea de exploración para entender cómo integrar inteligencia artificial en herramientas y procesos cotidianos. Cada prueba partirá de una pregunta concreta y un problema acotado.', status:'Exploración inicial. Las primeras pruebas se documentarán aquí.', focus:'Evaluar utilidad, límites y experiencia de uso antes de convertir una prueba en una solución.'},
  bracket: {type:'SISTEMA WEB / EN DESARROLLO', title:'BRACKET', description:'Un sistema de gestión para una clínica odontológica. Reúne agenda, pacientes, atención clínica, caja e inventario, con flujos adaptados a recepción, administración y profesionales.', status:'Proyecto real en desarrollo y validación. La aceptación clínica y las pruebas en los dispositivos del cliente forman parte del proceso.', focus:'Entender la operación, proteger las reglas de negocio y simplificar las tareas de cada rol.'},
  costos: {type:'DATOS Y OPERACIONES / IDEA INICIAL', title:'Control de costos', description:'Una línea de exploración que nace de mi experiencia en operaciones mineras: organizar información de mano de obra, materiales y equipos para entender dónde se consumen los recursos.', status:'Idea inicial. Definición del problema y del alcance.', focus:'Partir de datos y necesidades reales antes de elegir herramientas o construir un sistema.'},
  mael: {type:'IDENTIDAD DIGITAL / EN DESARROLLO', title:'Personajes digitales', description:'Exploro un personaje digital propio para comunicar ideas y acompañar contenido sobre tecnología y el proceso de construir software. El trabajo combina expresión, voz sintética y animación 2D.', status:'Experimentación en curso. El personaje, sus expresiones y su forma de comunicarse siguen evolucionando.', focus:'Encontrar una identidad reconocible y una forma cercana de explicar lo que voy aprendiendo.'},
  motion: {type:'AUDIOVISUAL / EXPLORACIÓN', title:'Motion tests', description:'Un espacio para experimentar con ritmo, tipografía, edición y movimiento. Pequeñas pruebas para aprender a contar una idea de manera visual y llevar ese aprendizaje a futuros videos.', status:'Exploración inicial. Pruebas de estilo y movimiento por desarrollar.', focus:'Claridad de la idea, intención en el movimiento y una narrativa que se entienda.'}
};
const dialog = document.querySelector('#project-dialog');
// Facts describe the current work, not unverified outcomes or finished products.
const projectEvidence = {
  bracket: {
    role: 'Desarrollo full stack de un sistema para una clínica odontológica.',
    decisions: ['Organizar agenda, pacientes, atención, caja e inventario según el rol de cada usuario.', 'Adaptar los flujos de trabajo a recepción y profesionales clínicos.'],
    evidence: 'El proyecto continúa en desarrollo y validación. La imagen es una referencia de composición, no una captura del producto.',
    caption: 'Referencia visual de la agenda · sin datos de pacientes.',
    visual: 'bracket'
  },
  costos: {
    role: 'Definición de una idea a partir de mi experiencia en operaciones mineras.',
    decisions: ['Partir de mano de obra, materiales y equipos para definir qué información hace falta.', 'Validar el problema y los datos disponibles antes de construir una herramienta.'],
    evidence: 'Idea inicial. Todavía no hay una aplicación ni resultados publicados.',
    caption: 'Concepto ilustrativo · no representa una aplicación terminada.',
    visual: 'costos'
  },
  jmael: {
    role: 'Diseño y desarrollo de mi presencia personal en internet.',
    decisions: ['HTML, CSS y JavaScript sin dependencias para una web estática.', 'Desplazamiento nativo con escenas opcionales y una alternativa para movimiento reducido.', 'Consultas preparadas en WhatsApp o correo; el visitante revisa y envía el mensaje.'],
    evidence: 'Código público y sitio accesible. La identidad y el contenido siguen evolucionando.',
    caption: 'Captura de la portada de JMael.',
    image: 'assets/jmael-web-preview.webp',
    source: 'https://github.com/SamuelShiw/SamuelShiw.github.io'
  }
};
function renderProjectEvidence(id) {
  const data = projectEvidence[id];
  const section = document.querySelector('#dialog-evidence');
  const figure = document.querySelector('#dialog-visual');
  section.replaceChildren();
  figure.replaceChildren();
  section.hidden = !data;
  figure.hidden = !data;
  if (!data) return;
  if (data.image) {
    const image = document.createElement('img');
    image.src = data.image;
    image.alt = 'Portada de JMael con el retrato y la presentación de J. Samuel';
    image.width = 960;
    image.height = 450;
    figure.append(image);
  } else {
    const art = document.querySelector(`.project-card[data-project="${data.visual}"] .project-art`);
    if (art) figure.append(art.cloneNode(true));
  }
  const caption = document.createElement('figcaption');
  caption.textContent = data.caption;
  figure.append(caption);
  const addParagraph = (title, text) => {
    const heading = document.createElement('h3');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    section.append(heading, paragraph);
  };
  addParagraph('MI PARTICIPACIÓN', data.role);
  const heading = document.createElement('h3');
  heading.textContent = 'DECISIONES DEL PROYECTO';
  const list = document.createElement('ul');
  data.decisions.forEach(text => {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  });
  section.append(heading, list);
  addParagraph('QUÉ PUEDES REVISAR', data.evidence);
  if (data.source) {
    const source = document.createElement('a');
    source.href = data.source;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = 'Ver código en GitHub ↗';
    section.append(source);
  }
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.project;
  const project = projects[id];
  if (!project) return;
  document.querySelectorAll('dialog[open]').forEach(openDialog => openDialog.close());
  document.querySelector('#dialog-type').textContent = project.type;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-description').textContent = project.description;
  document.querySelector('#dialog-status').textContent = project.status;
  document.querySelector('#dialog-focus').textContent = project.focus;
  renderProjectEvidence(id);
  dialog.showModal();
  dialog.scrollTop = 0;
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelector('#dialog-link').addEventListener('click', () => dialog.close());
function openModal(id) {
  document.querySelectorAll('dialog[open]').forEach(openDialog => openDialog.close());
  document.querySelector(id).showModal();
}
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.service) document.querySelector('#service').value = button.dataset.service;
  openModal('#contact-dialog');
}));
document.querySelectorAll('[data-lab]').forEach(button => button.addEventListener('click', () => openModal('#lab-dialog')));
document.querySelectorAll('[data-faq]').forEach(button => button.addEventListener('click', () => openModal('#faq-dialog')));
document.querySelectorAll('.modal-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog:not(#project-dialog)').forEach(modal => modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const rect = modal.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
}));
document.querySelector('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const idea = document.querySelector('#idea');
  if (!idea.value.trim()) { idea.setCustomValidity('Cuéntame brevemente tu idea.'); idea.reportValidity(); return; }
  idea.setCustomValidity('');
  const text = `Hola, J. Samuel. Me interesa: ${document.querySelector('#service').value}.\n\n${idea.value.trim()}\n\n¿Podemos conversar sobre el alcance y los siguientes pasos?`;
  const status = document.querySelector('#form-status');
  const channel = event.submitter?.value === 'email' ? 'email' : 'whatsapp';
  const destination = channel === 'email'
    ? `mailto:sumailqm10@gmail.com?subject=${encodeURIComponent('Consulta JMael · ' + document.querySelector('#service').value)}&body=${encodeURIComponent(text)}`
    : `https://wa.me/51901036216?text=${encodeURIComponent(text)}`;
  status.textContent = channel === 'email'
    ? 'Se abrirá tu aplicación de correo con la consulta preparada. Revisa el mensaje y envíalo desde allí.'
    : 'Se abrirá WhatsApp con la consulta preparada. Revisa el mensaje y envíalo desde allí.';
  if (channel === 'email') window.location.href = destination;
  else {
    window.open(destination, '_blank', 'noopener,noreferrer');
  }
});
document.querySelector('#idea').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#year').textContent = new Date().getFullYear();
