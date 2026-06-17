CREATE DATABASE taskboard; -- Crie o banco de dados separadamente

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'todo',
  priority VARCHAR(10) NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  project_id INT NOT NULL REFERENCES projects(id) ON DELETE CASCADE
);

INSERT INTO projects (name, description) VALUES
  ('Trabalho WEB 1', 'Projeto full stack IFCE'),
  ('Pessoal', 'Tarefas do dia a dia');

INSERT INTO tasks (project_id, title, description, status, priority) VALUES
  (1, 'Criar banco de dados', 'Executar schema.sql no PostgreSQL', 'done', 'high'),
  (1, 'Implementar API', 'Rotas, controller e repository', 'doing', 'high'),
  (1, 'Estilizar frontend', 'Layout Kanban responsivo', 'todo', 'medium'),
  (2, 'Estudar para a prova do Marlos', 'Conteúdo: Estrutura de dados Árvore', 'todo', 'high');
