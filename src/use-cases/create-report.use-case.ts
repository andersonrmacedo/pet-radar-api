import { ReportRepository, CreateReportDTO } from '../repositories/report.repository'
import { Report } from '../types/report.types'

export class CreateReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(data: CreateReportDTO): Promise<Report> {
    return this.reportRepository.create(data)
  }
}