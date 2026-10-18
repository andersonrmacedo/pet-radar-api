import { describe, it, expect } from 'vitest'
import { registerSchema, loginSchema } from '../validators/auth.validator'

describe('registerSchema', () => {
  it('aceita dados válidos', () => {
    const result = registerSchema.safeParse({
      name: 'Anderson',
      email: 'anderson@email.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita email inválido', () => {
    const result = registerSchema.safeParse({
      name: 'Anderson',
      email: 'not-an-email',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita senha muito curta', () => {
    const result = registerSchema.safeParse({
      name: 'Anderson',
      email: 'anderson@email.com',
      password: '123',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita nome vazio', () => {
    const result = registerSchema.safeParse({
      name: '',
      email: 'anderson@email.com',
      password: '123456',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('aceita dados válidos', () => {
    const result = loginSchema.safeParse({
      email: 'anderson@email.com',
      password: '123456',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita sem email', () => {
    const result = loginSchema.safeParse({ password: '123456' })
    expect(result.success).toBe(false)
  })
})