import { ReportRepository } from '../repositories/report.repository'
import { MatchRepository } from '../repositories/match.repository'
import { UserRepository } from '../repositories/user.repository'
import { EmailService } from '../services/email.service'
import { Report } from '../types/report.types'

const MATCH_RADIUS_KM = 50

export class MatchUseCase {
  constructor(
    private reportRepo: ReportRepository,
    private matchRepo: MatchRepository,
    private userRepo: UserRepository = new UserRepository(),
    private emailService: EmailService = new EmailService()
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

      const saved = await this.matchRepo.create(lostId, foundId)
      if (!saved) continue

      const lostReport  = newReport.type === 'lost' ? newReport : match
      const foundReport = newReport.type === 'found' ? newReport : match

      if (!lostReport.user_id) continue

      const user = await this.userRepo.findById(lostReport.user_id)
      if (!user) continue

      await this.emailService.sendMatchNotification({
        toEmail:      user.email,
        toName:       user.name,
        lostSpecies:  lostReport.species,
        foundAddress: `${foundReport.latitude}, ${foundReport.longitude}`,
        foundPhone:   foundReport.contact_phone,
      }).catch(console.error)
    }
  }
}