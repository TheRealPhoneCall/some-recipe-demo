import RecipeStep from './model'
import makeRestControllers from '../../factories/rest-controllers'

const {
  addDoc,
  getDoc,
  getDocs,
  getDocsAdvanced,
  updateDoc,
  deleteDoc,
} = makeRestControllers({
  namespace: 'Recipe Steps',
  docName: 'recipeStep',
  colName: 'recipeSteps',
  doc: RecipeStep
})

export default {
  addDoc,
  getDoc,
  getDocs,
  getDocsAdvanced,
  updateDoc,
  deleteDoc,
}

