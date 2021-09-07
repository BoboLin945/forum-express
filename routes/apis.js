const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const passport = require('../config/passport')

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticateAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// 取得後台餐廳清單列表
router.get('/admin/restaurants', authenticated, authenticateAdmin, adminController.getRestaurants)

// 取得後台單一餐廳清單
router.get('/admin/restaurants/:id', authenticated, authenticateAdmin, adminController.getRestaurant)
// 新增單一餐廳
router.post('/admin/restaurants/', authenticated, authenticateAdmin, upload.single('image'), adminController.postRestaurant)
// 刪除單一餐廳
router.delete('/admin/restaurants/:id', authenticated, authenticateAdmin, adminController.deleteRestaurant)
// 修改單一餐廳
router.put('/admin/restaurants/:id', authenticated, authenticateAdmin, upload.single('image'), adminController.putRestaurant)

// 後台瀏覽全部類別
router.get('/admin/categories', authenticated, authenticateAdmin, categoryController.getCategories)
// 新增類別
router.post('/admin/categories', authenticated, authenticateAdmin, categoryController.postCategory)
// 修改類別
router.put('/admin/categories/:id', authenticated, authenticateAdmin, categoryController.putCategory)
// 刪除類別
router.delete('/admin/categories/:id', authenticated, authenticateAdmin, categoryController.deleteCategory)

// JWT signin
router.post('/signin', userController.signIn)
// register
router.post('signup', userController.signUp)

module.exports = router
