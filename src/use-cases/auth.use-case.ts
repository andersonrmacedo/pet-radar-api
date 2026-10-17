import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRepository } from '../repositories/user.repository'

export class AuthUseCase {
  private repository = new UserRepository()

  async register(name: string, email: string, password: string) {
    const existing = await this.repository.findByEmail(email)
    if (existing) throw new Error('Email já cadastrado')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await this.repository.create(name, email, passwordHash)

    return { id: user.id, name: user.name, email: user.email }
  }

  async login(email: string, password: string) {
    const user = await this.repository.findByEmail(email)
    if (!user) throw new Error('Credenciais inválidas')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new Error('Credenciais inválidas')

    const token = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return { token, user: { id: user.id, name: user.name, email: user.email } }
  }
}