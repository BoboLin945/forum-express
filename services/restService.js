const db = require('../models')
const user = require('../models/user')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite

const helpers = require('../_helpers')

const pageLimit = 10 // 一頁 10 筆資料

const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res, callback) => {
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
          isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id),
          isLiked: helpers.getUser(req).LikedRestaurants.map(res => res.id).includes(r.id)
        }))
        Category.findAll({
          raw: true,
          nest: true
        })
          .then((categories) => {
            callback({ restaurants: data, categories, categoryId, page, totalPage, prev, next})
          })
      })
  },
}

module.exports = restController