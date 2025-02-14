const express = require("express");             // Express require
const app = express();
const port = 5006;
const mongoose = require("mongoose");          //Mongoose require
const path = require("path");                   //ejs path require
const Chat = require("./models/chat.js");       // chat.js require
const  methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Mongoose -->mongoDB Connect-------------
main()
.then(() =>{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
}

//ChatSchema data insert -----------
/*
let chat1 = new Chat({
    from : "Dheeraj",
    to : "Ayush",
    message : "Send me your exam sheets",
    created_at : new Date(),
})

chat1.save().then((res) =>{
    console.log(res);
})
.catch((err) =>{
    console.log(err);
});
*/

//Index Route -----------------------
app.get("/chats", async (req,res) =>{
    try{
        let chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs",{chats});
    }
    catch(err){
        next(err);
    }
});

//New Route -----------------------
app.get("/chats/new", (req,res) =>{
    // throw new ExpressError(404, "Page Not Found");
    res.render("new.ejs");
});

// Create Route --------------------
app.post("/chats", async(req,res) =>{
    try{
        let {from, to, message} = req.body;
        let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at : new Date,
    });
    await newChat.save()
    .then((res) =>{
        console.log("Chat was saved");
    })
    .catch((err) =>{
        console.log(err);
    })
    res.redirect("/chats");
    }
    catch(err){
        next(err);
    // console.log(err);
};
});


//Using Wrap_Async =====>
function asyncWrap(fn) {
    return function(req, res, next){
        fn(req, res, next).catch(err => next(err));
    }
}

// New / Show Raute ========>     
app.get("/chats/:id" , asyncWrap (async (req,res ,next) =>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
        next(new ExpressError(500, "Chat Not Found"));
    }
    res.render("edit.ejs" , {chat});
}));


const handleValidationErr = (err) =>{
    console.log("This was a validation error. please follow rules");
    console.dir(err.message);
    return err;
}

// Mongoose Error ====>
    app.use((err, req, res, next)=>{
        console.log(err.name);
        if(err.name === "ValidatorError"){
           err = handleValidationErr(err);
        }
        next(err);
    });
// Error Handling Middleware ======>
app.use((err, req, res, next) => {
    let {status = 500 , message = "Some Error Occurred"} = err ;
    res.status(status).send(message);
}); 

// Edit Route
app.get("/chats/:id/edit", async (req,res) =>{
    try{
        let {id} = req.params;
        let chat = await Chat.findById(id);
    
        res.render("edit.ejs",{chat});
    }
    catch(err){
        next(err);
    }
});



// // Update(PUT) Route------------------
app.put("/chats/:id", async (req,res) =>{
    let {id} = req.params;
    let{message: newMsg } = req.body;
    console.log(newMsg);
    let updatedChat = await Chat.findByIdAndUpdate(
        id, 
        {message: newMsg},
        {runValidators: true, new: true},
       
    )
    console.log(updatedChat);
    res.redirect("/chats");
});


// Destroy(Delete) Route------------------
app.delete("/chats/:id", async(req,res) =>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})


app.get('/',(req,res) =>{
    res.send("Root is Working!");
});

app.listen(port , () =>{
    console.log(`Server is listening on port ${port}`);
});
