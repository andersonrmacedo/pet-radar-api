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
}
