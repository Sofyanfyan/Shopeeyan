const express = require('express')
const Controller = require('../controllers')
const router = express.Router()

router.get('/', Controller.home)
router.get('/priducts/detail/:id', Controller.detailProducts)

router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)
router.post('/create/shop', Controller.createShopPost)

router.get('/login', Controller.loginPage)

router.get('/login/customer', Controller.logInCust)
router.post('/login/customer', Controller.logInCustPost)

router.get('/login/seller', Controller.logInSeller)
router.post('/login/seller', Controller.loginSellerPost)

router.get('/shop/:shopId',Controller.shopById)

module.exports = router