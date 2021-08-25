const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController