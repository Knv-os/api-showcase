# assistance-api
API do novo sistema de Assistência

## Visão Geral
API REST construída com Node.js, Express e TypeScript para o sistema de assistência técnica. Utiliza Prisma como ORM e expõe documentação via Swagger em `/api-docs`. Suporta autenticação, gestão de usuários, clientes, serviços, faturamento, pedidos e integrações (ex.: Omie, AWS Cognito e S3).

## Stack
- Node.js + TypeScript (`express`, `helmet`, `cors`, `morgan`)
- Prisma ORM (`@prisma/client`)
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)
- Validações (`class-validator`, `zod`)
- Logs (`winston`, `winston-daily-rotate-file`)
- Agendamentos (`node-cron`)
- AWS (S3, Cognito) quando configurado

## Requisitos
- Node.js 18+
- Yarn (recomendado) ou npm
- Banco compatível com o schema do Prisma (ver `prisma/schema.prisma`)

## Configuração
1) Crie um arquivo `.env` na raiz com as variáveis abaixo (veja `src/config/index.ts`):

```env
# App
NODE_ENV=development
PORT=3005
LOG_FORMAT=dev
LOG_DIR=./logs
ORIGIN=*
CREDENTIALS=true

# Sessão / Auth
SECRET_KEY=changeme
SESSION_EXPIRES=86400

# Banco (ex.: PostgreSQL/MySQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=pass
DB_DATABASE=assistance
DB_SCHEMA=public

# AWS
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_S3_NAME=
AWS_COGNITO_USER_POOL_ID=
AWS_COGNITO_CLIENT_ID=
AWS_COGNITO_CLIENT_SECRET=

# OMIE
OMIE_LOG_APP_KEY=
OMIE_LOG_APP_SECRET=
OMIE_WE_APP_KEY=
OMIE_WE_APP_SECRET=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=

# Outros
SEND_REPORT_EMAILS=false
STATUS_DEFAULT=
```

2) Instale as dependências e prepare o banco:

```bash
yarn
prisma db push
```

Ou use o script preparado:

```bash
yarn setup
```

## Scripts principais (`package.json`)
- `yarn dev`: inicia em desenvolvimento com `nodemon`.
- `yarn start`: roda a build compilada (`dist/src/server.js`).
- `yarn build`: sincroniza Prisma, executa migrações utilitárias e compila com SWC.
- `yarn test`: executa testes com Jest.
- `yarn lint` / `yarn lint:fix`: checagem e correção de lint.
- `yarn create:api`: utilitário para gerar boilerplate de novas rotas.

## Como rodar
Desenvolvimento (porta padrão `3005` ou `PORT` do `.env`):

```bash
yarn dev
# abre http://localhost:3005/api-docs
```

Produção (compilado):

```bash
yarn build
yarn start
```

PM2 (opcional, ver `ecosystem.config.js`):

```bash
# dev
pm2 start ecosystem.config.js --only api-showcase-dev

# prod
pm2 start ecosystem.config.js --only api-showcase-prod
```

Logs padrão ficam em `./src/utils/logs/` quando usando PM2 (ver `ecosystem.config.js`).

## Documentação da API (Swagger)
- Rota: `GET /api-docs`
- Definições base em `swagger.yaml`
- Exemplo de recursos incluídos: `users`

Exemplos (a partir de `swagger.yaml`):

- `GET /users` — lista usuários
- `POST /users` — cria usuário
- `GET /users/{id}` — busca por id
- `PUT /users/{id}` — atualiza por id
- `DELETE /users/{id}` — remove por id

## Banco de Dados (Prisma)
- Cliente: `src/databases/index.ts` (extensões: soft delete, filtro de deletados, sequência de número para `reports`).
- Conexão iniciada em `App.initializeDatabase()`.
- Comandos úteis:

```bash
# aplicar schema ao banco
npx prisma db push

# abrir Prisma Studio
npx prisma studio
```

## Estrutura de Pastas
- `src/server.ts`: boot do servidor, registro de rotas.
- `src/app.ts`: configuração do Express, middlewares, Swagger e cronjobs.
- `src/apis/`: módulos de API (ex.: `users`, `auth`, `clients`, `services`, `orders`, `reports`, etc.).
- `src/middlewares/`: middlewares globais (ex.: `error.middleware`).
- `src/utils/`: logger, validações, migrações utilitárias, etc.
- `src/config/`: leitura das variáveis de ambiente.
- `prisma/`: schema do banco e migrações.

## Testes e Qualidade
```bash
yarn test
yarn lint
yarn lint:fix
```

## Healthcheck
Algumas rotas utilitárias/gerais são registradas em `src/apis/_general`. Verifique `/api-docs` para endpoints disponíveis (ex.: status).

## Cron Jobs
Agendamentos são inicializados quando `NODE_ENV !== 'development'` através de `src/cronjobs`.

## Deploy
- Configure `.env` no ambiente.
- Rode `yarn build` e use `yarn start` ou PM2 com `ecosystem.config.js`.
- Ajuste `instances`, `PORT` e logs conforme necessidade.

## Licença
ISC
