import { NextFunction, Request, Response } from "express";
import logging from "../config/logging";
import mongoose from 'mongoose'
import { capitalize } from '../utils/string-utils'

interface IMeta{
  namespace: string;
  docName: string;
  colName: string;
  doc: any;
}

export default function makeRestMwares (meta: IMeta) {
  const Doc: typeof meta.doc = meta.doc
  const NAMESPACE = meta.namespace

  const validator = async (req: Request, res: Response, next: NextFunction) => {
    let docData = {}
    console.info(req.body)
    for (const [key, value] of Object.entries(req.body)) {
      if (req.body[key]) { docData = { ...docData, [key]: value } }
    }

    // goes to next function if no errors encountered
    req.payload = docData
    console.info(req.payload)
    next()
  }

  const paginator = async (req: Request, res: Response, next: NextFunction) => {
    // define params
    const { filterArgs, sortArgs } = req.body
    const page: (number | undefined) = req.query.page
      ? parseInt(req.query.page as string)
      : undefined
    const limit: (number | undefined)= req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined

    if (page !== undefined && limit !== undefined) {
      const startIdx = (page - 1) * limit
      const endIdx = page * limit

      // add pageIdx to req
      req.pageIdx = { startIdx, endIdx }

      // build count query
      let query
      if (filterArgs !== undefined) {
        query = Doc.find(filterArgs)
      } else {
        query = Doc.find()
      }
      if (sortArgs !== undefined) { query = query.sort(sortArgs) }

      // run count query
      const docsCount = await query.count()
      req.pagination = { docsCount }

      if (endIdx < docsCount) {
        req.pagination.next = {
          page: (page as number) + 1,
          limit: limit as number
        }
      }

      if (startIdx > 0) {
        req.pagination.previous = {
          page: (page as number) - 1,
          limit: limit as number
        }
      }
    }
    next()
  }

  const addDoc = async (req: Request, res: Response, next: NextFunction) => {
    let addedDoc = {}
    if (req.payload) {
      addedDoc = req.payload
    } else {
      for (const [key, value] of Object.entries(req.body)) {
        if (req.body[key]) { addedDoc = { ...addedDoc, [key]: value } }
      }
    }
    const newDoc = new Doc({
      _id: new mongoose.Types.ObjectId(),
      ...addedDoc
    })

    try {
      const doc = await newDoc.save()
      req.addedDoc = doc
      next()
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

  const updateDoc = async (req: Request, res: Response, next: NextFunction) => {
    let updatedDoc = {}
    if (req.payload) {
      updatedDoc = req.payload
    } else {
      for (const [key, value] of Object.entries(req.body)) {
        if (req.body[key]) { updatedDoc = { ...updatedDoc, [key]: value } }
      }
    }

    try {
      const doc = await Doc.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updatedDoc },
        { returnDocument: 'after' }
      )
      console.info('updatedDoc', doc)
      req.updatedDoc = doc
      if (doc == null) {
        logging.error(NAMESPACE, `Cannot find ${meta.docName} with id ${req.params.id}`)
        return res.status(500).json({
          message: `Cannot find ${meta.docName} with id ${req.params.id}`,
          error: 'Record not found'
        })
      }
      next()
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
      const doc = await Doc.remove({ _id: req.params.id })
      console.info('deleteDoc', doc)
      req.deletedDoc = doc
      next()
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

  return {
    validator,
    paginator,
    addDoc,
    updateDoc,
    deleteDoc
  }
}