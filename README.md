# Studio Essência Bela

Landing page estática do Studio Essência Bela — nail studio em Santo Antônio, Osasco/SP.

## Estrutura

```
web/            site publicado (HTML, CSS, JS e imagens)
web/assets/     imagens otimizadas
web/dist/       cópia de publicação do Qoder Sites (gerada, fora do Git)
vercel.json     configuração de deploy da Vercel
```

O site é HTML, CSS e JavaScript puros, sem build. As animações (botões com brilho e efeito de scroll do hero) foram implementadas nativamente com CSS (`@property`, `position: sticky`) e `requestAnimationFrame`; React, Tailwind, TypeScript e `motion` não são necessários.

## Prévia local

```bash
python -m http.server 4173 --bind 127.0.0.1 --directory web
```

Abra `http://127.0.0.1:4173/`. Qualquer servidor estático funciona (`npx serve web`, por exemplo).

## Deploy na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `carboniber-bit/Studio-Essencia-Bela`.
2. Mantenha o **Root Directory** na raiz do repositório (não selecione `web`).
3. **Framework Preset:** `Other`. Não informe Build Command nem instale dependências.
4. O `vercel.json` já define **Output Directory** como `web` e os cabeçalhos de cache e segurança. Clique em **Deploy**.

Não há variáveis de ambiente. Cada push na branch `main` gera um novo deploy de produção; os demais branches e pull requests recebem previews automáticos.

O site publicado na Vercel é público por padrão. Para manter o acesso restrito, ative **Deployment Protection** nas configurações do projeto ou publique em um domínio próprio com controle de acesso. A prévia do Qoder Sites continua privada.

## Conteúdo

- Todos os agendamentos apontam para o WhatsApp `(11) 96657-7616`.
- As fotos da galeria, dos serviços e do hero são trabalhos reais fornecidos pelo studio; a logo oficial substitui o monograma anterior.
- Serviços e textos seguem as informações validadas com a proprietária; não há perfis sociais vinculados.
