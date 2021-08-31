const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const helper = require('../_helpers')

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  // 註冊表單
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  // 註冊
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    // confirm password
    if (passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  // 登入表單
  signInPage: (req, res) => {
    return res.render('signin')
  },
  // 登入
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  // 登出
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  // profile
  // 取得 profile page
  getUser: (req, res) => {
    const id = req.params.id
    const loginUserId = helper.getUser(req).id
    User.findByPk(id)
      .then((user) => {
        const userProfile = user.toJSON()
        res.render('user', { userProfile, loginUserId })
      })
      .catch(err => console.log(err))
  },
  // edit profile page
  editUser: (req, res) => {
    const id = req.params.id
    User.findByPk(id)
      .then((user) => {
        const userProfile = user.toJSON()
        res.render('userEdit', { userProfile })
      })
      .catch(err => console.log(err))
  },
  // edit profile
  putUser: (req, res) => {
    const { name } = req.body
    const id = req.params.id
  
    if(Number(id) !== helper.getUser(req).id) {
      req.flash('error_messages', "cannot edit other user's profile")
      return res.redirect('back')
    }

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(id)
          .then((user) => {
            user.update({
              name,
              image: file ? img.data.link : restaurant.image,
            }).then((user) => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${id}`)
            })
          })
      })
    } else {
      return User.findByPk(id)
        .then((user) => {
          user.update({
            name,
            image: user.image,
          }).then((user) => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect(`/users/${id}`)
          })
        })
    }
  },
}

module.exports = userController