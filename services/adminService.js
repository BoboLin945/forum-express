const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  // 取得餐廳列表
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      callback({ restaurants })
    })
  },
  // R - 瀏覽餐廳
  getRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id, {
      include: [Category]
    }).then(restaurant => {
      callback({ restaurant: restaurant.toJSON() })
    })
  },
  // 刪除單一餐廳
  deleteRestaurant: (req, res, callback) => {
    const id = req.params.id
    return Restaurant.findByPk(id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  },
  // C - 新增單一餐廳
  postRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
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
          image: file ? img.data.link : null,
          CategoryId: categoryId
        }).then((restaurant) => {
          callback({ status: 'success', message: "restaurant was successfully created" })
        })
      })
    } else {
      return Restaurant.create({
        name,
        tel,
        address,
        opening_hours,
        description,
        image: null,
        CategoryId: categoryId
      }).then((restaurant) => {
        callback({ status: 'success', message: "restaurant was successfully created" })
      })
    }
  },
  // 修改單一餐廳
  putRestaurant: (req, res, callback) => {
    const { name, tel, address, opening_hours, description, categoryId } = req.body
    const id = req.params.id
    if (!name) {
      return callback({ status: 'error', message: "name didn't exist" })
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
              image: file ? img.data.link : restaurant.image,
              CategoryId: categoryId
            }).then((restaurant) => {
              callback({ status: 'success', message: "restaurant was successfully to update" })
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
            image: restaurant.image,
            CategoryId: categoryId
          }).then((restaurant) => {
            callback({ status: 'success', message: "restaurant was successfully to update" })
          })
        })
    }
  },
  // 取得使用者列表
  getUsers: (req, res, callback) => {
    User.findAll({ raw: true, nest: true })
      .then((users) => {
        callback({ users })
      })
      .catch(error => console.log(error))
  },
  // 使用者角色權限切換
  toggleAdmin: (req, res, callback) => {
    const id = req.params.id
    User.findByPk(id)
      .then((user) => {
        const isAdmin = user.isAdmin ? false : true
        user.update({
          isAdmin
        })
          .then((user) => {
            let msg = ''
            if (user.isAdmin) {
              msg += '權限已設定為 Admin'
            } else { msg += '權限已設定為 User' }
            callback({status: 'success', message: msg})
            // req.flash('success_messages', msg)
            // res.redirect('/admin/users')
          })
          .catch(error => console.log(error))
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminService