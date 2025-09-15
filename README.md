# VBITEN — Landing (GitHub Pages)

Site estático pronto para deploy no GitHub Pages.

## Estrutura
- `index.html`
- `assets/styles.css`
- `assets/app.js`
- `assets/logo.svg`
- `assets/favicon.svg`
- `assets/favicon-apple.png`
- `.nojekyll`

## Passos de Deploy (GitHub Pages)
1. Crie um repositório (ex.: `vbiten.github.io` ou outro).
2. Faça upload de todos os arquivos mantendo os caminhos.
3. Em **Settings → Pages**, selecione a branch (geralmente `main`). Aguarde o build.
4. **(Opcional)** Em **Custom domain**, informe `vbiten.tech` (ou `stage-bar.vbiten.tech`). Salve e ative **Enforce HTTPS**.

> DNS (GoDaddy):
> - A ( @ ) → 185.199.108.153 / 109.153 / 110.153 / 111.153
> - CNAME ( www ) → vbiten.github.io
> - CNAME ( stage-bar ) → vbiten.github.io

## Formulário (Formspree)
Edite `index.html` e substitua `FORM_ID` pelo seu ID real do Formspree, por ex.: `f/abcd1234`.

## Dica SPA/rotas
Se evoluir para SPA com rotas, adicione um `404.html` que redireciona para `/index.html`.
