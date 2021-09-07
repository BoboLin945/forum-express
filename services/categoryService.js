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
  // update category
  putCategory: (req, res, callback) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) {
      return callback({ status: 'error', message: "請輸入分類名稱。" })
    } else {
      Category.findByPk(id)
        .then((category) => {
          category.update({
            name
          })
            .then((category => {
              callback({ status: 'success', message: "修改分類成功。" })
            }))
            .catch(err => console.log(err))
        })
    }
  },
  // delete category
  deleteCategory: (req, res, callback) => {
    const id = req.params.id
    Category.findByPk(id)
      .then((category => {
        category.destroy()
      }))
      .then((category) => {
        callback({ status: 'success', message: '' })
      })
      .catch(err => console.log(err))
  }
}

module.exports = categoryService