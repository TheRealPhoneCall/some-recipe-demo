import { NextFunction, Request, Response } from "express";
import Recipe from './model'
import makeRestMiddlewares from '../../factories/rest-middlewares'

const { validator, paginator } = makeRestMiddlewares({
  namespace: 'Recipes',
  docName: 'recipe',
  colName: 'recipes',
  doc: Recipe
})

export default {
  validator,
  paginator
}

