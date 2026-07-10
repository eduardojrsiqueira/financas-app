# Finanças App

Controle financeiro pessoal — monolito Java (Spring Boot) + Angular, empacotado em um único JAR.

## Estrutura

```
financas-app/
├── backend/     Spring Boot 3.5 / Java 17
├── frontend/    Angular 16
├── Dockerfile   Build multi-stage (frontend -> backend -> runtime), usado no deploy
└── docker-compose.yml   MySQL local
```

## Passo a passo para rodar localmente

1. Subir o banco:
   ```
   docker compose up -d
   ```

2. Rodar o backend (ele aplica as migrations do Flyway automaticamente ao subir):
   ```
   cd backend
   mvn spring-boot:run
   ```
   A API sobe em `http://localhost:8080`.

3. Rodar o frontend em modo dev (proxy para a API em `localhost:8080`):
   ```
   cd frontend
   npm install
   npm start
   ```
   Acesse em `http://localhost:4200`.

4. Build completo manual (Angular -> static do Spring -> JAR), sem Docker:
   ```
   cd frontend && npx ng build --configuration production
   cp -r dist/frontend/* ../backend/src/main/resources/static/
   cd ../backend && mvn clean package
   java -jar target/financas-app.jar
   ```

## Build via Docker

O `Dockerfile` na raiz faz o build completo em 3 estágios (Node builda o Angular, Maven builda o JAR com o Angular embutido como recurso estático, e a imagem final só tem o JRE). Rode a partir da raiz do projeto (o build precisa enxergar `backend/` e `frontend/`):

```
docker build -t financas-app .
docker run -p 8080:8080 \
  -e MYSQLHOST=host.docker.internal \
  -e MYSQLPORT=3306 \
  -e MYSQLDATABASE=financas \
  -e MYSQLUSER=financas \
  -e MYSQLPASSWORD=financas \
  -e APP_JWT_SECRET=troque-por-um-segredo-proprio \
  financas-app
```

## Deploy no Railway

O projeto já está preparado para deploy via Dockerfile (`railway.json` na raiz aponta o builder para o `Dockerfile`).

1. No Railway, crie um projeto a partir do repositório GitHub `financas-app`. **Não** configure um "Root Directory" — o build precisa da raiz do repo, pois o `Dockerfile` usa tanto `backend/` quanto `frontend/`.
2. Adicione um serviço de **MySQL** (plugin do próprio Railway) ao projeto.
3. No serviço da aplicação, referencie as variáveis do MySQL (Railway faz isso automaticamente ao linkar os serviços, ou você referencia manualmente em Variables):
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`
4. Defina a variável `APP_JWT_SECRET` com um valor próprio e secreto (não reutilize o valor padrão do `application.yml`, que está no histórico do repositório).
5. O Railway injeta `PORT` automaticamente — o `application.yml` já lê `server.port` a partir dela.
6. Deploy. O Flyway aplica as migrations automaticamente na subida, incluindo a criação do usuário inicial (login `eduardo`, senha `123456` — troque-a assim que acessar).
7. Health check: `/actuator/health` (já configurado em `railway.json`).

## Próximos passos de desenvolvimento

- Endpoint agregado `GET /api/resumo/{ano}/{mes}` (hoje o dashboard agrega no client)
