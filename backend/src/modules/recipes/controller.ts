import Recipe from './model'
import makeRestControllers from '../../factories/rest-controllers'

const {
  addDoc,
  getDoc,
  getDocs,
  getDocsAdvanced,
  updateDoc,
  deleteDoc,
} = makeRestControllers({
  namespace: 'Recipes',
  docName: 'recipe',
  colName: 'recipes',
  doc: Recipe
})

export default {
  addDoc,
  getDoc,
  getDocs,
  getDocsAdvanced,
  updateDoc,
  deleteDoc,
}

