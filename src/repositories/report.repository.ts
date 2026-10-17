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
        photo_url, name, location,
        contact_name, contact_phone, contact_email, occurred_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, ST_MakePoint($8, $9)::geography,
        $10, $11, $12, $13
      ) RETURNING
        id, type, species, size, color, description,
        photo_url, name, status,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        contact_name, contact_phone, contact_email,
        occurred_at, created_at`,
      [
        data.type, data.species, data.size, data.color, data.description ?? null,
        data.photo_url ?? null, data.name ?? null, data.longitude, data.latitude,
        data.contact_name, data.contact_phone, data.contact_email ?? null, data.occurred_at,
      ]
    )
    return result.rows[0]
  }

  async findAll(): Promise<Report[]> {
    const result = await pool.query<Report>(`
      SELECT
        id, type, species, size, color, description,
        photo_url, name, status,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        contact_name, contact_phone, contact_email,
        occurred_at, created_at
      FROM reports
      WHERE status = 'active'
      ORDER BY created_at DESC
    `)
    return result.rows
  }

  async findById(id: string): Promise<Report | null> {
    const result = await pool.query<Report>(`
      SELECT
        id, type, species, size, color, description,
        photo_url, name, status,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        contact_name, contact_phone, contact_email,
        occurred_at, created_at
      FROM reports
      WHERE id = $1
    `, [id])
    return result.rows[0] ?? null
  }
}