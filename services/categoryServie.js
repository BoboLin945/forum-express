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
  // create category
  postCategory: (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      return callback({ status: 'error', message: "請輸入分類名稱。" })
    } else {
      return Category.create({
        name
      })
        .then((category) => {
          callback({ status: 'success', message: "新增成功。" })
        })
    }
  },
}

module.exports = categoryService