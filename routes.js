const path = require('path');

module.exports = function routeHandler(app) {
  app.get('/api', (req, res) => {

  });

  app.get('/test', (req, res) => {
    console.log('/test received');
    res.send('ok');
  });

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/client/build/index.html'));
  });
}