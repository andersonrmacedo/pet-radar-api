import { Request, Response } from "express";
import { AuthUseCase } from "../use-cases/auth.use-case";
import { UserRepository } from "../repositories/user.repository";
import { registerSchema, loginSchema } from "../validators/auth.validator";

export class AuthController {
  private useCase = new AuthUseCase();
  private userRepo = new UserRepository();

  async register(req: Request, res: Response): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Dados inválidos",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    try {
      const { name, email, password } = parsed.data;
      const user = await this.useCase.register(name, email, password);
      res.status(201).json(user);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "Email já cadastrado") {
        res.status(409).json({ message: "Email já cadastrado" });
        return;
      }

      const message = err instanceof Error ? err.message : "Erro interno";
      res.status(500).json({ message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Dados inválidos" });
      return;
    }

    try {
      const { email, password } = parsed.data;
      const { token, user } = await this.useCase.login(email, password);
      res.json({ token, user });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro interno";
      res.status(401).json({ message });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie("token");
    res.json({ message: "Logout realizado" });
  }

  async me(req: Request, res: Response): Promise<void> {
    const user = await this.userRepo.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  }
}
