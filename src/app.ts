import express from "express";
import cors from "cors";
import reportRoutes from "./routes/report.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", reportRoutes);
app.use("/api", authRoutes);

export default app;
