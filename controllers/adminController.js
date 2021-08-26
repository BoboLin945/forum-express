const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // 取得餐廳列表
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  // 新增餐廳表單
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  // C - 新增餐廳
  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })

      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  // R - 瀏覽餐廳
  getRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  // 編輯餐廳表單
  editRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },
  // U - 編輯餐廳
  putRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const id = req.params.id
    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(id)
          .then((restaurant) => {
            restaurant.update({
              name,
              tel,
              address,
              opening_hours,
              description,
              image: file ? img.data.link : restaurant.image
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
          })

      })
    } else {
      return Restaurant.findByPk(id)
        .then((restaurant) => {
          restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  // D - 刪除餐廳
  deleteRestaurant: (req, res) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },
  // 取得使用者列表
  getUsers: (req, res) => {
    User.findAll({ raw: true })
      .then((users) => {
        res.render('admin/users', { users })
      })
      .catch(error => console.log(error))
  },
  // 使用者角色權限切換
  toggleAdmin: (req, res) => {
    const id = req.params.id
    User.findByPk(id)
      .then((user) => {
        const isAdmin = user.isAdmin ? false : true
        console.log(isAdmin)
        user.update({
          isAdmin
        })
          .then((user) => {
            let msg = ''
            if (user.isAdmin) {
              msg += '權限已設定為 Admin'
            } else { msg += '權限已設定為 User' }
            req.flash('success_messages', msg)
            res.redirect('/admin/users')
          })
          .catch(error => console.log(error))
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController