import { ReportRepository } from '../repositories/report.repository'
import { MatchRepository } from '../repositories/match.repository'
import { Report } from '../types/report.types'

const MATCH_RADIUS_KM = 50

export class MatchUseCase {
  constructor(
    private reportRepo: ReportRepository,
    private matchRepo: MatchRepository
  ) {}

  async findAndSaveMatches(newReport: Report): Promise<void> {
    const oppositeType = newReport.type === 'lost' ? 'found' : 'lost'

    const candidates = await this.reportRepo.findNearby(
      newReport.latitude,
      newReport.longitude,
      MATCH_RADIUS_KM * 1000
    )

    const matches = candidates.filter(
      (r) => r.type === oppositeType && r.species === newReport.species
    )

    for (const match of matches) {
      const lostId  = newReport.type === 'lost' ? newReport.id : match.id
      const foundId = newReport.type === 'found' ? newReport.id : match.id
      await this.matchRepo.create(lostId, foundId)
    }
  }
}