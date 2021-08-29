const db = require('../models')
const Category = db.Category

const categoryController = {
  // 取得分類列表
  getCategories: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            return res.render('admin/categories', {
              categories,
              category: category.toJSON()
            })
          })
      } else {
        return res.render('admin/categories', { categories })
      }
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
  },
  // update category
  putCategory: (req, res) => {
    const { name } = req.body
    const id = req.params.id
    if (!name) {
      req.flash('error_messages', '請輸入分類名稱。')
      res.redirect('back')
    } else {
      Category.findByPk(id)
        .then((category) => {
          category.update({
            name
          })
            .then((category => res.redirect('/admin/categories')))
            .catch(err => console.log(err))
        })
    }
  }

}

module.exports = categoryController