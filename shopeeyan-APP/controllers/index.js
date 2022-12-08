const { Customer, Product, Seller, Shop, Category} = require('../models')
var bcrypt = require('bcryptjs');
const { money } = require('../helpers')
class Controller {
   static home(req, res) {
      
      Product.findAll({
         order: [['createdAt', 'DESC']]
      })
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
      .catch(err=> res(err))
   }

   static registerPost(req, res) {
        // res.send(req.body)
      const { name, email, password, sellerAcc } = req.body

         if (sellerAcc === 'yes') {
            // res.send(req.body)
            Seller.create({ name, email, password })
                  .then(_ => res.redirect('/loginSeller'))
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

   static logIn(req, res) {
      const { err } = req.query
      res.render('login', { err })
   }

   static logInPost(req, res) {
      // res.send(req.body)
      const { email, password } = req.body
      Customer.findOne({ where: { email } })
            .then(cust => {
               if (cust) {
                  const checkPassword = bcrypt.compareSync(password, cust.password);
                  if (checkPassword) return res.redirect('/')
                  else {
                        const errors = 'Invalid password'
                        return res.redirect(`/login?err=${errors}`)
                  }
               }else {
                  const errors = 'Invalid email or password'
                  return res.redirect(`/login?err=${errors}`)
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
                  if (checkPassword) return res.redirect('/')
                  else {
                        const errors = 'Invalid password'
                        return res.redirect(`/login?err=${errors}`)
                  }
               }else {
                  const errors = 'Invalid email or password'
                  return res.redirect(`/login?err=${errors}`)
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
         // res.send(data)
         res.render('list-shop', { data, money })
   })
      .catch(err => res.send(err))
   }
}

module.exports = Controller