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

export default function makeRestControllers (meta: IMeta) {
  const Doc: typeof meta.doc = meta.doc
  const NAMESPACE = meta.namespace

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
      return res.status(201).json({
        message: `New ${meta.docName} recorded.`,
        [meta.docName]: doc
      })
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

  const getDoc = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await Doc.findById(req.params.id)
      if (doc == null) {
        logging.error(NAMESPACE, `Cannot find  ${meta.docName} with id ${req.params.id}`)
        return res.status(500).json({
          message: `Cannot find  ${meta.docName} with id ${req.params.id}`,
          error: 'Record not found'
        })
      }
      return res.status(200).json({
        message: `${capitalize(meta.docName)} retrieved.`,
        [meta.docName]: doc
      })
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

  const getDocs = async (req: Request, res: Response, next: NextFunction) => {
    const { limit } = req.params
    console.info(req.params)
    try {
      if (limit === undefined) {
        const docs = await Doc.find()
        return res.status(200).json({
          message: docs.length
            ? `All ${meta.colName} retrieved`
            : `${capitalize(meta.colName)} collection is empty`,
          [meta.colName]: docs
        })
      }
      else {
        const docs = await Doc.find().limit(parseInt(limit))
        return res.status(200).json({
          message: `${docs.length} ${meta.colName} retrieved`,
          [meta.colName]: docs
        })
      }
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

  const getDocsAdvanced = async (req: Request, res: Response, next: NextFunction) => {
    const { filterArgs, sortArgs } = req.body
    const limit: (number | undefined)= req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined

    console.info(req.body)
    console.log(filterArgs, sortArgs, limit)
    let docs

    // run the correct possible scenario
    try {
      if (req.pagination && req.pageIdx && filterArgs === undefined ) {
        // limited and pagninated docs
        const { startIdx } = req.pageIdx
        const { next, previous, docsCount } = req.pagination

        if (sortArgs === undefined) {
          docs = await Doc.find().limit(limit).skip(startIdx)
        } else {
          docs = await Doc.find().sort(sortArgs).limit(limit).skip(startIdx)
        }

        return res.status(200).json({
          message: docs.length
            ? `Paginated ${meta.colName} of length ${docs.length}/${docsCount} retrieved.` +
              `${previous ? `Obtained from page ${previous.page}.` : ''}` +
              `${next ? `Get the next page at ${next.page}.` : ''}`
            : `Paginated ${meta.colName} results are empty.`,
          [meta.colName]: docs,
          pagination: req.pagination
        })
      }
      else if (req.pagination && req.pageIdx && filterArgs !== undefined) {
        // filtered and paginated docs
        const { startIdx } = req.pageIdx
        const { next, previous, docsCount } = req.pagination

        if (sortArgs === undefined) {
          docs = await Doc.find(filterArgs).limit(limit).skip(startIdx)
        } else {
          docs = await Doc.find(filterArgs).sort(sortArgs).limit(limit).skip(startIdx)
        }

        return res.status(200).json({
          message: docs.length
            ? `Filtered and paginated ${meta.colName} of length ${docs.length}/}/${docsCount} retrieved.` +
              `${previous ? ` Obtained from page ${previous?.page}.` : ''}` +
              `${next ? ` Get the next page at ${next?.page}.` : ''}`
            : `Filtered and paginated ${meta.colName} results are empty.`,
          [meta.colName]: docs,
          pagination: req.pagination
        })
      }

      if (filterArgs === undefined && limit === undefined) {
        // all docs
        if (sortArgs === undefined) { docs = await Doc.find() }
        else { docs = await Doc.find().sort(sortArgs) }

        return res.status(200).json({
          message: docs.length
            ? `All ${docs.length} retrieved`
            : `${meta.colName} collection is empty`,
          [meta.colName]: docs
        })
      }
      else if (filterArgs === undefined && limit !== undefined) {
        // limited docs
        if (sortArgs === undefined) { docs = await Doc.find().limit(limit) }
        else { docs = await Doc.find().sort(sortArgs).limit(limit) }

        return res.status(200).json({
          message: docs.length
            ? `Limited ${meta.colName} of length ${docs.length} retrieved`
            : `${meta.colName} retrieved results are empty`,
          [meta.colName]: docs
        })
      }
      else if (filterArgs !== undefined && limit === undefined) {
        // filtered docs
        if (sortArgs === undefined) {docs = await Doc.find(filterArgs) }
        else { docs = await Doc.find(filterArgs).sort(sortArgs) }

        return res.status(200).json({
          message: `Filtered ${docs.length} ${meta.colName} retrieved`,
          [meta.colName]: docs
        })
      }
      else if (filterArgs !== undefined && limit !== undefined) {
        // filtered and limited docs
        if (sortArgs === undefined) { docs = await Doc.find(filterArgs).limit(limit) }
        else { docs = await Doc.find(filterArgs).sort(sortArgs).limit(limit) }

        return res.status(200).json({
          message: `Filtered and limited ${meta.colName} of length ${docs.length} retrieved`,
          [meta.colName]: docs
        })
      }
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
      console.info(doc)
      if (doc == null) {
        logging.error(NAMESPACE, `Cannot find ${meta.docName} with id ${req.params.id}`)
        return res.status(500).json({
          message: `Cannot find ${meta.docName} with id ${req.params.id}`,
          error: 'Record not found'
        })
      }
      return res.status(200).json({
        message: `${capitalize(meta.docName)} updated.`,
        [meta.docName]: doc
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
      const doc = await Doc.remove({ _id: req.params.id })
      return res.status(200).json({
        message: `${capitalize(meta.docName)} with id ${req.params.id} removed.`,
        [meta.docName]: doc
      })
    } catch (error) {
      logging.error(NAMESPACE, error.message, error)
      return res.status(500).json({
        message: error.message,
        error
      })
    }
  }

 return {
    addDoc,
    getDoc,
    getDocs,
    getDocsAdvanced,
    updateDoc,
    deleteDoc,
  }
}