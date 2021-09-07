const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')

// 取得後台餐廳清單列表
router.get('/admin/restaurants', adminController.getRestaurants)
// 取得後台單一餐廳清單
router.get('/admin/restaurants/:id', adminController.getRestaurant)

// 後台瀏覽全部類別
router.get('/admin/categories', categoryController.getCategories)

// 刪除單一餐廳
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router
