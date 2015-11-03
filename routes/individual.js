var mongoose = require('mongoose')

var Project = mongoose.model('project')
var utils = require('./utils')
var extend = require('util')._extend
var Rating = mongoose.model('Rating');
/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('user');

    Project.load(id, function (err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('not found'));
    req.project = project;
    next();
  });
};

/**
 * List
 */


 exports.rendCon = function (req, res){
       console.log(req.project);
       res.render('individual/contribute', {
       });

     };




exports.index = function (req, res){
      console.log(req.project);
      res.render('individual/story', {
      });

    };






exports.addMoni = function (req, res) {

    var proj = req.project;
    
    var user = req.user;
    var finalRating = 0;


        Project.findOne({ _id: proj._id }, function (err, existingProj) {

            if (err) {
                console.log("findRatingError:" + err);
                return res.redirect('/articles/' + article._id);
            }
            if (existingProj) {
                console.log("find existing");
            }

            console.log(req.body);
            existingProj.hasRaised += Number(req.body.amount);
            existingProj.save(function (err) {

                if (err) { console.log("some bad errorr!!!!!!!!!!") }                ;

                console.log(existingProj);

                res.redirect('/individual/contribute/'+existingProj._id);


            });


        });













};










//used to add comment on the project
exports.addCom = function (req, res) {

    var proj = req.project;
    var user = req.user;



        Project.findOne({ _id: proj._id }, function (err, existingProj) {
            if (err) {
                console.log("findRatingError:" + err);
                return res.redirect('/articles/' + article._id);
            }
            if (existingProj) {
                console.log("find existing");
            }

            console.log(req.body);
            existingProj.comments.push(req.body.com);
            existingProj.save(function (err) {

                if (err) { console.log("some bad errorr!!!!!!!!!!") }                ;

                console.log(existingProj.comments);
/*
                res.render('individual/contribute', {
                    project: existingProj
                });
*/
res.redirect('/individual/contribute/'+existingProj._id);


            });


        });













};



/**
 * Show
 */

exports.show = function (req, res) {
    var proj = req.project;

    var user = req.user;
    var finalRating = 0;

        Project.findOne({_id:proj._id},function(err, existingProj){

          if (err) {
              console.log("findRatingError:" + err);
              return res.redirect('/articles/' + article._id);
          }
          if (existingProj) {
              console.log("find existing");
            }
      res.render('individual/story', {
          project: existingProj
            //  article: req.article,
          //finalRating: finalRating
      });


        });



};


exports.showCon = function (req, res) {
    var proj = req.project;

    var user = req.user;
    var finalRating = 0;
    if (req.isAuthenticated()) {
        Rating.findOne({ '_user': user._id, '_project': proj._id },
            function (err, existingRating) {
                if (err) {

                }
                if (existingRating) {
                finalRating = existingRating.rating;
                console.log("find existing",existingRating);
            }

            res.render('individual/contribute', {
                project: proj,
                pert: proj.hasRaised /  proj.fundgoal,
                finalRating: finalRating
            });
        });
    }
    else {



        Project.findOne({_id:proj._id},function(err, existingProj){

          if (err) {
              console.log("findRatingError:" + err);
              return res.redirect('/articles/' + article._id);
          }
          if (existingProj) {
              console.log("find existing");
            }
      res.render('individual/contribute', {
          project: existingProj,
          pert: existingProj.hasRaised /  existingProj.fundgoal
            //  article: req.article,
          //finalRating: finalRating
      });


        });

    }


};








exports.rating = function (req, res){
    console.log("start rating!!", req.project);
    //search if this user likes/dislikes this article before
    var project = req.project;
    var user = req.user;

    var previousRating = 0;
    var currentRating = 0;
    var finalRating = 0;
    var likes = 0;
    var dislikes = 0;
    console.log("like",req.body.like);
    console.log("dis",req.body.unlike);
    if (req.body.like) {
        currentRating = 1;
    }
    if (req.body.unlike){
        currentRating = -1;
    }
    console.log(currentRating);
    Rating.findOne({ '_user': user._id, '_project': project._id },
        function (err, existingRating) {
        if (err) {
            console.log("findRatingError:"+err);
            return res.redirect('/individual/story/' + project._id);
        }
        if (existingRating) {
            previousRating = existingRating.rating;
            if (previousRating == currentRating) {
                //user undo like/unlike
                finalRating = 0;
                if (currentRating == 1) {

                    project.likes--;
                    likes--;
                }
                else if (currentRating ==-1){
                    project.dislikes--;
                    dislikes--;
                }

                existingRating.rating = 0;
            }
            else {
                finalRating = currentRating;
                if (currentRating == 1) {
                    project.likes++;
                    likes++;
                    if (previousRating == -1) {
                        project.dislikes--;
                        dislikes--;
                    }


                }
                else {
                    project.dislikes++;
                    dislikes++;
                    if (previousRating == 1) {
                        project.likes--;
                        likes--;
                    }
                }

                existingRating.rating = currentRating;
            }
            existingRating.save(function (err) {
                if (err) return next(err);//TODO:
                //todo: push into user and article if necessary
            });


        }
        else {//no rating before
            finalRating = currentRating;
            var rating = new Rating({
                _user: user._id,
                _project: project._id,
                rating: currentRating

            });
            if (currentRating == 1) {

                project.likes++;
                likes++;
            }
            else {
                project.dislikes++;
                dislikes++;
            }
            rating.save(function (err) {
                if (err) return next(err);//TODO:
                //todo: push into user and article if necessary
            });

        }

        console.log("save", rating);


        //update article
            Project.findOne({ _id: project._id }, function (err, exitingProject) {
            if (!err) {
                exitingProject.likes += likes;
                exitingProject.dislikes += dislikes;
                exitingProject.ratings = exitingProject.likes - exitingProject.dislikes;
                exitingProject.save(function (err) {
                    if (err) {
                        console.log("Error: could not save Article " );
                    }
                });
            }
        });





        res.render('individual/contribute', {

            pert: project.hasRaised / project.fundgoal,
            project: req.project,
            finalRating: finalRating
    });



    });


};
