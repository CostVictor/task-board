export class TaskRepository {
  constructor(database) {
    this.database = database;
  }

  async getTasks(projectId) {
    try {
      const sql = `
        SELECT id, title, description, status, priority
        FROM tasks
        WHERE project_id = $1
        ORDER BY created_at
      `;

      const result = await this.database.query(sql, [projectId]);
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
        RETURNING id, title, description, status, priority
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

  async updateTask(id, status) {
    try {
      const sql = `
        UPDATE tasks
        SET status = $1
        WHERE id = $2
        RETURNING id, title, description, status, priority
      `;
      const result = await this.database.query(sql, [status, id]);
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
