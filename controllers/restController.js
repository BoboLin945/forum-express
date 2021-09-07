const db = require('../models')
const user = require('../models/user')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite

const restService = require('../services/restService.js')

const helpers = require('../_helpers')

const restController = {
  // 前台 取得餐廳列表
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      return res.render('restaurants', data)
    })
  },
  // 取得單一餐廳 detail
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      return res.render('restaurant', data)
    })
  },
  // 取得最新動態
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, (data) => {
      return res.render('feeds', data)
    })
  },
  // 取得餐廳其他詳細資料
  getDashboard: (req, res) => {
    restService.getRestaurant(req, res, (data) => {
      return res.render('dashboard', data)
    })
  },
  // top restaurants
  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, (data) => {
      return res.render('topRestaurant', data)
    })
  }
}

module.exports = restController