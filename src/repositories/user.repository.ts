import { pool } from '../database/client'
import { User } from '../types/user.types'

export class UserRepository {
  async create(name: string, email: string, passwordHash: string): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, passwordHash]
    )
    return result.rows[0]
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0] ?? null
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] ?? null
  }
}