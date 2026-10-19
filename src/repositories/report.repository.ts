import { pool } from '../database/client'
import { Report, ReportType, AnimalSpecies, AnimalSize } from '../types/report.types'

export interface CreateReportDTO {
  type:          ReportType
  species:       AnimalSpecies
  size:          AnimalSize
  color:         string
  description?:  string
  photo_url?:    string
  name?:         string
  user_id?:      string
  latitude:      number
  longitude:     number
  contact_name:  string
  contact_phone: string
  contact_email?: string
  occurred_at:   Date
}

export class ReportRepository {
  async create(data: CreateReportDTO): Promise<Report> {
    const result = await pool.query<Report>(
      `INSERT INTO reports (
        type, species, size, color, description,
        photo_url, name, latitude, longitude,
        contact_name, contact_phone, contact_email, occurred_at, user_id
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12, $13, $14
      ) RETURNING *`,
      [
        data.type, data.species, data.size, data.color, data.description ?? null,
        data.photo_url ?? null, data.name ?? null, data.latitude, data.longitude,
        data.contact_name, data.contact_phone, data.contact_email ?? null,
        data.occurred_at, data.user_id ?? null,
      ]
    )
    return result.rows[0]
  }

  async findAll(): Promise<Report[]> {
    const result = await pool.query<Report>(`
      SELECT * FROM reports
      WHERE status = 'active'
      ORDER BY created_at DESC
    `)
    return result.rows
  }

  async findById(id: string): Promise<Report | null> {
    const result = await pool.query<Report>(`SELECT * FROM reports WHERE id = $1`, [id])
    return result.rows[0] ?? null
  }

  async findNearby(latitude: number, longitude: number, radiusMeters: number): Promise<Report[]> {
    const radiusKm = radiusMeters / 1000
    const result = await pool.query(
      `SELECT *,
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance_km
       FROM reports
       WHERE (
         6371 * acos(
           cos(radians($1)) * cos(radians(latitude)) *
           cos(radians(longitude) - radians($2)) +
           sin(radians($1)) * sin(radians(latitude))
         )
       ) <= $3
       AND status = 'active'
       ORDER BY distance_km`,
      [latitude, longitude, radiusKm]
    )
    return result.rows
  }

  async findByUserId(userId: string): Promise<Report[]> {
    const result = await pool.query<Report>(`
      SELECT * FROM reports
      WHERE user_id = $1
      AND status = 'active'
      ORDER BY created_at DESC
    `, [userId])
    return result.rows
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await pool.query(`UPDATE reports SET status = $1 WHERE id = $2`, [status, id])
  }
}