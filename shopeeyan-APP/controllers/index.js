const { Customer, Product } = require('../models')
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
      res.render('registerForm')
   }

   static detailProducts(req, res){

      Product.findOne({
         where:{
            id: req.params.id
         }
      })
      .then(data => res.render('detail-product', {data, money}))
      .catch(err=> res(err))
   }

   static registerPost(req, res) {
        // res.send(req.body)
         const { name, email, password } = req.body
         Customer.create({ name, email, password })
            .then(_ => res.redirect('/login'))
            .catch(err => res.send(err))
   }

   static logIn(req, res) {
      res.render('login')
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
                        const error = 'Invalid password'
                        return res.redirect(`/login?errors=${error}`)
                  }
               }else {
                  const error = 'Invalid email or password'
                  return res.redirect(`/login?errors=${error}`)
               }
            })
            .catch(err => res.send(err))
   }
}

module.exports = Controller