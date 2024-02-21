const express = require('express');
const db = require('./config/connection');
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const adminRoutes = require("./routes/admin");
const path=require("path")
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({
  origin: '*'
}));

// app.use("/public",express.static(path.join(__dirname , "public")))
// app.use("/",express.static(path.join(__dirname , "./build")))

app.get("/*",(req,res)=>{
  res.sendFile(path.join(__dirname),"./build/index.html")
})

app.use("/admin",adminRoutes)
app.use('/api/auth', userRoutes);
app.use('/admin/post/video-post',postRoutes)

// app.get('/admin', (req, res) => {
//   console.log("vannade")
//     res.json({suii:'Hello World!'});
// });

// app.get('/', (req, res) => {
//   console.log("vannade")
//     res.json({message:'Hello World!'});
// });

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
