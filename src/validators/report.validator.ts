import { z } from 'zod'

export const createReportSchema = z.object({
  type:          z.string().trim().pipe(z.enum(['lost', 'found'])),
  species:       z.string().trim().pipe(z.enum(['dog', 'cat', 'other'])),
  size:          z.string().trim().pipe(z.enum(['small', 'medium', 'large'])),
  color:         z.string().min(2).max(100),
  description:   z.string().max(1000).optional(),
  name:          z.string().max(100).optional(),
  latitude:      z.coerce.number().min(-90).max(90),
  longitude:     z.coerce.number().min(-180).max(180),
  contact_name:  z.string().min(2).max(200),
  contact_phone: z.string().min(8).max(50),
  contact_email: z.string().email().optional(),
  occurred_at:   z.coerce.date(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>