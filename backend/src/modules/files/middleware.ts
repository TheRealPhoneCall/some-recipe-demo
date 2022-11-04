import { NextFunction, Request, Response } from "express";
import File from './model'
import makeRestMiddlewares from '../../factories/rest-middlewares'

const { validator, paginator } = makeRestMiddlewares({
  namespace: 'Files',
  docName: 'file',
  colName: 'files',
  doc: File
})

export default {
  validator,
  paginator
}

