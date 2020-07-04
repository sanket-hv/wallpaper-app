var connection = require('./../../config');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const { threadId } = require('./../../config');

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
    console.log('Request body is ' + req.body);
    const username = req.body.username;
    const password = req.body.password;

    //if username or password is null
    if (!username || !password) {
        return res.json({
            status: false,
            message: "forbidden"
        })
    }
    console.log(md5(password));
    connection.query("SELECT * FROM UserTbl WHERE Email ='" + username + "' AND Password = '" + md5(password) + "'", (err, user) => {
        if (err) {
            //error handling
            return res.json({
                status: false,
                message: "error" + err.message
            })
        } else {
            console.log(user[0])
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
    connection.query('SELECT * FROM CategoryTbl', (err, categories) => {
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
            var imagepath = host + "/images/products";
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
            var imagepath = host + "/images/products";
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
    connection.query('SELECT * FROM OfferTbl', (err, offers) => {
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
                                connection.query("INSERT INTO GalleryTbl(JobId, GalleryImg, Hidden, CreatedAt) VALUES(" + jobId + ", '" + fileName + "', 0, CURRENT_TIMESTAMP)", (err, result) => {
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
                    var customerId = req.body.customerId;
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
                            connection.query("INSERT INTO ComplaintTbl(CustomerId, OrderId, ComplaintImg, Remarks, ComplaintStatus, AssignedTo,CreatedAt) VALUES(" + customerId + "," + orderId + " , '" + fileName + "', '" + remarks + "', 0, " + assignedTo + ", CURRENT_TIMESTAMP)", (err, result) => {
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
    connection.query("INSERT INTO InquiryTbl(InquiryDate, Name, ContactNo, EmailId, IsAttended) VALUES(CURRENT_TIMESTAMP, '" + name + "', '" + contactNo + "', '" + emailId + "', 0)", (err, result) => {
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







