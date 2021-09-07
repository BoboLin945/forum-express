const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminService = require('../services/adminService.js')

const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  // 取得餐廳列表
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  // 新增餐廳表單
  createRestaurant: (req, res) => {
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },
  // C - 新增餐廳
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  // R - 瀏覽餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  // 編輯餐廳表單
  editRestaurant: (req, res) => {
    const id = req.params.id
    Category.findAll({ raw: true, nest: true })
      .then(categories => {
        return Restaurant.findByPk(id).then(restaurant => {
          return res.render('admin/create', { restaurant: restaurant.toJSON(), categories })
        })
      })
  },
  // U - 編輯餐廳
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  // D - 刪除餐廳
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  // 取得使用者列表
  getUsers: (req, res) => {
    adminService.getUsers(req, res, (data) => {
      return res.render('admin/users', data)
    })
  },
  // 使用者角色權限切換
  toggleAdmin: (req, res) => {
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
            req.flash('success_messages', msg)
            res.redirect('/admin/users')
          })
          .catch(error => console.log(error))
      })
      .catch(err => console.log(err))
  }
}

module.exports = adminController