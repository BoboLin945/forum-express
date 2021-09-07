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
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      res.redirect('/admin/categories')
    })
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