module.exports = function socketRoutes(app) {
  app.get('/game/test', (req, res) => res.send('ok'));
}