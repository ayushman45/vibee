const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const { use } = require('express/lib/application');

const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/vibeeDB",{useNewUrlParser:true});

const userScheme={
    email:{
        type:String,
        required:true
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    about:String,
    instalink:String,
    ytlink:String,
    fblink:String,
    twitterlink:String,
    mobile:Number
};

const User=mongoose.model('User',userScheme);
module.exports=User;

app.route("/")
.get(function(req,res){
    res.render("home");
});


app.route("/login")
.get(function(req,res){
    res.render("login");
})
.post(function(req,res){
    const userId=req.body.email;
    const pass=req.body.password;
    
    User.findOne({email:userId},function(err,user){
        if(err){
        console.log(err);
        }
        else{
            if(user==null){
                res.render("signup")
            }
            else{
                
                console.log(user);
                if(pass==user.password&&userId==user.email){
                    res.render("account",{
                        fname:user.fname,
                        lname:user.lname,
                        uid:user.username,
                        instalink:user.instalink,
                        ytlink:user.ytlink,
                        fblink:user.fblink,
                        twitterlink:user.twitterlink,
                        about:user.about,
                        mail:user.email
                    });
                }
                else{
                    res.send("Password or email is wrong.<br><a href=\"/login\">Click Here to try again</a>");
                }
            }
            
        }
    });


});


app.route("/signup")
.get(function(req,res){
    res.render("signup");
})
.post(function(req,res){
    
    const newUser=new User({
        email:req.body.email,
        fname:req.body.fname,
        lname:req.body.lname,
        password:req.body.password,
        username:req.body.username
    });

    
    User.findOne({email:newUser.email},function(err,user){
        if(err){
        console.log(err);
        }
        else{
            if(user==null){
                newUser.save();
                res.render("login");
            }
            else{
                res.render("login");
                console.log(user);
            }
            
        }
    });

});


app.route("/:uid")
.get(function(req,res){
    const reqUser=req.params.uid;
   User.findOne({username:reqUser},function(err,user){
     if(err){
         console.log(err);
     }  
     else{
        if(user==null){
            res.render("err404");
        }
        else{
             res.render("creator",{
                 fname:user.fname,
                 lname:user.lname,
                 username:user.username,
                 instalink:user.instalink,
                 ytlink:user.ytlink,
                 fblink:user.fblink,
                 twitterlink:user.twitterlink,
                 about:user.about,
                 mail:user.email
             });
            }
     }
   });
   
    });
    



app.route("/:acc")





app.listen(3000,function(){
    console.log("Server started at port 3000");
});
