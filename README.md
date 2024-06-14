### `README.md`

```markdown
# Blacklist
Um sistema de WEB integrado que aumenta a segurança contra golpes cibernéticos.

## Descrição
O projeto Blacklist é uma aplicação web projetada para ajudar a identificar e mitigar ameaças cibernéticas. Ele oferece funcionalidades como análise de e-mails suspeitos, verificação de URLs e checagem de notícias para proteger os usuários contra golpes e fraudes online.

## Funcionalidades
- **Análise de E-mails:** Verifica cabeçalhos, conteúdo e links de e-mails para identificar possíveis ameaças.
- **Verificação de URLs:** Checa a reputação de URLs fornecidas e verifica se usam HTTPS.
- **Checagem de Notícias:** Verifica a veracidade de notícias utilizando uma API externa.
- **Logs de Atividades:** Registra atividades importantes no sistema para auditoria e monitoramento.

## Instalação

### Pré-requisitos
- Node.js
- npm (Node Package Manager)
- Banco de dados SQLite3

### Passos para Instalação
1. Clone o repositório:
    ```bash
    git clone https://github.com/Analise-e-Projeto-de-Software/blacklist.git
    cd blacklist
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto e adicionando as chaves de API:
    ```plaintext
    NEWS_API_KEY=b797132b580f4aa8b8a22812e5fb44ba
    VT_API_KEY=94975d6a79e24e64f876f1fcc26efd6a2ecafed35b95e56c6a0786da480584f0
    ```

4. Inicie o servidor:
    ```bash
    npm start
    ```

5. Acesse o projeto em `http://localhost:3000`.

## Testes
Para rodar os testes, execute:
```bash
npm test
```

## Estrutura do Projeto
```
blacklist/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── src/
│   ├── controllers/
│   ├── models/
│   │   └── database.js
│   ├── routes/
│   │   └── index.js
│   ├── services/
│   │   ├── logService.js
│   │   ├── newsService.js
│   │   └── urlChecker.js
│   └── views/
│       └── index.html
├── tests/
│   ├── emailAnalysis.test.js
│   ├── logService.test.js
│   ├── newsService.test.js
│   └── urlChecker.test.js
├── database/
│   └── blacklist.db
├── .env
├── app.js
├── package.json
└── README.md
```

## Documentação

### CBL
[CBL](https://docs.google.com/document/d/1ADRM9L5i62r6i0a83bWsVPRMMpTq5cnErkT2fL-_mEA/edit?usp=sharing)

### Documento de Visão
[Documento de Visão](https://ubecedu-my.sharepoint.com/:w:/g/personal/luiz_ggoncalves_a_ucb_br/EVLNDNuUVOpFqzB9KQx40fwBXQcxAnvsjP2vAPPKLB4zuw?e=7Kqj1N)

### Documento de Arquitetura
[Documento de Arquitetura](https://1drv.ms/w/s!AmB92fwwcAYIrwUhg6kcz8mC1lbN)
