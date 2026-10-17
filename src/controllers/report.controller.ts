import { Request, Response } from "express";
import { ReportRepository } from "../repositories/report.repository";
import { CreateReportUseCase } from "../use-cases/create-report.use-case";

const reportRepository = new ReportRepository();

export class ReportController {
  async create(req: Request, res: Response) {
    try {
      const useCase = new CreateReportUseCase(reportRepository);
      const report = await useCase.execute(req.body);
      return res.status(201).json(report);
    } catch (error) {
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
