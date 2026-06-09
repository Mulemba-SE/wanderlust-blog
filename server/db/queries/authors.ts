import { pool } from "../client";
import { Author } from "../../../shared/types/post";

function rowToAuthor(row: Record<string, unknown>): Author {
  return {
    id:     row.id     as string,
    name:   row.name   as string,
    avatar: row.avatar as string,
    bio:    row.bio    as string,
  };
}

export async function getAllAuthors(): Promise<Author[]> {
  const { rows } = await pool.query(
    `SELECT id, name, avatar, bio FROM authors ORDER BY name ASC`
  );
  return rows.map(rowToAuthor);
}
