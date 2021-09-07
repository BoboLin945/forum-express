const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')

// 取得後台餐廳清單列表
router.get('/admin/restaurants', adminController.getRestaurants)

// 取得後台單一餐廳清單
router.get('/admin/restaurants/:id', adminController.getRestaurant)
// 新增單一餐廳
router.post('/admin/restaurants/', upload.single('image'), adminController.postRestaurant)
// 刪除單一餐廳
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
// 修改單一餐廳
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// 後台瀏覽全部類別
router.get('/admin/categories', categoryController.getCategories)
// 新增類別
router.post('/admin/categories', categoryController.postCategory)
// 修改類別
router.put('/admin/categories/:id', categoryController.putCategory)
// 刪除類別
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router
