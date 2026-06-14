export class ProjectRepository {
  constructor(database) {
    this.database = database;
  }

  async getProjects() {
    try {
      const sql = `
        SELECT p.id, p.name, p.description,
               COUNT(t.id)::INT AS task_count
        FROM projects p
        LEFT JOIN tasks t ON t.project_id = p.id
        GROUP BY p.id, p.name, p.description
        ORDER BY p.id
      `;
      const result = await this.database.query(sql);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async getProjectById(id) {
    try {
      const sql = `
        SELECT p.id, p.name, p.description,
               COUNT(t.id)::INT AS task_count
        FROM projects p
        LEFT JOIN tasks t ON t.project_id = p.id
        WHERE p.id = $1
        GROUP BY p.id, p.name, p.description
      `;
      const result = await this.database.query(sql, [id]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async createProject(data) {
    try {
      const sql = `
        INSERT INTO projects (name, description)
        VALUES ($1, $2)
        RETURNING id, name, description
      `;
      const result = await this.database.query(sql, [
        data.name,
        data.description || null,
      ]);
      return result.rows[0];
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async updateProject(id, data) {
    try {
      // Em casos de PATCH, apenas os dados passados são atualizados.
      // Os outros dados permanecem como já estavam no banco.
      const sql = `
        UPDATE projects
        SET name = COALESCE($1, name),
            description = COALESCE($2, description)
        WHERE id = $3
        RETURNING id, name, description
      `;
      const result = await this.database.query(sql, [
        data.name ?? null,
        data.description ?? null,
        id,
      ]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }

  async deleteProject(id) {
    try {
      const sql = "DELETE FROM projects WHERE id = $1 RETURNING id";
      const result = await this.database.query(sql, [id]);
      return result.rows;
    } catch (erro) {
      return { error: erro.message };
    }
  }
}
