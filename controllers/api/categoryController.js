const db = require('../../models')
const Category = db.Category

const categoryService = require('../../services/categoryServie.js')

const categoryController = {
  // 取得分類列表
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  // create category
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController