const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);


const errorController = require("./controllers/error"); 
// const {mongoConnect} = require('./util/database');
const User = require('./models/user')
const mongoose = require("mongoose");

const uri = 'mongodb+srv://tato123456:vV0FHpCadatqpRS8@cluster0.ov0wgvy.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDbStore({
  uri: uri,
  collection: "sessions"
})

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({secret: 'my secret', resave: false, saveUninitialized: false, store: store})
)

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose
  .connect(uri)
  .then(() => {
    User.findOne()
      .then(user => {
        if(!user) {
          const user = new User({
            username: 'tato',
            email: 'tpanchulidze@unisens.ge',
            cart: {
              items: []
            }
          })
          user.save()
        }
      });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
