var connection = require('./../../config');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { threadId } = require('./../../config');
const format = require('dateformat');

const router = express.Router();
require("dotenv").config();


const JWTKEY = 'alexDenial#99999#99999'
//const JWTExpirationSeconds = 604800 //86400 = 1day
const JWTExpirationSeconds = 604800;

//test api
router.get('/echo', (req, res) => {
    res.json({
        message: "Welcome to API Routes"
    });
})

//login
router.post('/login', (req, res) => {
    // console.log('Request body is ' + req.body);
    const username = req.body.username;
    const password = req.body.password;

    //if username or password is null
    if (!username || !password) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    }
    
    connection.query("SELECT * FROM UserTbl WHERE Email = '" + username + "' AND Password = '" + password + "'", (err, user) => {
        if (err) {
            //error handling
            return res.json({
                status: false,
                message: "error" + err.message
            })
        } else {
            console.log(user)
            if (!user[0]) {
                return res.json({
                    status: false,
                    message: "username or password is wrong"
                })
            } else {
                //sign token
                const token = jwt.sign({ username }, JWTKEY, {
                    algorithm: 'HS256',
                    expiresIn: JWTExpirationSeconds
                });
                //if token in not generated
                if (!token) {
                    return res.json({
                        status: false,
                        message: "something went wrong, please try again later"
                    })
                } else {
                    //token is generated
                    return res.json({
                        status: true,
                        message: "Logged in successfully",
                        user: user[0],
                        token: token
                    })
                }
            }
        }
    })
})

//get all category
router.get('/category', (req, res) => {
    connection.query('SELECT * FROM CategoryTbl WHERE IsActive = ?', [0], (err, categories) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            console.log(categories.length);
            console.log(req.headers.host);
            var host = req.headers.host;
            var imagepath = host + "/images/category";
            if (categories.length > 0) {
                var i = 0;
                for (i = 0; i < categories.length; i++) {
                    var img = categories[i].Img;
                    if (img !== undefined) {
                        categories[i].Img = imagepath + '/' + img;
                    }
                }
                return res.json({
                    status: true,
                    message: "Categories are found",
                    categories: categories
                })
            } else {
                return res.json({
                    status: false,
                    message: "No Categories are found"
                })
            }
        }
    })
})

//get all products from category
router.get('/products/:id', (req, res) => {

    var categoryId = req.params.id;
    connection.query('SELECT * FROM ProductTbl WHERE CategoryId = ' + categoryId + ' AND IsActive = ' + 0, (err, products) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            console.log(products.length);
            console.log(req.headers.host);
            var host = req.headers.host;
            var imagepath = host + "/images/product";
            if (products.length > 0) {
                var i = 0;
                for (i = 0; i < products.length; i++) {
                    var img = products[i].ProductImg;
                    if (img !== undefined) {
                        products[i].ProductImg = imagepath + '/' + img;
                    }
                }
                return res.json({
                    status: true,
                    message: "Products are found",
                    categories: products
                })
            } else {
                return res.json({
                    status: false,
                    message: "No Products are found"
                })
            }
        }
    })
})

//get product from productid
router.get('/product/:id', (req, res) => {
    var categoryId = req.params.id;
    connection.query('SELECT * FROM ProductTbl WHERE ProductId = ' + categoryId + ' AND IsActive = ' + 0, (err, products) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            console.log(products.length);
            console.log(req.headers.host);
            var host = req.headers.host;
            var imagepath = host + "/images/product";
            if (products.length > 0) {
                var i = 0;
                for (i = 0; i < products.length; i++) {
                    var img = products[i].ProductImg;
                    if (img !== undefined) {
                        products[i].ProductImg = imagepath + '/' + img;
                    }
                }
                return res.json({
                    status: true,
                    message: "Products are found",
                    categories: products
                })
            } else {
                return res.json({
                    status: false,
                    message: "No Products are found"
                })
            }
        }
    })
})

//get all offers
router.get('/offers', (req, res) => {
    connection.query('SELECT * FROM OfferTbl WHERE IsActive = ?',[0], (err, offers) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            console.log(offers);
            if (offers.length > 0) {
                return res.json({
                    status: true,
                    message: "Offers are found",
                    categories: offers
                })
            } else {
                return res.json({
                    status: false,
                    message: "No offers are found"
                })
            }
        }
    })
})


//get all gallary
router.get('/gallery', (req, res) => {
    connection.query('SELECT * FROM GalleryTbl WHERE Hidden = 1', (err, gallary) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            console.log(req.headers.host);
            var host = req.headers.host;
            var imagepath = host + "/images/gallary";
            if (gallary.length > 0) {
                var i = 0;
                for (i = 0; i < gallary.length; i++) {
                    var img = gallary[i].GalleryImg;
                    if (img !== undefined) {
                        gallary[i].GalleryImg = imagepath + '/' + img;
                    }
                }
                return res.json({
                    status: true,
                    message: "Gallary are found",
                    categories: gallary
                })
            } else {
                return res.json({
                    status: false,
                    message: "No gallary are found"
                })
            }
        }
    })
})

async function uploadFileToDest(folder_name, imgFile) {
    var random = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111;
    var imgName = random + imgFile.name;

    await imgFile.mv('./public/images/' + folder_name + "/" + imgName, (err) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            }).end();
        } else {
            console.log("image name is " + imgName);
            return imgName;
        }
    })
}

//save gallary
router.post('/addGallarymultiple/:id', (req, res) => {
    var imgFiles = req.files.wall_images;
    var jobId = req.params.id;
    x = 0, y = 0;

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }

                console.log(payload);
                if (payload !== undefined) {

                    imgFiles.forEach(function (file) {
                        var fileName = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111 + file.name;
                        file.mv("./public/images/gallary/" + fileName, (err) => {
                            if (err) {
                                return res.json({
                                    status: false,
                                    message: err.message
                                }).end();
                            } else {
                                x++;
                                console.log('file uploaded ' + x + ' file name is ' + fileName);
                                connection.query("INSERT INTO GalleryTbl(JobId, GalleryImg, Hidden, CreatedAt) VALUES(" + jobId + ", '" + fileName + "', 1, CURRENT_TIMESTAMP)", (err, result) => {
                                    if (err) {
                                        return res.json({
                                            status: false,
                                            message: err.message
                                        }).end();
                                    } else {
                                        y++;
                                        x = 1
                                    }
                                })
                            }
                        })

                    });
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }
            } else {
                return res.json({
                    status: false,
                    message: "invalid token payload or token is expired"
                })
            }

        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
        console.log(x);

        // if(y > 0){
        res.json({
            status: true,
            message: "Data saved successfully"
        }).end();
        // }else{
        //     res.json({
        //         status: false,
        //         message: "something went wrong, please try again later"
        //     }).end();
        // }
    }
})

//save gallary multiple
router.post('/addGallary/:id', (req, res) => {
    var imgFiles = req.files.wall_images;
    var jobId = req.params.id;
    x = 0, y = 0;

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }

                console.log(payload);
                if (payload !== undefined) {
                    var fileName = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111 + imgFiles.name;
                    imgFiles.mv("./public/images/gallary/" + fileName, (err) => {
                        if(err){
                            return res.json({
                                status: false,
                                message: err.message
                            }).end();
                        }else{
                            connection.query("INSERT INTO GalleryTbl(JobId, GalleryImg, Hidden, CreatedAt) VALUES(" + jobId + ", '" + fileName + "', 1, CURRENT_TIMESTAMP)", (err, result) => {
                                if(err){
                                    return res.json({
                                        status: false,
                                        message: err.message
                                    }).end();
                                }else{
                                    res.json({
                                        status: true,
                                        message: "Data saved successfully"
                                    }).end();
                                }
                            })
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }
            } else {
                return res.json({
                    status: false,
                    message: "invalid token payload or token is expired"
                })
            }

        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }
})

//save complaint
router.post('/addComplaint', (req, res) => {
    console.log(req.body);
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {

                    var orderId = req.body.orderId;
                    var ComplaintImg = req.files.complaintImg;
                    var assignedTo = req.body.assignedTo;

                    console.dir(ComplaintImg);
                    var fileName = Math.floor(Math.random() * (99999 - 11111 + 1)) + 11111 + ComplaintImg.name;
                    console.log(fileName);
                    var remarks = req.body.remarks;
                    ComplaintImg.mv('./public/images/complaints/' + fileName, (err) => {
                        if (err) {
                            return res.json({
                                status: false,
                                message: err.message
                            });
                        } else {
                            connection.query("INSERT INTO ComplaintTbl(OrderId, ComplaintImg, Remarks, ComplaintStatus, AssignedTo,CreatedAt) VALUES(" + orderId + " , '" + fileName + "', '" + remarks + "', 0, " + assignedTo + ", CURRENT_TIMESTAMP)", (err, result) => {
                                if (err) {
                                    res.json({
                                        status: false,
                                        message: err.message
                                    }).end()
                                } else {
                                    if (result.insertId > 0) {
                                        res.json({
                                            status: true,
                                            message: "Complaint saved successfully"
                                        })
                                    } else {
                                        res.json({
                                            status: true,
                                            message: "Your complaint is registered"
                                        })
                                    }

                                }
                            })
                        }
                    })

                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }
});

//Order list by customer id
router.get('/olistcust/:cid', (req, res) => {
    console.log(req.params.cid)
    let customerid = req.params.cid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.cid === undefined) {
        return res.json({
            status: false,
            message: "invalid Customer Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query('SELECT OrderId,CreatedAt FROM `OrderTbl` WHERE CustomerId = ?', [customerid], (error, results, fields) => {
                        if (error) {
                            // res.redirect('/error')
                            res.json({
                                status: false,
                                message: err.message
                            }).end()
                        }
                        else {
                            var i
                            var cnt = 1
                            var newobj = [];
                            for (i = 0; i < results.length; i++) {

                                var tmpdate = results[i].CreatedAt;
                                var dt = format(tmpdate, 'dd-mm-yyyy');
                                newobj.push({
                                    'OrderId': results[i].OrderId,
                                    'CreatedAt': dt
                                })
                                cnt += 1
                            }
                            if (cnt > results.length) {
                                return res.json({
                                    flag: 0,
                                    success: "true",
                                    status: 200,
                                    categories: newobj,
                                    message: "Redirected"
                                })
                            }
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }

})

//Past job by installer id
router.get('/pastjob/:iid', (req, res) => {
    let installerid = req.params.iid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.iid === undefined) {
        return res.json({
            status: false,
            message: "invalid Installer Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query('SELECT JobId,OrderId,CreatedAt FROM JobTbl WHERE JobStatus=? and AssignedTo = ?', [2, installerid], (error, results, fields) => {
                        if (error) {
                            // res.redirect('/error')
                            return res.json({
                                status: false,
                                message: error.message
                            }).end()
                        }
                        else {
                            if (results.length > 0) {
                                var i
                                var cnt = 1
                                var newobj = [];
                                for (i = 0; i < results.length; i++) {

                                    var tmpdate = results[i].CreatedAt;
                                    var dt = format(tmpdate, 'dd-mm-yyyy');
                                    newobj.push({
                                        'JobId': results[i].JobId,
                                        'OrderId': results[i].OrderId,
                                        'CreatedAt': dt
                                    })
                                    cnt += 1
                                }
                                if (cnt > results.length) {
                                    return res.json({
                                        success: "true",
                                        status: 200,
                                        categories: newobj,
                                        message: "Past Job Founded"
                                    })
                                }
                            }
                            else {
                                return res.json({
                                    success: "true",
                                    status: 200,
                                    categoried: [],
                                    message: "No Past Job Founded"
                                })
                            }
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }

})

//In Process Job
router.get('/wipjob/:iid', (req, res) => {
    let installerid = req.params.iid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.iid === undefined) {
        return res.json({
            status: false,
            message: "invalid Installer Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query('SELECT JobId,OrderId,CreatedAt FROM JobTbl WHERE JobStatus=1 and AssignedTo = ?', [installerid], (error, results, fields) => {
                        if (error) {
                            // res.redirect('/error')
                            res.json({
                                status: false,
                                message: err.message
                            }).end()
                        }
                        else {
                            if (results.length > 0) {
                                var i
                                var cnt = 1
                                var newobj = [];
                                for (i = 0; i < results.length; i++) {

                                    var tmpdate = results[i].CreatedAt;
                                    var dt = format(tmpdate, 'dd-mm-yyyy');
                                    newobj.push({
                                        'JobId': results[i].JobId,
                                        'OrderId': results[i].OrderId,
                                        'CreatedAt': dt
                                    })
                                    cnt += 1
                                }
                                if (cnt > results.length) {
                                    return res.json({
                                        success: "true",
                                        status: 200,
                                        categories: newobj,
                                        message: "Past Job Founded"
                                    })
                                }
                            }
                            else {
                                return res.json({
                                    success: "true",
                                    status: 200,
                                    categoried: [],
                                    message: "No Past Job Founded"
                                })
                            }
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }

})

//PAST Complaint by CustomerID
router.get('/pastcomplaint/:cid', (req, res) => {
    let customerid = req.params.cid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.cid === undefined) {
        return res.json({
            status: false,
            message: "invalid Customer Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query('SELECT c.ComplaintId,c.OrderId,c.ComplaintStatus,c.CreatedAt FROM ComplaintTbl c, OrderTbl o WHERE c.OrderId = o.OrderId AND o.CustomerId = ?', [customerid], (error, results, fields) => {
                        if (error) {
                            // res.redirect('/error')
                            return res.json({
                                status: false,
                                message: error.message
                            }).end()
                        }
                        else {
                            if (results.length > 0) {
                                var i
                                var cnt = 1
                                var newobj = [];
                                for (i = 0; i < results.length; i++) {

                                    var tmpdate = results[i].CreatedAt;
                                    var dt = format(tmpdate, 'dd-mm-yyyy');
                                    newobj.push({
                                        'ComplaintId': results[i].ComplaintId,
                                        'OrderId': results[i].OrderId,
                                        'CreatedAt': dt
                                    })
                                    cnt += 1
                                }
                                if (cnt > results.length) {
                                    return res.json({
                                        success: "true",
                                        status: 200,
                                        categories: newobj,
                                        message: "Past Complaint Founded"
                                    })
                                }
                            }
                            else {
                                return res.json({
                                    success: "true",
                                    status: 200,
                                    categoried: [],
                                    message: "No Past Complaint Founded"
                                })
                            }
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }

})

//Complaint by InstallerId
router.get('/complaintlist/:iid', (req, res) => {
    let installerid = req.params.iid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.iid === undefined) {
        return res.json({
            status: false,
            message: "invalid Installer Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                var host = req.headers.host;
                var imagepath = host + "/images/complaints/";
                if (payload !== undefined) {
                    connection.query('SELECT * FROM ComplaintTbl WHERE AssignedTo = ?', [installerid], (error, results, fields) => {
                        if (error) {
                            // res.redirect('/error')
                            return res.json({
                                status: false,
                                message: error.message
                            }).end()
                        }
                        else {
                            // console.log(results)
                            if (results.length > 0) {
                                var i
                                var cnt = 1
                                var newobj = [];
                                for (i = 0; i < results.length; i++) {
                                    var tmpdate = results[i].CreatedAt;
                                    var dt = format(tmpdate, 'dd-mm-yyyy');
                                    newobj.push({
                                        'ComplaintId': results[i].ComplaintId,
                                        'OrderId': results[i].OrderId,
                                        'ComplaintImg': imagepath + results[i].ComplaintImg,
                                        'ComaplaintStatus': results[i].ComplaintStatus,
                                        'Remarks': results[i].Remarks,
                                        'CreatedAt': dt
                                    })
                                    cnt += 1
                                }
                                if (cnt > results.length) {
                                    return res.json({
                                        success: "true",
                                        status: 200,
                                        categories: newobj,
                                        message: "Complaint Founded"
                                    })
                                }
                            }
                            else {
                                return res.json({
                                    success: "true",
                                    status: 200,
                                    categoried: [],
                                    message: "No Complaint Founded"
                                })
                            }
                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }

})

//set Complaint status to completed
router.get('/setComplaintStatus/:id', (req, res) => {
    var complaintId = req.params.id;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.id === undefined) {
        return res.json({
            status: false,
            message: "invalid job Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query("UPDATE ComplaintTbl SET ComplaintStatus = 2 WHERE ComplaintId =" + complaintId, (err, result) => {
                        if (err) {
                            return res.json({
                                status: false,
                                message: err.message
                            })
                        } else {
                            if (result.changedRows > 0) {
                                res.json({
                                    status: true,
                                    message: "Complaint Status is changed successfully"
                                }).end();
                            } else {
                                res.json({
                                    status: true,
                                    message: "Something went wrong, please try again later"
                                }).end();
                            }

                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }
})

//Order details by orderid
router.get('/orderdetail/:oid', (req, res) => {
    const orderid = req.params.oid;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (req.params.oid === undefined) {
        return res.json({
            status: false,
            message: "invalid Order Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query('SELECT o.OrderId,u.UserName,u.Address,a.AreaName,s.ServiceName,w.TypeName,o.NODWarranty,o.CreatedAt FROM OrderTbl o,ServiceTbl s, WallpaperTypeTbl w, UserTbl u, AreaTbl a where u.AreaId = a.AreaId and u.UserId = o.CustomerId and o.ServiceId= s.ServiceId and o.TypeId=w.TypeId and o.OrderId=?', [orderid], (error, results, fields) => {
                        if (error) {
                            return res.json({
                                status: false,
                                message: err.message
                            }).end()
                        }
                        else {
                            connection.query('SELECT p.ProductId,c.CategoryName,p.ProductTitle,p.Price,p.Details,p.ProductImg FROM ProductTbl p,CategoryTbl c, OrderDetailsTbl od where p.CategoryId=c.CategoryId AND od.ProductId=p.ProductId AND od.OrderId=?', [orderid], (error, products, fields) => {
                                if (error) {
                                    return res.json({
                                        status: false,
                                        message: err.message
                                    }).end()
                                }
                                else {
                                    var host = req.headers.host;
                                    var imagepath = host + "/images/product";
                                    var tmpdate = results[0].CreatedAt;
                                    var dt = format(tmpdate, 'dd-mm-yyyy');
                                    var op = [];
                                    if (products.length > 0) {
                                        var i = 0;
                                        for (i = 0; i < products.length; i++) {
                                            var img = products[i].ProductImg;
                                            if (img !== undefined) {
                                                products[i].ProductImg = imagepath + '/' + img;
                                            }
                                        }
                                        op.push({
                                            'OrderId': results[0].OrderId,
                                            'UserName': results[0].UserName,
                                            'AreaName': results[0].AreaName,
                                            'Address': results[0].Address,
                                            'ServiceName': results[0].ServiceName,
                                            'TypeName': results[0].TypeName,
                                            'NODWarranty': results[0].NODWarranty,
                                            'product': products,
                                            'CreatedAt': dt
                                        })
                                        return res.json({
                                            status: true,
                                            message: "Order Details are found",
                                            categories: op
                                        })
                                    }
                                }
                            })
                        }
                    })

                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }
})

//set job status to completed
router.get('/setJobStatus/:id', (req, res) => {
    var jobId = req.params.id;
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    console.log(token);
    if (req.params.id === undefined) {
        return res.json({
            status: false,
            message: "invalid job Id"
        })
    }
    if (token === undefined) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    } else {
        if (token.startsWith("Bearer ")) {
            if (token) {
                token = token.slice(7, token.length).trimLeft();
                var payload
                try {
                    payload = jwt.verify(token, JWTKEY)
                    console.log('Payload for welcome :- ' + payload)
                } catch (e) {
                    if (e instanceof jwt.JsonWebTokenError) {
                        console.log(e)
                        return res.json({
                            message: e.message,
                            status: false
                        });
                    }
                }
                console.log(payload);
                if (payload !== undefined) {
                    connection.query("UPDATE JobTbl SET JobStatus = 2 WHERE JobId =" + jobId, (err, result) => {
                        if (err) {
                            return res.json({
                                status: false,
                                message: err.message
                            })
                        } else {
                            if (result.changedRows > 0) {
                                res.json({
                                    status: true,
                                    message: "Job Status is changed successfully"
                                }).end();
                            } else {
                                res.json({
                                    status: true,
                                    message: "Something went wrong, please try again later"
                                }).end();
                            }

                        }
                    })
                } else {
                    return res.json({
                        status: false,
                        message: "invalid token payload or token is expired"
                    })
                }

            } else {
                return res.json({
                    status: false,
                    message: "forbidden"
                })
            }
        } else {
            return res.json({
                status: false,
                message: "Invalid token"
            })
        }
    }
})

router.post('/addInquiry', (req, res) => {
    console.log(req.body);
    var name = req.body.name;
    var contactNo = req.body.contactNo;
    var emailId = req.body.emailId;
    var remarks = req.body.remarks;
    connection.query("INSERT INTO InquiryTbl(InquiryDate, Name, ContactNo, EmailId,Remarks, IsAttended) VALUES(CURRENT_TIMESTAMP, '" + name + "', '" + contactNo + "', '" + emailId + "', '" + remarks + "', 0)", (err, result) => {
        if (err) {
            return res.json({
                status: false,
                message: err.message
            })
        } else {
            if (result.insertId > 0) {
                res.json({
                    status: true,
                    message: "Inquiry registered successfully"
                }).end();
            } else {
                res.json({
                    status: true,
                    message: "Something went wrong, please try again later"
                }).end();
            }

        }
    })
})

module.exports = router;







