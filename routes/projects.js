var mongoose = require('mongoose')

var Project = mongoose.model('project')
var utils = require('./utils')
var extend = require('util')._extend
var Rating = mongoose.model('Rating');
var fs = require('fs');
/**
 * Load
 */

exports.search = function (req, res) {
    var options = {};
    
    Project.list(options, function (err, projects) {
        if (err) return res.render('500');
        Project.count().exec(function (err, count) {
            res.render('projects/search', {
                projects: projects,
                sortby: "Date"
            });
        });
    });
    
};

exports.filter = function (req, res) {
    //var filter = req.body.filter;
    //var tt = req.query.tt;
    /*
    var fund = req.body.fund;
    var category = req.body.category;
    var progress = req.body.progress;
    */
    var fund = req.query.fund;
    var category = req.query.category;
    var progress = req.query.progress;
    var sortby = req.query.sortby;
    console.log("fund",fund);
    var q = req.query.q;
    /*
    if (typeof category == 'undefined') {
        category = 0;
    }
        
    if (typeof fund == 'undefined') {
        fund = 0;
    }
    
    if (typeof progress == 'undefined') {
        progress = 0;
    }
    */

    //console.log("ffffffffff", req.body.filter, req.query.category, "bbb","fund:", req.body.fund);

    
    var criteria = {};
    if (typeof category != 'undefined') criteria["category"] = category;
    if (typeof fund != 'undefined') criteria["fund"] = fund;
    if (typeof progress != 'undefined') criteria["progress"] = progress;
    if (typeof q != 'undefined'&& q != '') criteria["title"] = q;
    


    console.log("!!!!!!!",criteria);
    var options = {
        criteria: criteria,
        sortby: sortby
    };

    Project.list(options, function (err, projects) {
        if (err) return res.render('500');
        
        res.render('projects/search', {
            projects: projects,
            fund: fund,
            category: category,
            progress: progress,
            sortby: sortby,
            q:q
        });
    });

};




exports.index = function (req, res) {
    res.render('startproj');
};


/**
 * Create an article
 * Upload an image
 */

exports.create = function (req, res) {
    
    if (!req.body) {
        res.send("error create a project");
    } else {
        //console.log(req.body);
        //console.log(req.files);
        if (!req.files) {
            
            res.send("error upload a file")

        }
      /*
      else{
        var imgPath = "../public/images/"+req.files.photo.name;
        console.log(imgPath);
        fs.readFile(imgPath, function (err, data) {
              if (err) throw err;
              var new_proj = {
                title: req.body.name,
                url: req.body.url,
                category: req.body.category,
                location: req.body.location,
                fundgoal: req.body.fundgoal,
                story: req.body.story,
                photo:{ file: { name:req.files.photo.name , bin: data }},  //may need proper type here to represent img file
                ylink: req.body.ylink, //youtube link
                ssnetwork:req.body.ssnetwork, // social network link
                tags: req.body.tags,
              }

              */
        else {
            
            
            /*
                project.findOne({ name: "bbb" }, function (err, doc){
if (err) {
console.log("update user project failed!");
}else{
if(!doc){
  console.log("no proj found");
}else{
    console.log(doc);
  }
      }
});

*/
                      console.log("photo",req.files.photo);
            var imgPath = "./public/images/" + req.files.photo.name;
            var new_proj = {
                title: req.body.title,
                url: req.body.url,
                category: req.body.category,
                location: req.body.location,
                fundgoal: req.body.fundgoal,
                body: req.body.story,
                photo: { file: { name: req.files.photo.name , bin: fs.readFileSync(imgPath) } },  //may need proper type here to represent img file
                ylink: req.body.ylink, //youtube link
                ssnetwork: req.body.ssnetwork, // social network link
                tags: req.body.tags
            }
            
            
            
            var images = undefined
            var project = new Project(new_proj);
            project.uploadAndSave(images, function (err) {
                if (!err) {
                    req.flash('success', 'Successfully created article!');
                    res.redirect('/individual/story/'+project._id);
                }
            });









                      //res.render("startproj");







        }
      //res.send(console.dir(req.files));
      //var project = new projec(req.body);
      //console.log(req.files.photo.size);
    //  console.log(req.photo.path);
    //  console.log(req.photo.type);

    }


    /*




    var project = new projec(req.body);
    console.log(req.files.image);
    var images = undefined;

    article.user = req.user;
    //article.user = '550d2949e08a960c086400fb';//for testing
  article.uploadAndSave(images, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created article!');
      return res.redirect('/articles/'+article._id);
    }
    console.log(err);
    res.render('articles/edit', {
      title: 'New Article',
      article: article,
      errors: utils.errors(err.errors || err)
    });
  });
  */
};



