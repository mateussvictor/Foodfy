const { hash } = require('bcryptjs')
const { randomPassword } = require('../../../lib/utils')
const mailer = require('../../../lib/mailer')

const User = require("../../models/admin/User")

const email = (userName, userEmail, userPassword) => `
<h2>Olá ${userName}.</h2>
<p>Seu acesso ao Foodfy foi criado com sucesso!</p>
<p>Suas credenciais são:</p>
<p>login: ${userEmail}</p>
<p>senha: ${userPassword}</p>
<p></br></br></p>
<p>Seu acesso está habilitado para criar novas receitas e atribuí-las aos seus devidos Chefs.</p>
<p>Você também pode visualizar todas as receitas cadastradas por você, bem como a lista de todos os Chefs disponíveis.</p>
<p></br></br></p>
<p>Para validar sua conta, faça o primeiro acesso clicando <a href="http://localhost:3000/admin/users/login"><strong>aqui</strong></a></p> 
`



module.exports = {
  create(req, res) {
    const error = req.session.error
    req.session.error = ''

    user = req.session.user
    req.session.user = ''

    return res.render('admin/user/create', {
      error,
      user
    })
  },

  async post(req, res) {
    try {
      const password = randomPassword(8)

      await mailer.sendMail({
        to: req.body.email,
        from: 'no-replay@foodfy.com.br',
        subject: 'Cadastro realizado',
        html: email(req.body.name, req.body.email, password)
      })

      const passwordHash = await hash(password, 8)

      const user = {
        name: req.body.name,
        email: req.body.email,
        password: passwordHash,
        is_admin: req.body.is_admin || 0
      }

      const userId = await User.create(user)

      return res.redirect(`/admin/users/${userId}`)

    } catch (err) {
      console.error(err)
    }
  },

  async list(req, res) {
    try {
      const error = req.session.error
      req.session.error = ''

      let usersList = await User.findAll()

      function filterOtherUsers(user) {
        return user.id != req.session.userId
      }

      function filterNotAdminUsers(user) {
        return user.is_admin != true
      }

      usersList = usersList.filter(filterOtherUsers)
      usersList = usersList.filter(filterNotAdminUsers)

      return res.render('admin/user/index', {
        users: usersList,
        error
      })

    } catch (err) {
      console.error(err)
    }
  },

  async edit(req, res) {
    try {
      const {
        id
      } = req.params

      let user = await User.findOne({
        where: {
          id
        }
      })

      user = {
        ...user,
        firstName: user.name.split(" ")[0],
      }


      return res.render('admin/user/edit.njk', {
        user
      })

    } catch (err) {
      console.error(err)
    }
  },

  async put(req, res) {
    try {
      const {
        id
      } = req.body

      let user = {
        name: req.body.name,
        email: req.body.email,
        is_admin: req.body.is_admin
      }

      user.is_admin = user.is_admin || false

      await User.put(id, user)

      return res.render('admin/user/edit', {
        user: req.body,
        success: 'Usuário atualizado com sucesso!'
      })

    } catch (err) {
      console.error(err)
    }
  },

  async delete(req, res) {
    try {
      const userId = req.body.id

      await User.delete(userId)

      return res.redirect(`users`)

    } catch (err) {
      console.error(err)
    }
  },
}
