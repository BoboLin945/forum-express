const db = require('../models')
const Category = db.Category

const categoryService = require('../services/categoryServie.js')

const categoryController = {
  // 取得分類列表
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  // create category
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status' === 'error']) {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
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
  },
  // delete category
  deleteCategory: (req, res) => {
    const id = req.params.id
    Category.findByPk(id)
      .then((category => {
        category.destroy()
      }))
      .then((category) => res.redirect('/admin/categories'))
      .catch(err => console.log(err))
  }

}

module.exports = categoryController