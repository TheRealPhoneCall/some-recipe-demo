import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../config/logging"
import Upload from './model'
import makeRestControllers from '../../factories/rest-controllers'
import fs from 'fs'

const NAMESPACE = 'Uploads'

const {
  getDocs,
} = makeRestControllers({
  namespace: NAMESPACE,
  docName: 'upload',
  colName: 'uploads',
  doc: Upload
})

const addDoc = async (req: Request, res: Response, next: NextFunction) => {
  const { name, type, uploader, filterType, filterId } = req.body
  console.log(req.file)
  const newUpload = new Upload({
    ...req.payload,
    _id: new mongoose.Types.ObjectId(),
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

const deleteDoc = async (req: Request, res: Response, next: NextFunction) => {
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
        message: `Uploaded file ${file?.path} has been removed.`
      })
    }
    return res.status(404).json({
      message: `Uploaded file ${req.params.id} not found.`
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
  addDoc,
  getDocs,
  deleteDoc,
}

