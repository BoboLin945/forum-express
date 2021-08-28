const db = require('../models')
const Category = db.Category

const categoryController = {
  // 取得分類列表
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      res.render('admin/categories', { categories })
    })
  },
  // create category
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', '請輸入分類名稱。')
      res.redirect('back')
    } else {
      return Category.create({
        name
      })
        .then((category) => {
          req.flash('success_messages', '新增成功。')
          res.redirect('/admin/categories')
        })
    }
  }

}

module.exports = categoryController