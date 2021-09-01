const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const helpers = require('../_helpers')

module.exports = (app, passport) => {

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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  // 前台餐廳列表
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 取得最新資料
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // 單一餐廳 Dashboard
  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
  // 單一餐廳
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  // 我的最愛
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  // 新增評論
  app.post('/comments', authenticated, commentController.postComment)
  // 刪除評論
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
  // User Profile
  app.get('/users/:id', authenticated, userController.getUser)
  // Edit profile
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  // 後台首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  // 後台 restaurant list
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  // 後台 (CRUD)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  // 後台 users list
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // 後台 user toggle role
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)
  // 後台 分類 CRUD
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  // 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  // 登入 & 登出
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}