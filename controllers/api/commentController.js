const db = require('../../models')
const Comment = db.Comment

const helpers = require('../../_helpers')

const commentService = require('../../services/commentService.js')

const commentController = {
  // 新增評論
  postComment: (req, res) => {
    commentService.postComment(req, res, (data) => {
      return res.json(data)
    })
  },
  // 刪除評論
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = commentController