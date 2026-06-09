import { pool } from "../client";
function rowToAuthor(row) {
    return {
        id: row.id,
        name: row.name,
        avatar: row.avatar,
        bio: row.bio,
    };
}
export async function getAllAuthors() {
    const { rows } = await pool.query(`SELECT id, name, avatar, bio FROM authors ORDER BY name ASC`);
    return rows.map(rowToAuthor);
}
