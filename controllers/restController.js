const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAll({
      include: Category,
      where: whereQuery
    })
      .then((restaurants) => {
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        Category.findAll({
          raw: true,
          nest: true
        })
          .then((categories) => {
            return res.render('restaurants', { restaurants: data, categories, categoryId })
          })
      })
  },
  // 取得單一餐廳
  getRestaurant: (req, res) => {
    const id = req.params.id
    Restaurant.findByPk(id, {
      include: Category
    })
      .then((restaurant) => {
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(err => console.log(err))
  },
}
module.exports = restController