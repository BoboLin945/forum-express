const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')

const userService = require('../services/userService.js')

const fs = require('fs')
const imgur = require('imgur-node-api')
const { resolve } = require('path')
const { rejects } = require('assert')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
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
    userService.getUser(req, res, (data) => {
      return res.render('user', data)
    })
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
    userService.putUser(req, res, (data) => {
      if(data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      } else {
        req.flash('success_messages', data['message'])
        return res.redirect(`/users/${req.params.id}`)
      }
    })
  },
  // 新增餐廳至最愛
  addFavorite: (req, res) => {
    userService.addFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },
  // 移除最愛
  removeFavorite: (req, res) => {
    userService.removeFavorite(req, res, (data) => {
      return res.redirect('back')
    })
  },
  // 喜歡餐廳
  clickToLike: (req, res) => {
    userService.clickToLike(req, res, (data) => {
      return res.redirect('back')
    })
  },
  // 取消喜歡
  removeLike: (req, res) => {
    userService.removeLike(req, res, (data) => {
      return res.redirect('back')
    })
  },
  // 美食達人頁面
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.render('topUser', data)
    })
  },
  // follow user
  addFollowing: (req, res) => {
    userService.addFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  },
  // remove follow user
  removeFollowing: (req, res) => {
    userService.removeFollowing(req, res, (data) => {
      return res.redirect('back')
    })
  }
}

module.exports = userController