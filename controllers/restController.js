const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res) => {
    Restaurant.findAll({
      include: Category
    })
      .then((restaurants) => {
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        return res.render('restaurants', { restaurants: data })
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
  }
}
module.exports = restController