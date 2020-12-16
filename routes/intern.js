const express = require("express");
const router = express.Router();
const session = require("express-session");
const db = require("../util/database");
const isAuth = require("../util/isAuth");
const multer = require('multer');
var path = require('path');
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/blog/')
    },
    filename: (req, file, cb) => {
        x = req.session.uid + path.extname(file.originalname);
        let temp_name = file.originalname.replace(/\s/g, '_');
        // console.log(temp_name);
        cb(null, req.session.uid + "_" + temp_name);
    }
});
var stor = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "public/blog");
      },
      filename: (req, file, cb) => {
        x = req.session.uid + path.extname(file.originalname);
        let temp_name = file.originalname.save(/\s/g, '_');
        // console.log(temp_name);
        cb(null, req.session.uid + "_" + temp_name);
      },
      
});
var upload = multer({storage: storage});
var add = multer({stor:stor});


const {check, validationResult} = require('express-validator');
const { exit } = require("process");

var total_user, total_docs, total_blogs, type_docs=3;

router.get('/', isAuth, (req, res, next) => {
    db.execute('SELECT * FROM media ORDER BY `date_time` desc')
            .then(([media]) => {
                db.execute('SELECT COUNT(*) as cnt FROM USER WHERE type="user"')
                .then(([tot_user]) => {
                    db.execute('SELECT COUNT(*) as cnt FROM USER WHERE type="doctor" ')
                    .then(([tot_docs]) => {
                        
                        db.execute('SELECT COUNT(*) as cnt FROM media')
                        .then(([tot_media]) => {

                            db.execute('SELECT COUNT(*) as cnt FROM questions')
                            .then(([tot_ques]) => {
                                total_user = tot_user[0].cnt;
                                total_docs = tot_docs[0].cnt;
                                total_blogs = tot_media[0].cnt + tot_ques[0].cnt;
                                type_docs = 2;

                                // res.render("intern/blogs", {
                                //     page: 'blogs',
                                //     media: media,
                                //     type: req.session.type,
                                //     name: req.session.uname,
                                //     tot_user: total_user,
                                //     tot_docs: total_docs,
                                //     tot_blogs : total_blogs,
                                //     type_docs: type_docs,
                                // })
                                res.redirect("/question");

                            }).catch(err => console.log(err));
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                    
                }).catch(err => console.log(err));
});


//*******************************************************
// login and registration

//*********************************************************
//Registration

router.get('/register', (req, res, next) => {
    res.render("intern/register", {
        page: 'register',
        errormessage: ''
    })
});

router.post('/registration', [
    check('f_name')
        .not().isEmpty().withMessage("PLEASE FILL YOUR FIRST NAME")
        .isAlpha().withMessage("First Name must not contain digits"),
    check('l_name')
        .not().isEmpty().withMessage("PLEASE FILL YOUR LAST NAME")
        .isAlpha().withMessage("Last Name must not contain digits"),
    check('dob').not().isEmpty().withMessage("PLEASE ENTER YOUR BIRTH DATE"),
    check('email')
        .not().isEmpty().withMessage("PLEASE FILL YOUR EMAIL ID")
        .isEmail().withMessage("PLEASE ENTER A VALID EMAIL."),
    check('phone')
        .not().isEmpty().withMessage("PLEASE FILL YOUR CONTACT NO")
        .isLength({min: 10, max: 10}).withMessage("Please Enter Valid Contact No"),
    check('pass')
        .not().isEmpty().withMessage("PLEASE FILL YOUR PASSWORD")
        .isLength({min: 6}).withMessage("Password must be 6 characters long"),

    check('re-pass')
        .not().isEmpty().withMessage("PLEASE FILL YOUR CONFIRM PASSWORD FIELD")


], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render("intern/register", {
            page: 'register',
            // errorMsg: req.flash("error"),
            errormessage: errors.array()[0].msg
        })
    } else {

        if (req.body.doc === 'doc') {
            const f_name = req.body.f_name;
            const l_name = req.body.l_name;
            const gender = req.body.gender;
            const dob = req.body.dob;
            const email = req.body.email;
            const phone = req.body.phone;
            const pass = req.body.pass;
            const doc_id = req.body.doc_id;
            const cat = req.body.cat;
            const desc = req.body.desc;

            if (doc_id.length === 0 || cat.length === 0 || desc.length === 0) {
                // console.log('in');
                res.render("intern/register", {
                    page: 'register',
                    errormessage: 'FILL ALL DOCTORS DETAIL FILED'
                })
            } else {
                // console.log('out');
                db.execute('SELECT * FROM user WHERE email=? OR phone=?', [email, phone])
                    .then(([dd]) => {
                        if (dd.length === 0) {
                            db.execute('INSERT INTO `user`(`f_name`, `l_name`, `email`, `phone`, `gender`, `dob`, `password`, `type`) VALUES (?,?,?,?,?,?,?,?)', [f_name, l_name, email, phone, gender, dob, pass, 'doctor'])
                                .then(() => {
                                    db.execute('SELECT user_id FROM user WHERE email=?', [email])
                                        .then(([res]) => {
                                            // console.log(res[0].user_id);
                                            db.execute('INSERT INTO `doctor_detail`(`user_id`, `doctor_id`, `category`, `description`) VALUES (?,?,?,?)', [res[0].user_id, doc_id, cat, desc])
                                        }).catch(err => console.log(err));
                                }).catch(err => console.log(err))
                                .then(() => {
                                    res.redirect('/login');
                                });
                        }
                        else {
                            res.render("intern/register", {
                                page: 'register',
                                errormessage: 'Email Or Phone Number is already Registered'
                            })
                        }
                    }).catch(err => console.log(err));

            }

        } else {
            const f_name = req.body.f_name;
            const l_name = req.body.l_name;
            const gender = req.body.gender;
            const dob = req.body.dob;
            const email = req.body.email;
            const phone = req.body.phone;
            const pass = req.body.pass;

            db.execute('SELECT * FROM user WHERE email=? OR phone=?', [email, phone])
                .then(([dd]) => {
                    if (dd.length === 0) {
                        db.execute('INSERT INTO `user`(`f_name`, `l_name`, `email`, `phone`, `gender`, `dob`, `password`, `type`) VALUES (?,?,?,?,?,?,?,?)', [f_name, l_name, email, phone, gender, dob, pass, 'user'])
                            .catch(err => console.log(err))
                            .then(() => {
                                res.redirect('/login');
                            });
                    } else {
                        console.log('already a user');
                        res.redirect('/register');
                    }
                }).catch(err => console.log(err));

        }

    }

});


//login
router.get('/login', (req, res, next) => {
    res.render("intern/login", {
        page: 'login',
        errormessage: ''
    })
});

router.post('/login',
    check('pass').not().isEmpty().withMessage("PLEASE ENTER YOUR PASSWORD"),
    check('email').not().isEmpty().withMessage("PLEASE EMAIL OR PHONE PHONE NUMBER"),
    (req, res, next) => {
        // console.log("in");

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("intern/login", {
                page: 'login',
                errormessage: errors.array()[0].msg
            })
        } else {
            // console.log("in2");
            const email = req.body.email;
            const pass = req.body.pass;
            db.execute("SELECT * FROM USER WHERE email=? AND password=?", [email, pass])
                .then(([data]) => {
                    if (data.length == 0) {
                        // console.log("phone : ", email , " ",  pass);
                        db.execute("SELECT * FROM USER WHERE phone=? AND password=?", [email, pass])
                        .then(([data2]) => {
                            // console.log(data2);
                            if(data2.length == 0) {
                                res.render("intern/login", {
                                    page: 'login',
                                    errormessage: 'Incorrect Email Or Password'
                                }).console.error();        
                            }
                            else {
                                // console.log("else");
                                var sess = req.session;
                                sess.uid = data2[0].user_id;
                                sess.type = data2[0].type;
                                sess.stat = data2[0].status;
                                sess.uname = data2[0].f_name + " " + data2[0].l_name;
                                // console.log(sess.uid + " " + sess.type + " " + sess.uname);
                                res.redirect('/');
                            }
                        }).catch(err => console.log(err)); 
                    } else {
                        // console.log("else 2");
                        var sess = req.session;
                        sess.uid = data[0].user_id;
                        sess.type = data[0].type;
                        sess.stat = data[0].status;
                        sess.uname = data[0].f_name + " " + data[0].l_name;
                        // console.log(sess.uid + " " + sess.type + " " + sess.uname);
                        res.redirect('/');
                    }
                }).catch(err => console.log(err));
        }
    });

//--------------------------------------------
//blogs
router.get('/blogs/add_blogs', isAuth, (req, res, next) => {
   let user_id =  req.session.uid;
    db.execute("SELECT * FROM user WHERE user_id=?", [user_id])
        .then(([media]) => {
            res.render("intern/add_blogs", {
                page: 'add_blogs',
                media: media,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});

router.post('/blogs/add_blogs', upload.single('file'), isAuth, (req, res, next) => {   
    let user_id =  req.session.uid;
    
    
    let desc = req.body.desc;
    let title = req.body.title;
 

    if (req.body.link1) {
        // for video
        let link1 = req.body.link1;
        let you_link;
        
        if (link1.indexOf('embed') > 0) {
            you_link = link1;
        } else {
            you_link = "https://www.youtube.com/embed/" + link1.split("v=")[1].substring(0, 11);
        }
         db.execute("INSERT INTO `media` (`media_desc`, `media_title`, `media`, `user_id`,`media_type`) VALUES (?,?,?,?,?) ",[desc,title,you_link,user_id,'video'])
        .then(() => {
            res.redirect('/blogs')

        }).catch(err => console.log(err));
      
    } else if (req.file) {
      
        let image = req.file.filename;
        db.execute("INSERT INTO `media` (`media_desc`, `media_title`, `media`, `user_id`,`media_type`) VALUES (?,?,?,?,?) ",[desc,title,image,user_id,'image'])
        .then(() => {
            res.redirect('/blogs')
        }).catch(err => console.log(err));
      
    } else if(req.body.add_text){
        //console.log(user_id,desc,title,req.body.add_text);
        // for text type
        db.execute("INSERT INTO `media` (`media_desc`, `media_title`, `media`, `user_id`,`media_type`) VALUES (?,?,?,?,?) ",[desc,title,req.body.add_text,user_id,'Text'])
            .then(() => {
                res.redirect('/blogs')
            }).catch(err => console.log(err));
           }
});


router.get('/blogs', isAuth, (req, res, next) => {
    db.execute('SELECT * FROM media ORDER BY `date_time` desc')
        .then(([media]) => {
                res.render("intern/blogs", {
                 page: 'blogs',
                 media: media,
                 type: req.session.type,
                 name: req.session.uname,
                 tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
             })
            }).catch(err => console.log(err));
                      
 });
 
 


router.get('/blog/view_blog', isAuth, (req, res, next) => {
    let media_id = req.body.media_id;
    db.execute("SELECT * FROM media WHERE media_id=? ORDER BY " , [media_id])
        .then(([media]) => {
            res.render("intern/view_blogs", {
                page: 'update_blog',
                media: media,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                tot_docs: total_docs,
                tot_blogs : total_blogs,
                type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});

router.get('/blog_update', isAuth, (req, res, next) => {
    db.execute('SELECT * FROM media WHERE user_id=? ORDER BY date_time DESC', [req.session.uid])
        .then(([media]) => {
            res.render("intern/list_blogs", {
                page: 'update_blog',
                media: media,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});


router.post('/blog/view_blog', isAuth, (req, res, next) => {
    let media_id = req.body.media_id;
    db.execute("SELECT * FROM media WHERE media_id=?", [media_id])
        .then(([media]) => {
            res.render("intern/view_blogs", {
                page: 'update_blog',
                media: media,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                tot_docs: total_docs,
                tot_blogs : total_blogs,
                type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});

router.post('/delete_blog', isAuth, (req, res, next) => {
    let media_id = req.body.media_id;
    db.execute("DELETE FROM media WHERE media_id=?", [media_id])
        .then(() => {
            res.redirect('/blog_update')
        }).catch(err => console.log(err));
});

router.post('/update_blog', upload.single('file'), isAuth, (req, res, next) => {
    let media_id = req.body.media_id;
    let desc = req.body.desc;
    let title = req.body.title;
    if (req.body.link1) {
        // for video
        let link1 = req.body.link1;
        let you_link;
        if (link1.indexOf('embed') > 0) {
            you_link = link1;
        } else {
            you_link = "https://www.youtube.com/embed/" + link1.split("v=")[1].substring(0, 11);
        }
        db.execute("UPDATE media SET media_desc=?,media_title=?,media=? WHERE media_id=?", [desc, title, you_link, media_id])
            .then(() => {
                res.redirect('/blog_update')
            }).catch(err => console.log(err));
    } else if (req.file) {
        const image = req.file.filename;
        // console.log("in photo" + " " + image);
        db.execute("UPDATE media SET media_desc=?,media_title=?,media=? WHERE media_id=?", [desc, title, image, media_id])
            .then(() => {
                res.redirect('/blog_update')
            }).catch(err => console.log(err));
    } else {
        console.log("also in text");
        // for text type
        db.execute("UPDATE media SET media_desc=?,media_title=? WHERE media_id=?", [desc, title, media_id])
            .then(() => {
                res.redirect('/blog_update')
            }).catch(err => console.log(err));
    }


});


//*********************************************
// user,doctor chat ...


router.get('/chat', isAuth, (req, res, next) => {
    let report = "";
    if (req.query.report) {
        report = req.query.report;
    }
    var sess = req.session;
    if (req.session.type === "user") {
        db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE type='doctor' AND status=1 AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)", [sess.uid, sess.uid])
            .then(([doc_list]) => {
                db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                    .then(([chat_his]) => {
                        res.render("intern/chat", {
                            page: 'chat',
                            doc_list: doc_list,
                            chat_his: chat_his,
                            sender: sess.uid,
                            stat: req.session.stat,
                            home: '',
                            report: report,
                            type: req.session.type,
                            name: req.session.uname,
                            tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                        })
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    } else if (req.session.type === "admin") {
        db.execute("SELECT * FROM user p1 WHERE type='user' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)", [sess.uid, sess.uid])
            .then(([doc_list]) => {
                db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                    .then(([chat_his]) => {
                        db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE type='doctor' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)", [sess.uid, sess.uid])
                            .then(([extra]) => {
                                res.render("intern/chat", {
                                    page: 'chat',
                                    doc_list: doc_list,
                                    chat_his: chat_his,
                                    sender: sess.uid,
                                    stat: req.session.stat,
                                    extra: extra,
                                    report: report,
                                    home: '',
                                    type: req.session.type,
                                    name: req.session.uname,
                                    tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                                })
                            }).catch(err => console.log(err));

                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    }
    else {
        db.execute("SELECT * FROM user p1 WHERE type='user' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)", [sess.uid, sess.uid])
            .then(([doc_list]) => {
                db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                    .then(([chat_his]) => {
                        res.render("intern/chat", {
                            page: 'chat',
                            doc_list: doc_list,
                            chat_his: chat_his,
                            sender: sess.uid,
                            stat: req.session.stat,
                            home: '',
                            report: report,
                            type: req.session.type,
                            name: req.session.uname,
                            tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                        })
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    }
});

router.get('/Chat/doctor', (req, res, next) => {
    res.render("intern/chat_page", {
        page: "chatDoctor",
        type: req.session.type,
        name: req.session.uname,
        tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
    })
});

router.post('/doctorChat', isAuth, (req, res, next) => {
    if (req.body.search_btn) {
        // res.redirect('/Chat?dd=' + req.body.search_btn);
        var sess = req.session;
        if (req.session.type === "user") {
            db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE type='doctor' AND status=1 AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?) AND MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [sess.uid, sess.uid, req.body.search_btn])
                .then(([doc_list]) => {
                    db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                        .then(([chat_his]) => {
                            res.render("intern/chat", {
                                page: 'chat',
                                doc_list: doc_list,
                                chat_his: chat_his,
                                sender: sess.uid,
                                stat: req.session.stat,
                                home: 'search',
                                type: req.session.type,
                                name: req.session.uname,
                                tot_user: total_user,
                                tot_docs: total_docs,
                                tot_blogs : total_blogs,
                                type_docs: type_docs,
                            })
                        })
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        } else if (req.session.type === "admin") {
            db.execute("SELECT * FROM user p1 WHERE type='user' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)  AND MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [sess.uid, sess.uid, req.body.search_btn])
                .then(([doc_list]) => {
                    db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                        .then(([chat_his]) => {
                            db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE type='doctor' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?)  AND MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [sess.uid, sess.uid, req.body.search_btn])
                                .then(([extra]) => {
                                    res.render("intern/chat", {
                                        page: 'chat',
                                        doc_list: doc_list,
                                        chat_his: chat_his,
                                        sender: sess.uid,
                                        stat: req.session.stat,
                                        extra: extra,
                                        home: 'search',
                                        type: req.session.type,
                                        name: req.session.uname,
                                        tot_user: total_user,
                                        tot_docs: total_docs,
                                        tot_blogs : total_blogs,
                                        type_docs: type_docs,
                                    })
                                }).catch(err => console.log(err));

                        })
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        } else {
            db.execute("SELECT * FROM user p1 WHERE type='user' AND p1.user_id NOT IN (SELECT receive_id FROM chat WHERE sender_id=?) AND p1.user_id NOT IN (SELECT sender_id FROM chat WHERE receive_id=?) AND MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [sess.uid, sess.uid, req.body.search_btn])
                .then(([doc_list]) => {
                    db.execute("SELECT * FROM chat p1 JOIN user p2 ON p1.sender_id=p2.user_id OR p1.receive_id=p2.user_id WHERE sender_id=? OR receive_id=? ORDER BY date_time DESC", [sess.uid, sess.uid])
                        .then(([chat_his]) => {
                            res.render("intern/chat", {
                                page: 'chat',
                                doc_list: doc_list,
                                chat_his: chat_his,
                                type: req.session.type,
                                name: req.session.uname,
                                sender: sess.uid,
                                stat: req.session.stat,
                                home: 'search',
                                tot_user: total_user,
                                tot_docs: total_docs,
                                tot_blogs : total_blogs,
                                type_docs: type_docs,
                            })
                        })
                        .catch(err => console.log(err));

                })
                .catch(err => console.log(err));
        }
    } else {
        res.redirect('/Chat/');
    }
});


router.get('/newdoctorChat', isAuth, (req, res, next) => {
    if (req.query.uid) {
        if (req.session.type === 'user') {
            db.execute("INSERT INTO chat(detail, sender_id, receive_id) VALUES (?,?,?)", ["Hii, How can i help you?", req.query.uid, req.session.uid]);
            res.redirect('/newdoctorChat?old=yes&doc_id=' + req.query.uid);
        } else if (req.session.type === 'admin') {
            db.execute("INSERT INTO chat(detail, sender_id, receive_id) VALUES (?,?,?)", ["Hello, I'm a Admin", req.session.uid, req.query.uid]);
            res.redirect('/newdoctorChat?old=yes&doc_id=' + req.query.uid);
        }
        else {
            db.execute("INSERT INTO chat(detail, sender_id, receive_id) VALUES (?,?,?)", ["Hello, I'm a Doctor", req.session.uid, req.query.uid]);
            res.redirect('/newdoctorChat?old=yes&doc_id=' + req.query.uid);
        }
    }
    else if (req.query.old) {
        const doc_id = req.query.doc_id;
        if (req.session.type === "user") {
            db.execute("SELECT * FROM chat WHERE (sender_id=? AND receive_id=?) OR (receive_id=? AND sender_id=?) ORDER BY date_time", [doc_id, req.session.uid, doc_id, req.session.uid])
                .then(([chats]) => {
                    db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE p1.user_id=?", [doc_id])
                        .then(([doc_detail]) => {
                            db.execute("SELECT * FROM user p1 WHERE p1.user_id=?", [doc_id])
                                .then(([tempo]) => {
                                    res.render("intern/chat_page", {
                                        page: 'chatDoctor',
                                        type: req.session.type,
                                        doc_detail: doc_detail,
                                        chats: chats,
                                        user: req.session.uid,
                                        tempo: tempo,
                                        stat: req.session.stat,
                                        name: req.session.uname,
                                        tot_user: total_user,
                                        tot_docs: total_docs,
                                        tot_blogs : total_blogs,
                                        type_docs: type_docs,
                                    })
                                }).catch(err => console.log(err));

                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));
        } else if (req.session.type === "admin") {
            db.execute("SELECT * FROM chat WHERE (sender_id=? AND receive_id=?) OR (receive_id=? AND sender_id=?) ORDER BY date_time", [doc_id, req.session.uid, doc_id, req.session.uid])
                .then(([chats]) => {
                    db.execute("SELECT * FROM user p1 WHERE p1.user_id=?", [doc_id])
                        .then(([doc_detail]) => {
                            res.render("intern/chat_page", {
                                page: 'chatDoctor',
                                type: req.session.type,
                                doc_detail: doc_detail,
                                chats: chats,
                                user: req.session.uid,
                                stat: req.session.stat,
                                // type: req.session.type,
                                name: req.session.uname,
                                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                            })
                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));
        } else {
            db.execute("SELECT * FROM chat WHERE (sender_id=? AND receive_id=?) OR (receive_id=? AND sender_id=?) ORDER BY date_time", [doc_id, req.session.uid, doc_id, req.session.uid])
                .then(([chats]) => {
                    db.execute("SELECT * FROM user p1 WHERE p1.user_id=?", [doc_id])
                        .then(([doc_detail]) => {
                            res.render("intern/chat_page", {
                                page: 'chatDoctor',
                                type: req.session.type,
                                doc_detail: doc_detail,
                                chats: chats,
                                user: req.session.uid,
                                stat: req.session.stat,
                                // type: req.session.type,
                                name: req.session.uname,
                                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                            })
                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));
        }

    }
    else {
        // res.redirect('/');
    }
});


router.post('/chat-message', isAuth, (req, res, next) => {
    const chatdata = req.body.chatdata;
    const doc_id = req.body.doc_id;

    db.execute("INSERT INTO chat(detail, sender_id, receive_id) VALUES (?,?,?)", [chatdata, req.session.uid, doc_id])
        .then(() => {
            res.redirect('/newdoctorChat?old=yes&doc_id=' + doc_id + "#end");
        });


});

router.post('/report-doctor', isAuth, (req, res, next) => {
    const email = req.body.doc_email;
    const message = req.body.message;
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "internship.daiict@gmail.com",
            pass: "Daiict@123"
        }
    });

    let mailOptions = {
        from: "internship.daiict@gmail.com",
        to: email,
        subject: "Report By User",
        text: `One or more users report you. Reason is 
            Message : ${message}
            if this reason is not true than contact us using this email id.
            reported by: ${req.session.uname} `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // res.render("/", {
            //     errorMsg: req.flash("error"),
            //     page: "index",
            //     errormessage: "we can't able to send you mail."
            // });
            res.redirect("/chat?report=failed");
        } else {
            res.redirect("/chat?report=success");
        }
    });
});


//**************************************************
// Question And Answers

router.get('/question', isAuth, (req, res, next) => {
    db.execute("SELECT DISTINCT category FROM doctor_detail ORDER BY category")
        .then(([category]) => {
            db.execute("SELECT *,p1.question_id AS qid, p1.status AS q_stat FROM questions p1 JOIN user p2 ON p1.user_id=p2.user_id ORDER BY p1.date_time DESC ")
                .then(([ques]) => {
                    db.execute("SELECT t1.user_id AS doc_id,t1.answer_detail,t1.question_id,t1.ans_date_time,t1.answer_id,t2.f_name AS doc_f_name,t2.l_name AS doc_l_name,t2.email AS doc_email,t2.gender AS doc_gender,t2.image AS doc_image,t2.status AS doc_status,t3.doctor_id,t3.category,t3.description FROM answers t1 JOIN user t2 ON t1.user_id=t2.user_id JOIN doctor_detail t3 ON t1.user_id=t3.user_id ORDER BY t1.question_id")
                        .then(([ans]) => {
                            res.render("intern/question", {
                                page: 'question',
                                ques: ques,
                                ans: ans,
                                type: req.session.type,
                                category: category,
                                stat: req.session.stat,
                                // type: req.session.type,
                                name: req.session.uname,
                                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                            })
                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});


router.post('/questionData', (req, res, next) => {
    // console.log(req.session.uid, 1, req.body.title, req.body.detail, req.body.category);
    if (req.body.name) {
        db.execute("INSERT INTO questions(user_id, status, title, question_detail, question_category) VALUES (?,?,?,?,?)", [req.session.uid, 1, req.body.title, req.body.detail, req.body.category])
            .catch(err => console.log(err));
        res.redirect('/question');
    } else {
        db.execute("INSERT INTO questions(user_id, title, question_detail, question_category) VALUES (?,?,?,?)", [req.session.uid, req.body.title, req.body.detail, req.body.category])
            .catch(err => console.log(err));
        res.redirect('/question');

    }
});


router.post('/answer', (req, res, next) => {
    db.execute("INSERT INTO answers(answer_detail, user_id, question_id) VALUES (?,?,?)", [req.body.ans, req.session.uid, req.body.qid])
        .then(() => {
            res.redirect('/question');
        });
});

//search

router.post('/search_ques', isAuth, (req, res, next) => {
    let searchData = req.body.searchData;
    db.execute("SELECT DISTINCT category FROM doctor_detail ORDER BY category")
        .then(([category]) => {
            db.execute("SELECT *,p1.question_id AS qid, p1.status AS q_stat FROM questions p1 JOIN user p2 ON p1.user_id=p2.user_id WHERE MATCH(p1.title,p1.question_category,p1.question_detail) AGAINST (?)", [searchData])
                .then(([ques]) => {
                    db.execute("SELECT t1.user_id AS doc_id,t1.answer_detail,t1.question_id,t1.ans_date_time,t1.answer_id,t2.f_name AS doc_f_name,t2.l_name AS doc_l_name,t2.email AS doc_email,t2.gender AS doc_gender,t2.image AS doc_image,t2.status AS doc_status,t3.doctor_id,t3.category,t3.description FROM answers t1 JOIN user t2 ON t1.user_id=t2.user_id JOIN doctor_detail t3 ON t1.user_id=t3.user_id ORDER BY t1.question_id")
                        .then(([ans]) => {
                            res.render("intern/question", {
                                page: 'question',
                                ques: ques,
                                ans: ans,
                                type: req.session.type,
                                name: req.session.uname,
                                category: category,
                                stat: req.session.stat,
                                tot_user: total_user,
                                tot_docs: total_docs,
                                tot_blogs : total_blogs,
                                type_docs: type_docs,
                            })
                        }).catch(err => console.log(err));

                }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});
//******************************************************


router.get('/users',isAuth, (req, res, next) => {
    db.execute("SELECT * FROM user")
        .then(([user_list]) => {
            res.render("intern/users", {
                page: 'users',
                user_list: user_list,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});

router.get('/search_user',isAuth, (req, res, next) => {
    const userName = req.query.userSearch;
    console.log("name to search", userName);
    db.execute("SELECT * FROM user")
        .then(([user_list]) => {
            db.execute("SELECT * FROM user p1 WHERE MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [userName])
                .then(([user_list]) => {
                    res.render("intern/users", {
                        page: 'users',
                        user_list: user_list,
                        type: req.session.type,
                        name: req.session.uname,
                        tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                    })
                }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

router.get('/blockUser',isAuth, (req, res, next) => {
    const uid = req.query.uid;
    const email=req.query.email;
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "internship.daiict@gmail.com",
            pass: "Daiict@123"
        }
    });
    let mailOptions = {
        from: "internship.daiict@gmail.com",
        to: email,
        subject: "Block by Admin",
        text: `The Admin has blocked you! `
    };
    console.log('inside blockuser uid:', uid);
    db.execute("UPDATE user SET status=2 WHERE user_id=?", [uid])
        .catch(err => console.log(err));

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.redirect("/users");
            } else {
                res.redirect("/users");
            }
        });
    res.redirect('/users');
});

router.get('/blockDoctor',isAuth, (req, res, next) => {
    const uid = req.query.uid;
    console.log('inside blockdoctor uid:', uid);
    db.execute("UPDATE user SET status=2 WHERE user_id=?", [uid])
        .catch(err => console.log(err));
    res.redirect('/doctors');
});

router.get('/unblockUser',isAuth, (req, res, next) => {
    const uid = req.query.uid;
    const email=req.query.email;
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "internship.daiict@gmail.com",
            pass: "Daiict@123"
        }
    });
    let mailOptions = {
        from: "internship.daiict@gmail.com",
        to: email,
        subject: "Unblock by Admin",
        text: `The Admin has unblocked you! `
    };
    console.log('inside unblockuser uid:', uid);
    db.execute("UPDATE user SET status=0 WHERE user_id=?", [uid])
        .catch(err => console.log(err));

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.redirect("/users");
            } else {
                res.redirect("/users");
            }
        });
    res.redirect('/users');
});

router.get('/unblockDoctor',isAuth, (req, res, next) => {
    const uid = req.query.uid;
    console.log('inside unblockdoctor uid:', uid);
    db.execute("UPDATE user SET status=0 WHERE user_id=?", [uid])
        .catch(err => console.log(err));
    res.redirect('/doctors');
});

router.get('/falsifyDoc' ,isAuth, (req, res, next) => {
    const uid = req.query.uid;
    console.log('inside falsify uid:', uid);
    db.execute("UPDATE user SET status=0 WHERE user_id=?", [uid])
        .catch(err => console.log(err));
    res.redirect('/doctors');
});

router.get('/verifyUser',isAuth, (req, res, next) => {
    const uid = req.query.uid;
    console.log('inside verifyuser uid:', uid);
    db.execute("UPDATE user SET status=1 WHERE user_id=?", [uid])
        .catch(err => console.log(err));
    res.redirect('/doctors');
});


router.get('/doctors',isAuth, (req, res, next) => {
    db.execute("SELECT * FROM user JOIN doctor_detail ON user.user_id=doctor_detail.user_id WHERE user.type='doctor'")
        .then(([doc_list]) => {
            res.render("intern/doctors", {
                page: 'doctors',
                doc_list: doc_list,
                type: req.session.type,
                name: req.session.uname,
                tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
            })
        }).catch(err => console.log(err));
});

router.get('/search_doc',isAuth, (req, res, next) => {
    const userName = req.query.userSearch;
    console.log("name to search", userName);
    db.execute("SELECT * FROM user JOIN doctor_detail ON user.user_id=doctor_detail.user_id WHERE user.type='doctor'")
        .then(([doc_list]) => {
            db.execute("SELECT * FROM user p1 JOIN doctor_detail ON p1.user_id=doctor_detail.user_id WHERE p1.type='doctor' AND MATCH(p1.f_name,p1.l_name,p1.email) AGAINST (?)", [userName])
                .then(([doc_list]) => {
                    res.render("intern/doctors", {
                        page: 'doctors',
                        doc_list: doc_list,
                        type: req.session.type,
                        name: req.session.uname,
                        tot_user: total_user,
                                    tot_docs: total_docs,
                                    tot_blogs : total_blogs,
                                    type_docs: type_docs,
                    })
                }).catch(err => console.log(err));

        }).catch(err => console.log(err));
});

router.get('/edit_profile', isAuth, (req, res, next) => {
    var sess = req.session;
    let uid = sess.uid;
    let type = sess.type;
    let stat = sess.stat;
    if (type === 'doctor') {
        db.execute("SELECT * FROM user p1 JOIN doctor_detail p2 ON p1.user_id=p2.user_id WHERE p1.user_id=?", [uid])
            .then(([data]) => {
                db.execute("SELECT DISTINCT category FROM doctor_detail ORDER BY category")
                    .then(([category]) => {
                        res.render("intern/edit_profile", {
                            page: 'edit_profile',
                            type: type,
                            stat: stat,
                            data: data[0],
                            category: category,
                            // type: req.session.type,
                            name: req.session.uname,
                        })
                    }).catch(err => console.log(err));

            }).catch(err => console.log(err));
    } else {
        db.execute("SELECT * FROM user WHERE user_id=?", [uid])
            .then(([data]) => {
                res.render("intern/edit_profile", {
                    page: 'edit_profile',
                    type: type,
                    stat: stat,
                    data: data[0],
                    // type: req.session.type,
                    name: req.session.uname,
                })
            }).catch(err => console.log(err));
        
    }

});


router.post('/edit_profile_data', (req, res, next) => {
    let uid = req.session.uid;
    let npass = req.body.pass;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let phone = req.body.phone;
    let dob = req.body.dob;
    let gender = req.body.gender;
    if (npass.length !== 0) {
        db.execute("UPDATE `user` SET `f_name`=?,`l_name`=?,`phone`=?,`gender`=?,`password`=? WHERE user_id=?", [f_name, l_name, phone, gender, npass, uid])
            .catch(err => console.log(err));
        req.session.uname = f_name + " " + l_name;

    } else {
        db.execute("UPDATE `user` SET `f_name`=?,`l_name`=?,`phone`=?,`gender`=? WHERE user_id=?", [f_name, l_name, phone, gender, uid])
            .catch(err => console.log(err));
        req.session.uname = f_name + " " + l_name;
    }
    if (req.session.type === 'doctor') {
        let doc_id = req.body.doc_id;
        let desc = req.body.desc;
        let cat = req.body.category;

        db.execute("UPDATE `doctor_detail` SET `doctor_id`=?,`category`=?,`description`=? WHERE `user_id`=?", [doc_id, cat, desc, uid])
            .catch(err => console.log(err));
    }
    res.redirect("/");

});

router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect("/login");

});

router.get('/forgot-pass', (req, res, next) => {

    res.render("intern/forgotpass", {
        page: 'forgot',
        errormessage: '',
        sucess: ""
    });
});

router.post('/forgot-pass', (req, res, next) => {
    let error = '';
    const email = req.body.email;
    const phone = req.body.phone;

    db.execute("SELECT * FROM user WHERE email=?", [email])
        .then(([users]) => {
            if (users.length !== 0) {
                db.execute("SELECT * FROM user WHERE email=? AND phone=?", [email, phone])
                    .then(([user1]) => {
                        if (user1.length !== 0) {
                            var transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: "internship.daiict@gmail.com",
                                    pass: "Daiict@123"
                                }
                            });

                            let mailOptions = {
                                from: "internship.daiict@gmail.com",
                                to: email,
                                subject: "Forgot Password",
                                text: `Your password is:  
                                 ${user1[0].password}
                                if you haven't request for password than please change it immediately.`
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                    res.render("intern/forgotpass", {
                                        page: 'forgot',
                                        errormessage: error,
                                        sucess: "no"
                                    });
                                    // res.redirect("/chat?report=failed");
                                } else {
                                    res.render("intern/forgotpass", {
                                        page: 'forgot',
                                        errormessage: error,
                                        sucess: "yes"
                                    });
                                }
                            });
                        } else {
                            error = "Check your phone number and try again!"
                            res.render("intern/forgotpass", {
                                page: 'forgot',
                                errormessage: error,
                                sucess: ""
                            });
                        }
                    }).catch(err => console.log(err))
            } else {

                error = "Check your email id and try again!"
                res.render("intern/forgotpass", {
                    page: 'forgot',
                    errormessage: error,
                    sucess: ""
                });
            }
        }).catch(err => console.log(err))

});

exports.routes = router;