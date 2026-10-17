import { cloudinary } from '../config/cloudinary'

export class UploadService {
  async uploadPhoto(fileBuffer: Buffer, mimeType: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const base64 = fileBuffer.toString('base64')
      const dataUri = `data:${mimeType};base64,${base64}`

      cloudinary.uploader.upload(
        dataUri,
        { folder: 'pet-radar', resource_type: 'image' },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result.secure_url)
        }
      )
    })
  }
}