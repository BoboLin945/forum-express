const db = require('../models')
const Category = db.Category

const categoryService = {
  // 取得所有分類列表
  getCategories: (req, res, callback) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({
              categories,
              category: category.toJSON()
            })
          })
      } else {
        callback({ categories })
      }
    })
  },
}

module.exports = categoryService