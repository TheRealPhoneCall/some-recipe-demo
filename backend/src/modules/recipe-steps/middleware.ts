import { NextFunction, Request, Response } from "express";
import Recipe from './model'
import makeRestMiddlewares from '../../factories/rest-middlewares'

const { validator, paginator } = makeRestMiddlewares({
  namespace: 'Recipe Steps',
  docName: 'recipeStep',
  colName: 'recipeSteps',
  doc: Recipe
})

export default {
  validator,
  paginator
}

