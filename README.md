# Finanças App

Controle financeiro pessoal — monolito Java (Spring Boot) + Angular, empacotado em um único JAR.

## Estrutura

```
financas-app/
├── backend/     Spring Boot 3.5 / Java 17
├── frontend/     (a criar com `ng new`)
└── docker-compose.yml   MySQL local
```

## Passo a passo para rodar

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

3. Criar o projeto Angular (ainda não criado neste scaffold):
   ```
   cd frontend
   npx @angular/cli new . --routing --style=scss --skip-git
   ```

4. Build completo (Angular -> static do Spring -> JAR):
   ```
   cd frontend && ng build --configuration production
   cp -r dist/frontend/browser/* ../backend/src/main/resources/static/
   cd ../backend && mvn clean package
   java -jar target/financas-app.jar
   ```

## Próximos passos de desenvolvimento

- Entidades JPA + repositories para: Cartao, Categoria, Compra, Parcela, GastoRecorrente, LancamentoRecorrente, Receita, GastoCompartilhado
- Service de geração automática de parcelas (considerando dia de fechamento do cartão)
- Endpoints REST (CRUD de cada entidade)
- Endpoint agregado `GET /api/resumo/{ano}/{mes}`
- Módulos Angular correspondentes + tela de resumo mensal
