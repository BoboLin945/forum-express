const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: (req, res) => {
    const UserId = req.user.id
    const { text, restaurantId } = req.body
    Comment.create({
      text,
      RestaurantId: restaurantId,
      UserId
    })
      .then((comment) => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => console.log(err))
  }
}

module.exports = commentController