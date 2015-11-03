var mongoose = require('mongoose');
var User = mongoose.model('user');
var Project = mongoose.model('project'); 

exports.admin = function (req, res) {
        if (!req.session.user || req.session.user.isAdmin == 0) {
        	req.flash('message', 'Login please.');
        	res.redirect('/admin/login');
        }
    	    // Display the Login page with any flash message, if any
        else {
        	Project.count({ category: 'software' }).exec(function (err, software) {
        		Project.count({ category: 'hardware' }).exec(function (err, hardware) {
            		Project.count({ category: 'arts' }).exec(function (err, arts) {
                		Project.count({ category: 'design' }).exec(function (err, design) {
                    		Project.count({ category: 'entertainment' }).exec(function (err, entertainment) {
                        		Project.count({ category: 'healthcare' }).exec(function (err, healthcare) {
                        			Project.count({ modifydate: {"$gte": new Date(2015,00,01),"$lt": new Date(2015,00,31)}}).exec(function(err, date1) {
										Project.count({modifydate: {"$gte": new Date(2015,01,01),"$lt": new Date(2015,01,29)}}).exec(function(err, date2) {
											Project.count({modifydate: {"$gte": new Date(2015,02,01),"$lt": new Date(2015,02,31)}}).exec(function(err, date3) {
												Project.count({modifydate: {"$gte": new Date(2015,03,01),"$lt": new Date(2015,03,30)}}).exec(function(err, date4) {
													Project.count({modifydate: {"$gte": new Date(2015,04,01),"$lt": new Date(2015,04,30)}}).exec(function(err, date5) {
														User.count({community: 'software'}).exec(function(err, usr1) {
															User.count({community: 'hardware'}).exec(function(err, usr2) {
																User.count({community: 'arts'}).exec(function(err, usr3) {
																	User.count({community: 'design'}).exec(function(err, usr4) {
																		User.count({community: 'entertainment'}).exec(function(err, usr5) {
																			User.count({community: 'healthcare'}).exec(function(err, usr6) {
																				Project.count().exec(function(err, totalProj) {
																					User.count().exec(function(err, totalUser) {
																						User.find().sort({_id:-1}).limit(1).exec(function(err, us) {
																							User.count({"role": "initiator"}).exec(function(err, i) {
																								User.count({"role": "founder"}).exec(function(err, f) {
																									if (totalProj == 0){
																										Project.find().sort().limit(1).exec(function(err, ps) {
																											res.render('admin', {
             	    	           																				message: req.flash('message'),
                	                																			software: software,
                        	        																			hardware: hardware,
                            	    																			arts: arts,
                                																				design: design,
                                																				entertainment: entertainment,
                                																				healthcare: healthcare,
                                																				date1: date1,
                                																				date2: date2,
		                                																		date3: date3,
        		                        																		date4: date4,
                		                																		date5: date5,
                        		        																		usr1: usr1,
                                																				usr2: usr2,
                                																				usr3: usr3,
                                																				usr4: usr4,
                                																				usr5: usr5,
                                																				usr6: usr6,
                                																				totalProj: totalProj,
                                																				totalUser: totalUser,
                                																				ps: NaN,
                                																				us: Math.round((Date.now()-us[0]._id.getTimestamp())/60000),
                                																				i: i,
                                																				f: f,
                                																			});
                                																		});
                                																	} else {
																										Project.find().sort({modifydate : -1}).limit(1).exec(function(err, ps) {
                            																				res.render('admin', {
             	    	           																				message: req.flash('message'),
                	                																			software: software,
                        	        																			hardware: hardware,
                            	    																			arts: arts,
                                																				design: design,
                                																				entertainment: entertainment,
                                																				healthcare: healthcare,
                                																				date1: date1,
                                																				date2: date2,
		                                																		date3: date3,
        		                        																		date4: date4,
                		                																		date5: date5,
                        		        																		usr1: usr1,
                                																				usr2: usr2,
                                																				usr3: usr3,
                                																				usr4: usr4,
                                																				usr5: usr5,
                                																				usr6: usr6,
                                																				totalProj: totalProj,
                                																				totalUser: totalUser,
                                																				ps: Math.round((Date.now()-ps[0].modifydate)/60000),
                                																				us: Math.round((Date.now()-us[0]._id.getTimestamp())/60000),
                                																				i: i,
                                																				f: f,
                                																			});
                                																		});
                                																	}
                                																});
                                															});
                                														});
                                													});
                                												});
                                											});
                                										});
                                									});
                                								});
                                							});
                                						});
                                					});
                                				});
                                			});
                                		});
                            		});
                        		});
                    		});           
                		});
            		});
        		});
    		});
        }
    }
    
    
exports.renderlogin = function(req, res) {
	res.render('admin_login', {
		message: req.flash('message')
	});
}


exports.login = function(req, res) {
	User.findOne( {email: req.body.email}, function(err, user) {
		if(!user) {
			req.flash('message', 'Invalid email or password.');
			res.redirect('/admin/login');
		} else {
			user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && user.isAdmin === 1) {// User and password both match, return user from done method
                    // which will be treated like success
                    req.session.user = user;
					req.flash('message', 'Successfully Logged in!');
					res.redirect('/admin');;
                } else {
                    req.flash('message', 'Invalid email or password.');
					res.redirect('/admin/login');
                }
            });
		}
	});
}