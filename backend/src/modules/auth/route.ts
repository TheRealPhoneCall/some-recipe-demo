import express from 'express'
import controller from './controller'
import extractJWT from '../../middleware/extractJWT'

const router = express.Router()

router.get('/validate', extractJWT, controller.validateToken)
router.post('/sign-up', controller.register)
router.post('/sign-in', controller.login)
router.post('/update-account', controller.updateAccount)
router.get('/get/all', controller.getAllUsers)

export = router