const express = require('express')
const Controller = require('../controllers')
const router = express.Router()

router.get('/', Controller.home)
router.get('/priducts/detail/:id', Controller.detailProducts)

router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)
router.get('/login', Controller.logIn)
router.post('/login', Controller.logInPost)
router.get('/loginSeller', Controller.logInSeller)
router.post('/loginSeller', Controller.loginSellerPost)

router.get('/shop/:shopId',Controller.shopById)

module.exports = router