import express from 'express'
import controller from './controller'
import middleware from './middleware'
import { upload } from '../../middleware/multer'

const router = express.Router()

router.get('/', controller.getDocs)
router.post('/', upload.single('path'), middleware.validator, controller.addDoc)
router.delete('/:id', controller.deleteDoc)

export = router