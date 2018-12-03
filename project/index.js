const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const mongoose = require('mongoose');
const app =express();
var indexRouter = require('./routes/app');
//view engine setup
app.engine('handlebars',exphbs());
app.set('view engine', 'handlebars');
//mongoose


//static folder
app.use('/public', express.static(path.join(__dirname,'public')));

//body parser middleware

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/',(req,res) =>{res.render('form')});

app.get('/login', (req,res) => {res.render('login')});
app.get('/payment', (req,res) => {res.render('pay')});

app.post('/payment', indexRouter);

app.get('/checkout',(req,res)=>{res.render('checkout')});
app.post('/checkout',(req,res) =>{
  console.log(req.body);
  const useraddress=req.body.address;
  const usercity= req.body.city;
  const userstate=req.body.state;
  const userphone=req.body.phone;
  const chooseddeliveryOpts=req.body.deliveryOptions;
  var products;
  mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true }, function(err,db){
    if(err) throw err;
    console.log('connected to Database');
    var documen= {address:useraddress, city:usercity, state:userstate,phone:userphone, deliveryOptions:chooseddeliveryOpts};
    db.collection('urlinfo').insert(documen, function(err,records){
        if(err) throw err;
    });
   var products=db.collection('urlinfo').find({}, function(err,products){
        if(err){
            console.log(err);
            res.json(err);
        }
        else{
           // console.log("Products:"+products.address);
            res.render('payment');
        }
    });
    db.close();
  });
  
});
app.post('/send',(req,res) =>{console.log(req.body)
const rand=Math.floor((Math.random() * 100) + 54);
/*const output=`
<p>Have a contact request</p>
<h3> Contact Details</h3>
<ul>
<li>Name: ${req.body.name}</li>
<li>Company ${req.body.company}</li>
<li> Email: ${req.body.email}</li>
<li>Phone:  ${req.body.phone}</li>
</ul>
<h3>${req.body.message}</h3>

`;*/

let transporter = nodemailer.createTransport({
        service: 'gmail',
       // port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'vaishu93.b@gmail.com', // generated ethereal user
            pass: 'sonicview' // generated ethereal password
        },
		tls:{rejectunauthorized:false}
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"NodeMail Test" <vaishu93.b@gmail.com>', // sender address
        to: 'vaishnavi.bhadresh@gmail.com', // list of receivers
        subject: 'Ecommerce Login OTP ', // Subject line
        text: 'Please Enter the below OTP For login Confirmation', // plain text body
        html: "" +"<br><h2>OTP:"+ rand+"</h2>" // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		res.render('login',{msg:'OTP has been sent to your Registered Email Id. Please Enter it in Next Page'});
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});


app.listen(3000,() => console.log('Listening'));