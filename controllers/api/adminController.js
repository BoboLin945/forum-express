const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category

const adminService = require('../../services/adminService.js')

const adminController = {
  // 取得後台餐廳清單
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  // 取得後台單一餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  // 刪除單一餐廳
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      res.json({ data })
    })
  },
  // 新增單一餐廳
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      res.json(data)
    })
  },
  // 修改單一餐廳
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      res.json(data)
    })
  }
}
module.exports = adminController