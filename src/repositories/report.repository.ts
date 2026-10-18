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
        photo_url, name, location,
        contact_name, contact_phone, contact_email, occurred_at, user_id
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, ST_MakePoint($8, $9)::geography,
        $10, $11, $12, $13, $14
      ) RETURNING
        id, type, species, size, color, description,
        photo_url, name, status,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        contact_name, contact_phone, contact_email,
        occurred_at, created_at, user_id`,
      [
        data.type, data.species, data.size, data.color, data.description ?? null,
        data.photo_url ?? null, data.name ?? null, data.longitude, data.latitude,
        data.contact_name, data.contact_phone, data.contact_email ?? null,
        data.occurred_at, data.user_id ?? null,
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

  async findNearby(lat: number, lng: number, radiusInMeters: number): Promise<Report[]> {
    const result = await pool.query<Report>(`
      SELECT
        id, type, species, size, color, description, photo_url, name,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        status, contact_name, contact_phone, contact_email,
        occurred_at, created_at
      FROM reports
      WHERE ST_DWithin(
        location,
        ST_MakePoint($2, $1)::geography,
        $3
      )
      AND status = 'active'
      ORDER BY created_at DESC
    `, [lat, lng, radiusInMeters])

    return result.rows
  }

  async findByUserId(userId: string): Promise<Report[]> {
    const result = await pool.query<Report>(`
      SELECT
        id, type, species, size, color, description,
        photo_url, name, status,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude,
        contact_name, contact_phone, contact_email,
        occurred_at, created_at, user_id
      FROM reports
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId])
    return result.rows
  }
}