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
}

module.exports = adminService