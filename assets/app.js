(function(){
  'use strict';

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init(){
    // Ano dinâmico
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Menu móvel
    const hamb = document.getElementById('hamb');
    const menu = document.getElementById('menu');
    if (hamb && menu) {
      hamb.addEventListener('click', ()=> menu.classList.toggle('show'));
      menu.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('show')));
    }

    // Destacar link ativo conforme rolagem (robusto + fallback)
    const links = menu ? Array.from(menu.querySelectorAll('a[href^="#"]')) : [];
    const sections = links.map(l=> document.querySelector(l.getAttribute('href'))).filter(Boolean);
    try {
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            links.forEach(l=> l.classList.remove('active'));
            const link = links.find(l=> l.getAttribute('href') === '#' + e.target.id);
            if (link) link.classList.add('active');
          }
        });
      }, {rootMargin: '-40% 0px -55% 0px', threshold: 0});
      sections.forEach(el=> obs.observe(el));
    } catch(err){
      // Fallback sem IntersectionObserver
      window.addEventListener('scroll', ()=>{
        const y = window.scrollY + window.innerHeight * 0.45;
        let current = sections[0];
        sections.forEach(sec=>{ if (sec.offsetTop <= y) current = sec; });
        links.forEach(l=> l.classList.toggle('active', l.getAttribute('href') === '#' + (current?.id||'')));
      });
    }

    // Terminal typing effect (desktop)
    const term = document.getElementById('termLines');
    if (term) {
      const lines = [
        '➜  deploy git:(main) gh actions run build-and-deploy',
        '⠋  building…   docker build -t vbiten/app:1.4.2',
        '✔  image pushed  ghcr.io/vbiten/app:1.4.2  OK',
        '✔  terraform apply -auto-approve                OK',
        '✔  zabbix sender: healthchecks & latency < 120ms OK',
        '✔  rollout status deployment/app                 OK',
        'done • uptime target 99.9% • obs: grafana+loki+zabbix'
      ];
      (async () => {
        for (const ln of lines) {
          await typeLine(term, ln);
        }
      })();
    }

    function typeLine(el, text){
      return new Promise(res=>{
        let i=0; const spd=12; const br='\n';
        const id=setInterval(()=>{
          el.textContent += text[i++] || '';
          if (i>=text.length){
            clearInterval(id);
            el.textContent += br;
            res();
          }
        }, spd);
      });
    }

    // Formspree (AJAX)
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', async (ev)=>{
        ev.preventDefault();
        const status = document.getElementById('status');
        const btn = document.getElementById('sendBtn');
        const action = form.getAttribute('action') || '';
        if (action.includes('FORM_ID')){
          if (status) status.textContent = 'Configure o Formspree: substitua FORM_ID pelo seu ID (ex.: f/abcd1234).';
          return;
        }
        if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
        try {
          const data = new FormData(form);
          if (data.get('company')) { // honeypot
            if (status) status.textContent = 'Falha no envio.';
            return;
          }
          const res = await fetch(action, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: data
          });
          if (res.ok) {
            if (status) status.textContent = 'Mensagem enviada. Em breve entraremos em contato.';
            form.reset();
          } else {
            let msg = 'Não foi possível enviar. Tente novamente mais tarde.';
            try { const j = await res.json(); msg = j?.errors?.[0]?.message || msg; } catch(e){}
            if (status) status.textContent = msg;
          }
        } catch (e) {
          if (status) status.textContent = 'Erro de rede. Verifique sua conexão.';
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = 'Enviar'; }
        }
      });
    }
  }
})();