const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')

// 取得後台餐廳清單列表
router.get('/admin/restaurants', adminController.getRestaurants)
// 取得後台單一餐廳清單
router.get('/admin/restaurants/:id', adminController.getRestaurant)

module.exports = router
