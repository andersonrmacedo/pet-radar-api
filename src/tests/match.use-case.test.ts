import { describe, it, expect, vi } from 'vitest'
import { MatchUseCase } from '../use-cases/match.use-case'
import type { Report } from '../types/report.types'

const makeReport = (overrides: Partial<Report> = {}): Report => ({
  id:            'report-1',
  type:          'lost',
  species:       'dog',
  size:          'medium',
  color:         'caramelo',
  description:   null,
  photo_url:     null,
  name:          null,
  latitude:      -23.55,
  longitude:     -46.63,
  status:        'active',
  contact_name:  'Anderson',
  contact_phone: '11999999999',
  contact_email: null,
  occurred_at:   new Date(),
  created_at:    new Date(),
  user_id:       null,
  ...overrides,
})

describe('MatchUseCase.findAndSaveMatches', () => {
  it('cria match quando encontra report do tipo oposto com mesma espécie', async () => {
    const foundReport = makeReport({ id: 'found-1', type: 'found' })
    const lostReport  = makeReport({ id: 'lost-1',  type: 'lost'  })

    const reportRepo = {
      findNearby: vi.fn().mockResolvedValue([foundReport]),
    }
    const matchRepo = {
      create: vi.fn().mockResolvedValue({ id: 'match-1' }),
    }
    const userRepo = {
      findById: vi.fn().mockResolvedValue(null),
    }
    const emailService = {
      sendMatchNotification: vi.fn(),
    }

    const useCase = new MatchUseCase(
      reportRepo as any,
      matchRepo as any,
      userRepo as any,
      emailService as any
    )

    await useCase.findAndSaveMatches(lostReport)

    expect(matchRepo.create).toHaveBeenCalledWith('lost-1', 'found-1')
  })

  it('não cria match para espécie diferente', async () => {
    const foundCat = makeReport({ id: 'found-cat', type: 'found', species: 'cat' })
    const lostDog  = makeReport({ id: 'lost-dog',  type: 'lost',  species: 'dog' })

    const reportRepo   = { findNearby: vi.fn().mockResolvedValue([foundCat]) }
    const matchRepo    = { create: vi.fn() }
    const userRepo     = { findById: vi.fn() }
    const emailService = { sendMatchNotification: vi.fn() }

    const useCase = new MatchUseCase(
      reportRepo as any,
      matchRepo as any,
      userRepo as any,
      emailService as any
    )

    await useCase.findAndSaveMatches(lostDog)

    expect(matchRepo.create).not.toHaveBeenCalled()
  })
})