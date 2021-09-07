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
    const { name } = req.body
    const id = req.params.id

    if (Number(id) !== helpers.getUser(req).id) {
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
              image: file ? img.data.link : user.image,
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
  // 新增餐廳至最愛
  addFavorite: (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Favorite.create({
      UserId,
      RestaurantId
    }).then((favorite) => {
      return res.redirect('back')
    })
  },
  // 移除最愛
  removeFavorite: (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Favorite.findOne({
      where: { UserId, RestaurantId }
    }).then((favorite) => {
      favorite.destroy()
    }).then((restaurant) => {
      res.redirect('back')
    })
  },
  // 喜歡餐廳
  clickToLike: (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Like.create({
      UserId, RestaurantId
    }).then((like) => {
      return res.redirect('back')
    }).catch(err => console.log(err))
  },
  // 取消喜歡
  removeLike: (req, res) => {
    const UserId = helpers.getUser(req).id
    const RestaurantId = req.params.restaurantId
    Like.findOne({
      where: { UserId, RestaurantId }
    }).then((like) => {
      like.destroy()
    }).then((restaurant) => {
      res.redirect('back')
    }).catch(err => console.log(err))
  },
  // 美食達人頁面
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then((users) => {
      users = users.map(user => ({
        ...user.dataValues,
        // count follower number
        FollowerCount: user.Followers.length,
        // login user is follow the user or not
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    })
  },
  // follow user
  addFollowing: (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId
    Followship.create({
      followerId, followingId
    }).then(((followship) => {
      res.redirect('back')
    }))
  },
  // remove follow user
  removeFollowing: (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId
    Followship.findOne({
      where: { followerId, followingId }
    }).then((followship) => {
      followship.destroy()
    }).then((followship) => {
      res.redirect('back')
    })
  }
}

module.exports = userController