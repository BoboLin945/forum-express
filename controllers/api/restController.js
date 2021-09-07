const restService = require('../../services/restService.js')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, (data) => {
      res.json(data)
    })
  }
}

module.exports = restController