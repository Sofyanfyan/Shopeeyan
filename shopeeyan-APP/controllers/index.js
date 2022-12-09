const { Customer, Product, Seller, Shop, Category} = require('../models')
var bcrypt = require('bcryptjs');
const { money } = require('../helpers')

class Controller {
   static home(req, res) {
      const { name } = req.query
      let options = {
         order: [['createdAt', 'DESC']]
      }

      Product.home(options, name)
         .then(data => res.render('home', {data, money}))
         .catch(err=> res.send(err))
   }

   static register(req, res) {
      const { err } = req.query
      res.render('registerForm', { err })
   }

   static detailProducts(req, res){
      Product.findOne({
         where:{
            id: req.params.id
         }, 
         include:{
            all:true
         }
      })
      .then(data =>{ 
         res.render('detail-product', {data, money})
      })
      .catch(err=> res.send(err))
   }

   static registerPost(req, res) {
      const { name, email, password, sellerAcc } = req.body
         if (sellerAcc === 'yes') {
            Seller.create({ name, email, password })
                  .then(_ => {
                     return Seller.findOne({
                        where:{
                           email
                        }
                     })
                  })
                  .then(data => {
                     res.render('form-create-shop', {data})
                  })
                  .catch(err => {
                     if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                        const errors = err.errors.map(el => el.message)
                        res.redirect(`/register?err=${errors}`)
                     }else {
                        res.send(err)
                     }
                  })
         }else {
            Customer.create({ name, email, password })
                  .then(_ => res.redirect('/login'))
                  .catch(err => {
                     if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
                        const errors = err.errors.map(el => el.message)
                        res.redirect(`/register?err=${errors}`)
                     }else {
                        res.send(err)
                     }
                  })
         }
   }



   static createShopPost(req, res){
      const { SellerId, name } = req.body
      Shop.create({SellerId, name})
      .then(() => {
         return Seller.findOne({
            where:{
               id: SellerId
            },
            include:{
               model: Shop
            }
         })
      })
      .then((data) => res.redirect(`/owner/${data.Shop.id}`))
      .catch(err => res.send(err))
   }

   static loginPage(req, res){
      const { err } = req.query
      res.render('login-page', { err })
   }

   static logInCust(req, res) {
      const { err } = req.query
      res.render('login', { err })
   }

   static logInCustPost(req, res) {
      const { email, password } = req.body
      // res.send(req.body)
      Customer.findOne({ where: { email } })
            .then(cust => {
               if (cust) {
                  const checkPassword = bcrypt.compareSync(password, cust.password);
                  if (checkPassword) {
                     req.session.userId = cust.id
                     return res.redirect('/')
                  }
                  else {
                        const errors = 'Invalid password'
                        return res.redirect(`/login/customer?err=${errors}`)
                  }
               }else {
                  const errors = 'Invalid email or password'
                  return res.redirect(`/login/customer?err=${errors}`)
               }
            })
            .catch(err => res.send(err))
   }

   static logInSeller(req, res) {
      const { err } = req.query
      res.render('loginSeller', { err })
   }

   static loginSellerPost(req, res) {
      const { email, password } = req.body
      Seller.findOne({ where: { email } })
            .then(seller => {
               if (seller) {
                  const checkPassword = bcrypt.compareSync(password, seller.password);
                  if (checkPassword) {
                     return Shop.findOne({
                        where:{
                           SellerId: seller.id
                        }
                     })
                     .then(data => res.redirect(`/owner/${data.id}`))
                  } 
                  else {
                        const errors = 'Invalid password'
                        res.redirect(`/login/seller?err=${errors}`)
                  }
               }else {
                  const errors = 'Invalid email or password'
                  res.redirect(`/login/seller?err=${errors}`)
               }
            })
            .catch(err => res.send(err))
   }

   static shopById (req, res){
      Shop.findOne({
         include: {
            model: Product
         },
         where:{
            id: req.params.shopId
         }
      })
      .then(data => {
         res.render('list-shop', { data, money })
   })
      .catch(err => res.send(err))
   }

   static ownerPage(req, res){

      Shop.findOne({
         include:{
            all: true
         },
         where:{
            id: req.params.id
         }
      })
      .then(data => {
         res.render('list-product-owner', {data, money})
         // res.send(data)
      })
      .catch(err => res.send(err))
   }

   static productForm(req, res){

      let category

      Category.findAll()
      .then(data => {
         category = data

         return Shop.findOne({
            where:{
               id: req.params.ownerId
            }
         })
      })
      .then(data => res.render('add-product', {data, category}))
      .catch(err => res.send(err))
   }


   static addProduct(req, res){

      const { ShopId, name, img, description, price, CategoryId} = req.body

      Product.create({ ShopId, name, img, description, price, CategoryId })
      .then(()=> res.redirect(`/owner/${ShopId}`))
      .catch(err => res.send(err))
   }


   static destroy(req, res){

   let shop_id

      Product.findOne({
         where:{
            id: req.params.id
         }
      })
      .then((data)=>{
         
         shop_id = data.ShopId

         Product.destroy({
            where:{
               id: req.params.id
            }
         })
      })
      .then(()=>{

         res.redirect(`/owner/${shop_id}`)
      })
      .catch(err => res.send(err))
   }


   static updateForm(req, res){

      let category

      Category.findAll()
      .then(data => {

         category = data

         return Product.findOne({
            where:{
               id: req.params.id
            }
         })
      })
      .then(data => res.render('update-product', {data, category}))
      .catch(err => res.send(err))
   }

   static update(req, res){

      const {name, img, description, price, CategoryId} = req.body

   let shop_id

      Product.findOne({
         where:{
            id: req.params.id
         }
      })
      .then((data)=>{
         
         shop_id = data.ShopId

         Product.update({name, img, description, price, CategoryId},{
            where:{
               id: req.params.id
            }
         })
      })
      .then(()=>{

         res.redirect(`/owner/${shop_id}`)
      })
      .catch(err => res.send(err))
   }

   static logout(req, res) {
      req.session.destroy((err) => {
         if (err) res.send(err)
         else {
            res.redirect('/')
         }
      })
   }
}

module.exports = Controller