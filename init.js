const mongoose = require("mongoose"); 
const Chat = require("./models/chat.js");


main()
.then(() =>{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');
}

let allChats =[
    {from : "Rohan", to : "Aman", message : "Send me your maths notes", created_at : new Date()},
    {from : "Shital", to : "Priya", message : "Hello, how are you?", created_at : new Date()},
    {from : "Vinay", to : "Dheeraj", message : "Send me your notes", created_at : new Date()},
];

Chat.insertMany(allChats);
