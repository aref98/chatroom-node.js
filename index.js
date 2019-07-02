const express = require("express");
const socketIO = require("socket.io");
const app = express();
const bodyParser = require('body-parser');
const MONGODB_URI='mongodb+srv://aref76:yfECepqaMZDCvE@cluster0-yewpe.mongodb.net/shop';
const session = require('express-session');
const mongoose=require('mongoose');
const mongoDBStore=require('connect-mongodb-session')(session);
const Customer = require('./models/customer');
const Operator = require('./models/operator');
const server=app.listen(9000);
const io = socketIO(server);
const customerRoutes = require('./routes/customer');
const operatorRoutes = require('./routes/operator');

//connection
mongoose.connect(MONGODB_URI,
    {
      useNewUrlParser:true
    }).
    then(result=>{
      console.log('connected!');
     
    }).catch(err=>{
      console.log(err);
    });
//////////////////////////////
app.use(bodyParser.urlencoded({ extended: false }));

const store=new mongoDBStore({
    uri:MONGODB_URI,
    collection:'Connection-Session'
  });
  app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false ,store:store})
  );

const path = require("path");
var users = {};
var name = '';
// var i=0;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/index',(req,res)=>{
    res.render('index');
   });

app.use('/customer', customerRoutes);
app.use('/operator', operatorRoutes);




app.get('/customer/:name', function(req, res){
    name = req.params.name;
    var message;
    Customer.findOne({username:name}).then(customer=>{
      hasOperator=customer.hasOperator;
      if(hasOperator){
        message='now you can chat with your operator';
      }
      res.render('customer/customer',{
        type:'customer',
        name:name,
        room:'',
        hasOperator:hasOperator,
        operator:'',
        message:message
    
        });
    })
    //res.sendFile(path.join(__dirname, "/index.html"));
   
});
app.get('/operator/:name', function(req, res){
    name = req.params.name;
    var room;
    var isAvailable;
    var message;
    //res.sendFile(path.join(__dirname, "/index.html"));
    Operator.findOne({username:name}).then(ope=>{
      room=ope.room;
      isAvailable=ope.isAvailable;
      if(!isAvailable){
        message='a customer needs your help';
      }
      res.render('customer/customer',{
        type:'operator',
        name:name,
        room:room,
        isAvailable:isAvailable,
        customer:'',
        message:message?message:'wait for a customer',
        operator:''
    
        });
    })
   
});

// socket
        
io.sockets.on("connection", function(socket){
    users[socket.id] = name;
    // console.log(name)
    // Customer.findOne({username:name}).then(ope=>{
    //   baseroom=ope.room;
    //   socket.on(baseroom, function(room){
    //         console.log(room);
    
    //         socket.join(room);
    //         socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    //     });
    //     socket.on("node new message", function(data){
    //         console.log('has entered')
    //         io.sockets.in(baseroom).emit('node news', users[socket.id] + ": "+ data);
        
    //     });
    // })
    if(Object.keys(users).length<=2){
    
    // node
    console.log(Object.keys(users).length);
    socket.on("nRoom", function(room){
        console.log(room);

        socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });
    socket.on("node new message", function(data){
        console.log('has entered')
        io.sockets.in("nRoom").emit('node news', users[socket.id] + ": "+ data);
    
    });
    }
    else if(Object.keys(users).length>2&&Object.keys(users).length<=4){
     
        console.log(Object.keys(users).length);
    socket.on("nRoom1", function(room){
        console.log(room);
      
                socket.join(room);
        socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
    });
    socket.on("node new message", function(data){
        console.log('has entered')
        io.sockets.in("nRoom1").emit('node news', users[socket.id] + ": "+ data);
    
    });

    }
    else if(Object.keys(users).length>4&&Object.keys(users).length<=6){
     
      console.log(Object.keys(users).length);
  socket.on("nRoom2", function(room){
      console.log(room);
    
              socket.join(room);
      socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
  });
  socket.on("node new message", function(data){
      console.log('has entered')
      io.sockets.in("nRoom2").emit('node news', users[socket.id] + ": "+ data);
  
  });

  }
    else if(Object.keys(users).length>6&&Object.keys(users).length<=8){
     
      console.log(Object.keys(users).length);
  socket.on("nRoom3", function(room){
      console.log(room);
    
              socket.join(room);
      socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
  });
  socket.on("node new message", function(data){
      console.log('has entered')
      io.sockets.in("nRoom3").emit('node news', users[socket.id] + ": "+ data);
  
  });

  }
  
    else if(Object.keys(users).length>8&&Object.keys(users).length<=10){
     
      console.log(Object.keys(users).length);
  socket.on("nRoom4", function(room){
      console.log(room);
    
              socket.join(room);
      socket.broadcast.in(room).emit("node new user", users[socket.id] + " new user has joined");
  });
  socket.on("node new message", function(data){
      console.log('has entered')
      io.sockets.in("nRoom4").emit('node news', users[socket.id] + ": "+ data);
  
  });

  }
  
    
 else {
    // python
    room="pRoom";
    console.log(room);
    socket.on("pRoom", function(room){
        socket.join(room);
        socket.broadcast.in(room).emit("python new user", users[socket.id] + " new user has joined");
    });

    socket.on("python new message", function(data){
        io.sockets.in("pRoom").emit('python news', users[socket.id] + ": "+ data);
    });
}
});
