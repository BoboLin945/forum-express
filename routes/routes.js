const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const helpers = require('../_helpers')



const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

// 首頁
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
// 前台餐廳列表
router.get('/restaurants', authenticated, restController.getRestaurants)
// 取得最新資料
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// 人氣餐廳
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
// 單一餐廳 Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
// 單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 我的最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// Like 功能
router.post('/like/:restaurantId', authenticated, userController.clickToLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// 新增評論
router.post('/comments', authenticated, commentController.postComment)
// 刪除評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
// 美食達人
router.get('/users/top', authenticated, userController.getTopUser)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// User Profile
router.get('/users/:id', authenticated, userController.getUser)
// Edit profile
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)


// 後台首頁
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
// 後台 restaurant list
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 後台 (CRUD)
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
// 後台 users list
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// 後台 user toggle role
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
// 後台 分類 CRUD
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入 & 登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

module.exports = router