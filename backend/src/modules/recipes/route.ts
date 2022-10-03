import express from 'express'
import controller from './controller'
import middleware from './middleware'

const router = express.Router()

router.post('/filtered', middleware.paginator, controller.getDocsAdvanced)
router.get('/', middleware.paginator, controller.getDocs)
router.get('/:id', controller.getDoc)
router.post('/', middleware.validator, controller.addDoc)
router.patch('/:id', middleware.validator, controller.updateDoc)
router.delete('/:id', controller.deleteDoc)

export = router