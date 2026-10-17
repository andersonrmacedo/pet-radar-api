import { Request, Response } from "express";
import { ReportRepository } from "../repositories/report.repository";
import { UploadService } from "../services/upload.service";
import { CreateReportUseCase } from "../use-cases/create-report.use-case";
import { createReportSchema } from "../validators/report.validator";
import { ZodError } from "zod";

const reportRepository = new ReportRepository();
const uploadService = new UploadService();

export class ReportController {
  async create(req: Request, res: Response) {
    try {
      const parsed = createReportSchema.parse(req.body);

      const useCase = new CreateReportUseCase(reportRepository, uploadService);
      const report = await useCase.execute({
        ...parsed,
        file: req.file,
        user_id: req.user?.id,
      });

      return res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: error.flatten().fieldErrors,
        });
      }
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async findAll(_req: Request, res: Response) {
    try {
      const reports = await reportRepository.findAll();
      return res.json(reports);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async findById(req: Request<{ id: string }>, res: Response) {
    try {
      const report = await reportRepository.findById(req.params.id);

      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      return res.json(report);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async findNearby(req: Request, res: Response): Promise<void> {
    const lat = parseFloat(req.query.lat as string)
    const lng = parseFloat(req.query.lng as string)
    const radius = parseFloat(req.query.radius as string) || 10

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ message: 'lat e lng são obrigatórios' })
      return
    }

    const reports = await reportRepository.findNearby(lat, lng, radius * 1000)
    res.json(reports)
  }
}
