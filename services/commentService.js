const db = require('../models')
const Comment = db.Comment

const helpers = require('../_helpers')

const commentService = {
  // 新增評論
  postComment: (req, res, callback) => {
    const UserId = helpers.getUser(req).id
    const { text, restaurantId } = req.body
    Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId
    })
      .then((comment) => {
        return callback({ status: 'success', message: '' })
      })
      .catch(err => console.log(err))
  },
  // 刪除評論
  deleteComment: (req, res, callback) => {
    const id = req.params.id
    Comment.findByPk(id)
      .then((comment) => {
        comment.destroy()
          .then((comment) => {
            callback({ status: 'success', message: '', comment })
          }
          )
      })
      .catch(err => console.log(err))
  }
}

module.exports = commentService