import { ReportRepository } from '../repositories/report.repository'
import { UploadService } from '../services/upload.service'
import { CreateReportInput } from '../validators/report.validator'
import { Report } from '../types/report.types'

interface CreateReportRequest extends CreateReportInput {
  file?: Express.Multer.File
}

export class CreateReportUseCase {
  constructor(
    private reportRepository: ReportRepository,
    private uploadService: UploadService
  ) {}

  async execute(data: CreateReportRequest): Promise<Report> {
    let photo_url: string | undefined

    if (data.file) {
      photo_url = await this.uploadService.uploadPhoto(
        data.file.buffer,
        data.file.mimetype
      )
    }

    return this.reportRepository.create({ ...data, photo_url })
  }

  async findNearby(lat: number, lng: number, radiusKm: number): Promise<Report[]> {
    const radiusInMeters = radiusKm * 1000
    return this.reportRepository.findNearby(lat, lng, radiusInMeters)
  }
}