import { Resend } from 'resend'

export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY)

  async sendMatchNotification(params: {
    toEmail:      string
    toName:       string
    lostSpecies:  string
    foundAddress: string
    foundPhone:   string
  }): Promise<void> {
    await this.resend.emails.send({
      from:    'Pet Radar <onboarding@resend.dev>',
      to:      params.toEmail,
      subject: '🐾 Possível match encontrado no Pet Radar!',
      html: `
  <h2>Olá, ${params.toName}!</h2>
  <p>Encontramos um animal <strong>${params.lostSpecies}</strong> 
  que pode ser o seu pet perdido.</p>
  <p>📍 <strong>Localização aproximada:</strong> 
  <a href="https://www.google.com/maps?q=${params.foundAddress}">
    Ver no Google Maps
  </a></p>
  <p>📞 <strong>Contato:</strong> ${params.foundPhone}</p>
  <p>Acesse o <a href="http://localhost:3000/map">Pet Radar</a> para ver no mapa.</p>
`,
    })
  }
}