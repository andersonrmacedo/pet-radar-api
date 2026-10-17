import { describe, it, expect } from 'vitest'
import { createReportSchema } from '../validators/report.validator'

describe('createReportSchema', () => {
  const validData = {
    type: 'lost',
    species: 'dog',
    size: 'medium',
    color: 'caramelo',
    latitude: '-23.5505',
    longitude: '-46.6333',
    contact_name: 'Anderson',
    contact_phone: '11999999999',
    occurred_at: '2026-10-17T10:00:00.000Z',
  }

  it('should validate a valid report', () => {
    const result = createReportSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid type', () => {
    const result = createReportSchema.safeParse({ ...validData, type: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid species', () => {
    const result = createReportSchema.safeParse({ ...validData, species: 'bird' })
    expect(result.success).toBe(false)
  })

  it('should reject missing contact_name', () => {
    const result = createReportSchema.safeParse({ ...validData, contact_name: '' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const result = createReportSchema.safeParse({ ...validData, contact_email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('should trim whitespace from enum fields', () => {
    const result = createReportSchema.safeParse({ ...validData, size: ' medium ' })
    expect(result.success).toBe(true)
  })
})