const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Url = require('./schema.js');

app.set('port', process.env.PORT || 3000);


mongoose.connect('mongodb://localhost/Urls');
mongoose.connection.on('open', () => {
  console.log('hiya');
});

function randomUrl() {
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let shortUrl = '';
  for (let i = 0; i < 6; i += 1) {
    shortUrl += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return shortUrl;
}

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my Url Shortener Microservice!</h1> Type in your desired url as a parameter and get a shortened version you could use instead.');
});

app.get('/:url', (req, res) => {
  if (req.url !== '/favicon.ico') {
    const newUrl = req.params.url;
    //-----------------------------
    if (newUrl.length === 6) {
      Url.findOne({ short: newUrl }, (err, urlDoc) => {
        if (urlDoc) {
          res.redirect(`http://${urlDoc.original}`);
        } else {
          res.send('Not a saved url dude.');
        }
      });
    } else {
    // if user types in a full url -------------------------------------
      Url.findOne({ original: newUrl }, (err, urlDoc) => {
        if (err) {
          res.send('STRANGER DANGER');
        }
        if (urlDoc) {
          res.json(urlDoc);
        } else {
          const newUrlDoc = new Url({
            original: req.params.url,
            short: randomUrl(),
          });
          newUrlDoc.save(() => {
            if (err) throw err;
            console.log(`Successfully inserted url: ${newUrlDoc.original}`);
            res.json(newUrlDoc);
          });
        }
      });
    }
  }
});

app.listen(app.get('port'), () => {
  console.log(`Server up on port ${app.get('port')}`);
});
