import { ReportRepository } from '../repositories/report.repository'
import { UploadService } from '../services/upload.service'
import { CreateReportInput } from '../validators/report.validator'
import { Report } from '../types/report.types'
import { MatchUseCase } from './match.use-case'
import { MatchRepository } from '../repositories/match.repository'

interface CreateReportRequest extends CreateReportInput {
  file?: Express.Multer.File
  user_id?: string
}

export class CreateReportUseCase {
  constructor(
    private reportRepository: ReportRepository,
    private uploadService: UploadService,    
  ) {}

  async execute(data: CreateReportRequest): Promise<Report> {
    let photo_url: string | undefined

    if (data.file) {
      photo_url = await this.uploadService.uploadPhoto(
        data.file.buffer,
        data.file.mimetype
      )
    }

    const report = await this.reportRepository.create({ ...data, photo_url })

    const matchUseCase = new MatchUseCase(this.reportRepository, new MatchRepository())
    matchUseCase.findAndSaveMatches(report).catch(console.error)

    return report
  }

  async findNearby(lat: number, lng: number, radiusKm: number): Promise<Report[]> {
    const radiusInMeters = radiusKm * 1000
    return this.reportRepository.findNearby(lat, lng, radiusInMeters)
  }
}