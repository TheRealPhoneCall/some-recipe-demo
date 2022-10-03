import multer, { FileFilterCallback } from 'multer'
import { Request, Response, NextFunction } from 'express'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback): void => {
    cb(null, './uploads/')
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback): void => {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  },
  fileFilter
})