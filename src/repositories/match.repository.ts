import { pool } from '../database/client'
import { Match } from '../types/match.types'

export class MatchRepository {
  async create(lostReportId: string, foundReportId: string): Promise<Match> {
    const result = await pool.query<Match>(
      `INSERT INTO matches (lost_report_id, found_report_id)
       VALUES ($1, $2)
       ON CONFLICT ON CONSTRAINT unique_match DO NOTHING
       RETURNING *`,
      [lostReportId, foundReportId]
    )
    return result.rows[0]
  }

  async findByReportId(reportId: string): Promise<Match[]> {
    const result = await pool.query<Match>(
      `SELECT * FROM matches
       WHERE lost_report_id = $1 OR found_report_id = $1`,
      [reportId]
    )
    return result.rows
  }
}