var mongoose = require('mongoose');
var Project = mongoose.model('project');

exports.index = function (req, res) {
    Project.find().sort({ratings: -1}).limit(9).exec(function (err, projects) {
        if (err) return res.render('500');

        else {
            console.log(req.user);
            res.render('index', {
                projects: projects,
                user:req.user
        	});
        }
    });
}