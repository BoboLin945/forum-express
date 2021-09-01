const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment

const helpers = require('../_helpers')

const pageLimit = 10 // 一頁 10 筆資料

const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    })
      .then((result) => {
        const page = Number(req.query.page) || 1
        // 計算共有幾頁
        const pages = Math.ceil(result.count / pageLimit)
        // 頁數陣列
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? page : page + 1
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name,
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
        }))
        Category.findAll({
          raw: true,
          nest: true
        })
          .then((categories) => {
            return res.render('restaurants', { restaurants: data, categories, categoryId, page, totalPage, prev, next })
          })
      })
  },
  // 取得單一餐廳
  getRestaurant: (req, res) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then((restaurant) => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        restaurant.increment('viewCounts', { by: 1 })
        return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited })
      })
      .catch(err => console.log(err))
  },
  // 取得最新動態
  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
        include: [Category]
      }),
      Comment.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10,
        raw: true,
        nest: true,
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants, comments
      })
    })
  },
  // 取得餐廳其他詳細資料
  getDashboard: (req, res) => {
    // get restaurant id
    const id = req.params.id
    Comment.findAndCountAll({
      where: { RestaurantId: id },
      raw: true,
      nest: true
    })
      .then((comments) => {
        const commentNum = comments.count
        Restaurant.findByPk(id, { include: [Category] })
          .then((restaurant) => {
            res.render('dashboard', { restaurant: restaurant.toJSON(), commentNum })
          })
          .catch(err => console.log(err))
      })
  }
}

module.exports = restController