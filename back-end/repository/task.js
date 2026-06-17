export class TaskRepository {
  constructor(database) {
    this.database = database;
  }

  async getTasks(status, projectId) {
    try {
      // Filtra dinamicamente por status e/ou projectId.
      // Se não for passado qualquer um dos filtros, retorna tudo.
      const sql = `
        SELECT t.id, t.project_id, t.title, t.description, t.status, t.priority, t.created_at,
               p.name AS project_name
        FROM tasks t
        INNER JOIN projects p ON p.id = t.project_id
        WHERE ($1::VARCHAR IS NULL OR t.status = $1)
          AND ($2::INT IS NULL OR t.project_id = $2)
        ORDER BY t.created_at
      `;

      const result = await this.database.query(sql, [
        status || null,
        projectId || null,
      ]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async createTask(data) {
    try {
      const sql = `
        INSERT INTO tasks (project_id, title, description, priority)
        VALUES ($1, $2, $3, $4)
        RETURNING id, project_id, title, description, status, priority, created_at
      `;
      const result = await this.database.query(sql, [
        data.project_id,
        data.title,
        data.description || null,
        data.priority || "medium",
      ]);
      return result.rows[0];
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async updateTask(id, data) {
    // Em casos de PATCH, apenas os dados passados são atualizados.
    // Os outros dados permanecem como já estavam no banco.
    try {
      const sql = `
        UPDATE tasks
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            priority = COALESCE($4, priority)
        WHERE id = $5
        RETURNING id, project_id, title, description, status, priority, created_at
      `;
      const result = await this.database.query(sql, [
        data.title ?? null,
        data.description ?? null,
        data.status ?? null,
        data.priority ?? null,
        id,
      ]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async deleteTask(id) {
    try {
      const sql = "DELETE FROM tasks WHERE id = $1 RETURNING id";
      const result = await this.database.query(sql, [id]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }
}
