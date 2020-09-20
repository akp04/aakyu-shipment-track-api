const express = require('express');
var nodemailer = require('nodemailer');
//const bcrypt = require('bcrypt-nodejs');
var cors = require('cors');
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'akp04@',
      database : 'aakyushipping'
    }
  });

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// db.select('*').table('admin').then(data =>{
//     console.log(data);
// });

function send_email(blno) {
let sender_email;
let eta;
let shippingbill;
    db('docs').where({
        blno:blno
      }).select('*').then(data =>{
          sender_email = data[0].email;

        var text =  "BLNO : " + data[0].blno + "\n \n" +
                    "COTAINER NO : " + data[0].cno + "\n \n" + 
                    "SHIPPER : " + data[0].shipper + "\n \n" +
                    "PORT : " + data[0].port + "\n \n" +
                    "PKG : " + data[0].pkg + "\n \n" +
                    "GROSS WT : " + data[0].grosswt + "\n \n" +
                    "SHIPPING BILL NO: " + data[0].shippingbill + "\n \n" +
                    "STUFFING DATE : " + data[0].stuffingdate + "\n \n" +
                    "RAILOUT DATE : " + data[0].railoutdate + "\n \n" +
                    "TRAIN NO : " + data[0].trainno + "\n \n" +
                    "WAGON NO : " + data[0].wagonno + "\n \n" +
                    "PORT OF LOADING : " + data[0].portofloading + "\n \n" +
                    "VESSEL VOYAGE : " + data[0].vesselname + "\n \n" +
                    "ON BOARD DATE : " + data[0].sobdate + "\n \n" +
                    "VESSEL VOYAGE : " + data[0].transvesselname + "\n \n" +
                    "VESSEL DATE : " + data[0].transvesseldate + "\n \n" +
                    "ETA DESTINATION : " + data[0].eta + "\n \n" +
                    "D/O : " + data[0].d_o + "\n \n";
        
          var user = "customer@aakyushipping.com";
          var pass = "aakyushipping@321";
          //var body = "Hi bro";
         
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: user,
            pass: pass
          }
        });
        
        var mailOptions = {
          from: 'customer@aakyushipping.com',
          to: sender_email,
          subject: 'BL-NO - ' + blno + ' : - Aakyu Shipment Status',
          text: text
          //text: "<h2>hellooooo</h2>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            //console.log(error);
          } else {
            //console.log('Email sent: ' + info.response);
            //res.json("y");
          }
        });
      })
}

app.get('/', (req, res) => {res.send("working!")})

app.post('/client/blno', (req, res) => {
    const {blno} = req.body;
    db('docs').where({
        blno:blno
      }).select('*').then(data =>{
        //console.log(data);
        if(data.length > 0)
            res.json(data);
        else
            res.json("n");
    })
    .catch(e => {
        //console.error(e);
            res.json("e");
      });
})

app.post('/admin/authenticate', (req, res) => {
    const {user, pass} = req.body;
    db('admin').where({
        username: user,
        password:  pass
      }).select('*').then(data =>{
        //console.log(data);
        if(user === data[0].username && pass === data[0].password)
            res.json("y");
        else
            res.json("n");
    })
    .catch(e => {
        //console.error(e);
        if(e)
            res.json("e");
      });
    
})

app.post('/admin/create_entry', (req, res) => {
    const {blno, email, cno, shipper, port, pkg, grosswt, shippingbill, stuffdate, portofloading, railoutdate, traino, wagono, sobdate, vesselname, transhippmentvesselname, transhippmentvesseldate, eta, d_o} = req.body;
    
    db('docs').insert({
        blno: blno,
        cno:cno,
        shipper:shipper,
        port:port,
        pkg:pkg,
        grosswt:grosswt,
        shippingbill:shippingbill,
        stuffingdate:stuffdate,
        portofloading:portofloading,
        railoutdate:railoutdate,
        trainno:traino,
        wagonno:wagono,
        sobdate:sobdate,
        vesselname:vesselname,
        transvesselname:transhippmentvesselname,
        transvesseldate:transhippmentvesseldate,
        eta:eta,
        d_o:d_o,
        email:email
    })
    .then(data => {
        //console.log(data);
        send_email(blno);
        res.json("y");
      })
    .catch(e => {
        //console.error(e);
            res.json("n");
      });
    
})

app.post('/admin/ask_for_update', (req, res) => {
    const {blno} = req.body;
    var flag = 0;
    db.select('blno').table('docs').then(data =>{
        //console.log(data);
        for(var item of data) {
            if(blno === item.blno) {
                flag = 1;
                res.json("y");
            }
            //console.log(item.blno);
        }
        if(flag === 0) {
            res.json("n");
        }
    });
    
})

app.post('/admin/ask_for_update_fill', (req, res) => {
  const {blno} = req.body;

  db('docs').where({
    blno:blno
  }).select('*').then(data =>{
    //console.log(data);
    res.json(data);
  })
  .catch(e => {
    //console.error(e);
        res.json("n");
  });

})


app.post('/admin/update_entry', (req, res) => {
    const {blno, email, cno, shipper, port, pkg, grosswt, shippingbill, stuffdate, portofloading, railoutdate, traino, wagono, sobdate, vesselname, transhippmentvesselname, transhippmentvesseldate, eta, d_o} = req.body;

        db('docs').where({
            blno:blno
        }).update({
          cno:cno,
          shipper:shipper,
          port:port,
          pkg:pkg,
          grosswt:grosswt,
          shippingbill:shippingbill,
          stuffingdate:stuffdate,
          portofloading:portofloading,
          railoutdate:railoutdate,
          trainno:traino,
          wagonno:wagono,
          sobdate:sobdate,
          vesselname:vesselname,
          transvesselname:transhippmentvesselname,
          transvesseldate:transhippmentvesseldate,
          eta:eta,
          d_o:d_o,
          email:email
        }).then(data => {
            //console.log("hey inside 2 - " + data);
            send_email(blno);
            res.json("y");    
        })
        .catch(e => {
            //console.error(e);
                res.json("n");
          });
          
    
    })
   

app.post('/admin/delete_entry', (req, res) => {
    const {blno} = req.body;
                db('docs').where({
                    blno:blno
                  }).delete().then(data =>{
                      if(data === 0) {
                        res.json("n");
                      }
                      else {
                        //console.log("rows deleted - " + data);
                        res.json("y");
                      }
                  })
              
                        
})

app.listen(process.env.PORT || 3001, () => {
	console.log( `app running on port ${process.env.PORT}`);
});
