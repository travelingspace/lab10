var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
    Bird.find().select({name:1,description:1}).sort({name:1})
        .then((birdDocs) => {
          console.log('All birds', birdDocs);
          res.render('index', {title: 'All Birds', birds: birdDocs} )
        }).catch( (err) => {
          next(err);
    });
});

/*POST to create a new bird*/
router.post('/addBird', function(req, res, next) {

  //assign form data to bird object
  var bird = Bird(req.body);

  bird.save().then( (birdDoc) => {
    console.log(birdDoc);
    res.redirect('/');
  }).catch( (err) => {

      //parse the error to check for specific errors to display relevant error messages
      if(err.name === 'ValidationError'){
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          next(err);
      }
  });
});


/*GET details about a bird*/
router.get('/bird/:_id', function(req, res, next){
  Bird.findOne({_id: req.params._id})
      .then( (birdDoc) => {
        if (birdDoc){
          console.log(birdDoc); res.render('birdInfo', {title: birdDoc.name, bird:birdDoc});
        }else{
          var err = Error('Bird not found');
          err.status = 404;
          throw err;
        }
      })
      .catch((err) => {
        next(err);
      });
})


module.exports = router;
