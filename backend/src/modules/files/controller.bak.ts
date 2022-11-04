import { NextFunction, Request, Response } from "express";
import logging from "../../config/logging";
import bcryptjs from 'bcryptjs'
import mongoose from 'mongoose'
import Upload from './model'
import IUpload from './model'
import fs from 'fs'


const NAMESPACE = "Upload"

const getUploads = async (req: Request, res: Response, next: NextFunction) => {
  const uploads = await Upload.find()
  return res.status(200).json({
    message: uploads.length
      ? `All ${uploads.length} uploads retrieved`
      : 'Uploads collection is empty',
    uploads
  })
}

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { name, type, uploader, filterType, filterId } = req.body
  console.log(req.file)
  const newUpload = new Upload({
    _id: new mongoose.Types.ObjectId(),
    name, type, uploader, filterType, filterId,
    path: req.file?.path
  })

  try {
    const file = await newUpload.save()
    return res.status(201).json({
      message: `New ${type} uploaded.`,
      file
    })
  } catch (error) {
    logging.error(NAMESPACE, error.message, error)
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = await Upload.findById(req.params.id)
    // delete file
    if (file) {
      await fs.unlink(file?.path as string, (error) => {
        if (error) {
          return res.status(500).json({
            message: `Failed to delete file ${file?.path}`,
            error
          })
        }
        // if no error, file is removed.
      })
      await file.remove()
      return res.status(500).json({
        message: `File ${file?.path} has been removed.`
      })
    }
    return res.status(404).json({
      message: `File ${req.params.id} not found.`
    })
  } catch (error) {
    logging.error(NAMESPACE, error.message, error)
    return res.status(500).json({
      message: error.message,
      error
    })
  }
}

export default {
  getUploads,
  uploadFile,
  deleteFile,
}
