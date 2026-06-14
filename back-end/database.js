import { Pool } from "pg";

const URL = "postgresql://postgres:123@localhost:5432/taskboard";

export const database = new Pool({
  connectionString: URL,
});
