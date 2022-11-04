import { NextFunction, Request, Response } from "express"
import mongoose from 'mongoose'
import logging from "../../config/logging"
import File from './model'
import makeRestControllers from '../../factories/rest-controllers'
import fs from 'fs'

const NAMESPACE = 'Files'

const {
  getDocs,
} = makeRestControllers({
  namespace: NAMESPACE,
  docName: 'file',
  colName: 'files',
  doc: File
})

const addDoc = async (req: Request, res: Response, next: NextFunction) => {
  const { name, type, uploader, filterType, filterId } = req.body
  console.log(req.file)
  const newFile = new File({
    ...req.payload,
    _id: new mongoose.Types.ObjectId(),
    path: req.file?.path
  })

  try {
    const file = await newFile.save()
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
    const file = await File.findById(req.params.id)
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

