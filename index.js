var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.set("view engine" , "ejs")
app.set("views" ,"./views")


let users = [
  {
      id:1,
      name : "Long",
      phone:"034498758"
  },
  {
      id :2,
      name : "Linh",
      phone:"012774658"
  },  
  {
      id :3,
      name : "Truc",
      phone:"082949888"
  }
]

app.get('/', (req, res) => {
    res.render("index")
});

let manageUser =["longbody"];

io.on('connection', (socket) => {
    console.log('a user connected '+socket.id);
    socket.on('client-send-username', function(data){
        if(manageUser.indexOf(data) >=0 ){
            socket.emit("server-send-register-false")
        }
        else {
         manageUser.push(data)
         socket.userName = data
         socket.emit("server-send-register-success" , data)
         socket.emit("server-send-listUser" , manageUser)
        }
        // io.sockets.emit("Server-send-data" , data + "0000") // All
        // socket.emit("Server-send-data" , data + "0000") // send only own
        // socket.broadcast.emit("Server-send-data" , data + "0000") // except own
    });

    socket.on("client-send-message" , function(data){
        console.log(data)
        io.sockets.emit("server-send-message" , {userName : socket.userName , message : data})
    })

    socket.on("logout" , function(data){
        manageUser.splice(manageUser.indexOf(socket.userName) ,1)
        socket.broadcast.emit("server-send-listUser" , manageUser)
    })

    socket.on("someone-typing" , function(){
        let data = socket.userName
        console.log(data)
        socket.broadcast.emit("server-send-someone-typing" ,data)
    })

    socket.on("someone-stop-typing" , function(){
        socket.broadcast.emit("server-send-someone-stop-typing")
    })

    
    
    socket.on('disconnect', () => {
      console.log('user disconnected ');
    });
  });

  
http.listen(process.env.PORT, '0.0.0.0', () => {
  console.log('listening on *:3000');
});

app.get('/products/:id',function(req ,res){
    let id =req.params.id
    res.render("index")

})

app.get('/users',urlencodedParser,function(req ,res){
    res.render("user" ,{
        user : users
    })

})

app.get("/api" , (req ,res )=>{
    res.json([
        {id:1 , tittle : "Iphone x"},
        {id:2 , tittle : "Iphone XS"},
    ])
})

app.get('/users/search',urlencodedParser,function(req ,res){
    let q = req.query.q;
    let index = users.filter(function(user){
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1
    })
    res.render("user" ,{
        user : index
    })
})

app.get('/users/create',urlencodedParser, function(req ,res){
    res.render("userCreate")
})

app.get('/users/:id',urlencodedParser, function(req ,res){
    let id = req.params.id;
    let idHttp = parseInt(id)
    let index = null;
    users.map(function(user){
        if(user.id === idHttp)
        return index = user
    })
    res.render("viewUser",{
        users :index
    })
})

// app.get('/data', function (req, res) {
//   res.header("Content-Type",'application/json');
//   res.send(JSON.stringify(data));
// })

app.post('/users/create',urlencodedParser, function(req ,res){
    let length = users.length
    req.body.id=++length
    users.push(req.body)
    res.redirect("/users")
})

app.post('/users',urlencodedParser, function(req ,res){
    let info = req.body.username + req.body.password
    res.send("<p>Hello</p> " + info)
})

