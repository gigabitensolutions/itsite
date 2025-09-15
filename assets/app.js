// =========================
// File: assets/app.js
// =========================
// Ano dinâmico
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// Menu móvel
const hamb = document.getElementById('hamb');
const menu = document.getElementById('menu');
if (hamb && menu) {
hamb.addEventListener('click', ()=> menu.classList.toggle('show'));
menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('show')));
}


// Destacar link ativo conforme rolagem
if (menu) {
const links = [...menu.querySelectorAll('a')];
const ids = links.map(l=> document.querySelector(l.getAttribute('href')));
const obs = new IntersectionObserver((entries)=>{
entries.forEach(e=>{
if(e.isIntersecting){
links.forEach(l=> l.classList.remove('active'));
const link = links.find(l=> l.getAttribute('href') === '#' + e.target.id);
link && link.classList.add('active');
}
})
}, {rootMargin: '-40% 0px -55% 0px', threshold: 0});
ids.forEach(el=> el && obs.observe(el));
}


// Formspree (AJAX) — substitua FORM_ID no index.html
const form = document.getElementById('contactForm');
if (form) {
form.addEventListener('submit', async (ev)=>{
ev.preventDefault();
const status = document.getElementById('status');
const btn = document.getElementById('sendBtn');
if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }


try {
const data = new FormData(form);
// Honeypot simples
if (data.get('company')) {
status.textContent = 'Falha no envio.';
if (btn) { btn.disabled = false; btn.textContent = 'Enviar'; }
return;
}
const res = await fetch(form.action, {
method: 'POST',
headers: { 'Accept': 'application/json' },
body: data
});


if (res.ok) {
status.textContent = 'Mensagem enviada. Em breve entraremos em contato.';
form.reset();
} else {
const json = await res.json().catch(()=>null);
status.textContent = json?.errors?.[0]?.message || 'Não foi possível enviar. Tente novamente mais tarde.';
}
} catch (e) {
document.getElementById('status').textContent = 'Erro de rede. Verifique sua conexão.';
} finally {
if (btn) { btn.disabled = false; btn.textContent = 'Enviar'; }
}
});
}