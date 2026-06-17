# TaskBoard

Quadro Kanban de tarefas desenvolvido como trabalho full stack da disciplina **WEB 1** (IFCE). A aplicação organiza tarefas em projetos e acompanha o progresso em três colunas: **A Fazer**, **Fazendo** e **Concluído**.

## Capturas de tela

| Visão geral | Quadro com tarefas |
|-------------|-------------------|
| ![Tela inicial do TaskBoard](images/image1.png) | ![Quadro Kanban com tarefas](images/image2.png) |

## Funcionalidades

- **Projetos** — criar, editar, excluir e buscar projetos na barra lateral
- **Tarefas** — adicionar tarefas com título, descrição e prioridade (baixa, média ou alta)
- **Quadro Kanban** — mover tarefas entre colunas com ações de iniciar, concluir, voltar e reabrir
- **Resumo** — contadores visuais de tarefas por status
- **Interface responsiva** — menu lateral adaptável para telas menores

## Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| Frontend | HTML, CSS e JavaScript (ES Modules) |
| Backend | Node.js, Express 5 |
| Banco de dados | PostgreSQL |

## Estrutura do projeto

```
task-board/
├── back-end/               # API REST
│   ├── controller/         # Regras de requisição e resposta
│   ├── repository/         # Acesso ao banco de dados
│   ├── routes/             # Rotas da API
│   ├── app.js              # Configuração do Express
│   ├── database.js         # Conexão com o PostgreSQL
│   └── index.js            # Ponto de entrada do servidor
├── front-end/              # Interface do usuário
│   ├── css/                # Estilos modulares
│   ├── js/                 # Lógica da aplicação
│   ├── index.html
│   └── main.js
├── db/
│   ├── create-database.sql # Criação do banco de dados
│   └── schema.sql          # Tabelas e dados iniciais
└── images/                 # Capturas de tela
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) em execução localmente
- Cliente `psql` disponível no terminal

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/CostVictor/task-board.git
cd task-board
```

### 2. Configurar o banco de dados

Os scripts SQL ficam em `db/` e devem ser executados **nesta ordem**:

**Passo 1 — Criar o banco**

Conecte-se ao PostgreSQL e execute apenas `db/create-database.sql`:

```bash
psql -U postgres -f db/create-database.sql
```

**Passo 2 — Criar tabelas e dados iniciais**

Com o banco `taskboard` criado, execute `db/schema.sql`:

```bash
psql -U postgres -d taskboard -f db/schema.sql
```

O segundo script cria as tabelas `projects` e `tasks` e insere dados de exemplo.

### 3. Configurar a conexão com o banco

A string de conexão padrão está em `back-end/database.js`:

```
postgresql://postgres:123@localhost:5432/taskboard
```

Ajuste usuário, senha, host e porta conforme o seu ambiente local.

### 4. Instalar dependências e iniciar o backend

Na raiz do projeto:

```bash
npm install
npm start
```

O servidor ficará disponível em `http://localhost:8080`.

### 5. Abrir o frontend

O frontend usa ES Modules e precisa ser servido por um servidor HTTP local. Abrir `index.html` diretamente no navegador não funciona corretamente.

Opções:

```bash
# Extensão Live Server do VS Code — abra front-end/index.html
# Ou via npx:
npx serve front-end
```

A URL da API está definida em `front-end/js/config.js` (`http://localhost:8080`). Certifique-se de que o backend esteja em execução antes de usar a interface.

## API REST

Base URL: `http://localhost:8080`

### Projetos — `/projects`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/projects` | Lista todos os projetos |
| `POST` | `/projects` | Cria um projeto |
| `PATCH` | `/projects/:id` | Atualiza um projeto |
| `DELETE` | `/projects/:id` | Remove um projeto |

Corpo para criar ou atualizar:

```json
{
  "name": "Nome do projeto",
  "description": "Descrição opcional"
}
```

### Tarefas — `/tasks`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/tasks?project_id=1` | Lista tarefas de um projeto |
| `POST` | `/tasks` | Cria uma tarefa |
| `PATCH` | `/tasks/:id` | Atualiza o status de uma tarefa |
| `DELETE` | `/tasks/:id` | Remove uma tarefa |

Corpo para criar:

```json
{
  "project_id": 1,
  "title": "Título da tarefa",
  "description": "Descrição opcional",
  "priority": "medium"
}
```

Corpo para atualizar status:

```json
{
  "status": "doing"
}
```

Valores aceitos:

| Campo | Valores |
|-------|---------|
| `status` | `todo`, `doing`, `done` |
| `priority` | `low`, `medium`, `high` |

## Autor

Victor Gabriel — IFCE, WEB 1
