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
        console.log(restaurants)
        const data = restaurants.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50),
          categoryName: r.Category.name
        }))
        return res.render('restaurants', { restaurants: data })
      })
  }
}
module.exports = restController