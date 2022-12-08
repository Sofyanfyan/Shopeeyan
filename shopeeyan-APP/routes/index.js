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

router.get('/owner/:id', Controller.ownerPage)
router.get('/owner/add/:ownerId', Controller.productForm)
router.post('/owner/add/:ownerId', Controller.addProduct)

router.get('/products/delete/:id', Controller.destroy)

router.get('/products/update/:id', Controller.updateForm)
router.post('/products/update/:id', Controller.update)


module.exports = router