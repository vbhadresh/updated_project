var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var cardDetailsSchema = mongoose.Schema({
    cardHolderName : {
        type : String
        //required : true
    },

    cardNumber : {
        type : Number
        //required : true
    },

    expiryMonth : {
        type : Number
        //required : true
    },
    expiryYear : {
        type : Number
        //required : true
    },
    CVV : {
        type : Number
        //required : true
    }
    
});
router.post('/payment',function(req,res,next){
    console.log(req.body);
   // cardDetailsSchema.create(req.body,res);
    //console.log(res.json());
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
        from: '"Order-Confirmation Mail" <vaishu93.b@gmail.com>', // sender address
        to: 'vaishnavi.bhadresh@gmail.com', // list of receivers
        subject: 'Order Confirmation Mail ', // Subject line
        text: 'Your Details is attached as below ', // plain text body
        html: '<h2>Your Details is attached as below</h2>'  // html body
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

module.exports = router ;