import cron from 'node-cron'
import { pool } from '../database/client'

export function startExpireReportsJob() {
  cron.schedule('0 0 * * *', async () => {
    console.log('[cron] Expirando reports antigos...')

    const result = await pool.query(`
      UPDATE reports
      SET status = 'expired'
      WHERE status = 'active'
        AND occurred_at < NOW() - INTERVAL '30 days'
    `)

    console.log(`[cron] ${result.rowCount} reports expirados.`)
  })
}
