const db = require('../models')
const Comment = db.Comment

const helpers = require('../_helpers')

const commentController = {
  // 新增評論
  postComment: (req, res) => {
    const UserId = helpers.getUser(req).id
    const { text, restaurantId } = req.body
    Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId
    })
      .then((comment) => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => console.log(err))
  },
  // 刪除評論
  deleteComment: (req, res) => {
    const id = req.params.id
    Comment.findByPk(id)
      .then((comment) => {
        comment.destroy()
          .then((comment) => res.redirect(`/restaurants/${comment.RestaurantId}`))
      })
      .catch(err => console.log(err))
  }
}

module.exports = commentController