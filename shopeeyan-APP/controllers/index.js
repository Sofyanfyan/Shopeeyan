const { Customer } = require('../models')
var bcrypt = require('bcryptjs');
class Controller {
    static home(req, res) {
        res.send('aaa Wssssorld!')
    }

    static register(req, res) {
        res.render('registerForm')
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