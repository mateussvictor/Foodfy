const User = require('../models/admin/User')
const { compare } = require('bcryptjs')


async function putPasswordMatch(req, res, next) {
  try {
    req.body.id != req.session.userId ? next() : passwordVerification()

    async function passwordVerification() {
      const {
        email,
        password,
      } = req.body

      console.log(req.body)

      const user = await User.findOne({
        where: {
          email
        }
      })

      const passed = await compare(password, user.password)

      if (!passed) {
        req.session.error = 'Senha incorreta!'
        return res.redirect('/admin/users/profile')
      }

      next()
    }

  } catch (err) {
    console.error(err)
  }
}

async function isItMeIsAdminVerification(req, res, next) {

  try {
    function itsNotUser() {

      req.session.error = 'Desculpe! Apenas administradores podem realizar essa ação.'
      return res.redirect('/admin/users/profile')
    }

    (req.body.id == req.session.userId) ? next():
      req.session.isAdmin == true ? next() :
      itsNotUser()
  } catch (err) {
    console.error(err)
  }
}

async function emailVerification(req, res, next) {
  const {
    email,
  } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (user) {
    req.session.error = 'Este endereço de e-mail já está sendo utilizado por outro usuário.'
    req.session.user = user
    return res.redirect('/admin/users/create')
  }

  next()
}

async function del(req, res, next) {
  id = req.body.id
  user_id = req.session.userId

  let usersList = await User.findAll()

  function filterOtherUsers(user) {
    return user.id != req.session.userId
  }

  function filterNotAdminUsers(user) {
    return user.is_admin != true
  }

  usersList = usersList.filter(filterOtherUsers)
  usersList = usersList.filter(filterNotAdminUsers)

  if (id == user_id)
    return res.render("admin/user/index", {
      users: usersList,
      error: "Você não pode deletar sua própria conta!",
    })
  next()
}

module.exports = {
  isItMeIsAdminVerification,
  putPasswordMatch,
  emailVerification,
  del
}
