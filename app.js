import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js"
import 'dotenv/config'
import { PORT } from "./src/config/config.js";
import {admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";
import { getOrderById } from "./src/controllers/order/order.js";

const start = async ()=>{

   await connectDB(process.env.MONGO_URI)
   const app = Fastify();
   

app.register(fastifySocketIO,{
    cors:{
        origin:"*"
    },
    pingInterval:10000,
    pingTimeout:5000,
    transports:['websocket']
});



    await registerRoutes(app)
    await buildAdminRouter(app)


    


    app.listen({port:PORT,host:'0.0.0.0'},
        (err,addr)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log(`blinkitis running on https://localhost:${PORT}${admin.options.rootPath}`)
            }
        }
    );
    app.ready().then(()=>{
        app.io.on("connection",(socket)=>{
            console.log('A user Connected');

            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId);
                console.log(`user Joined room  ${orderId}`)
            })
           socket.on("disconnect",()=>{
            console.log("user disconenct")
           })
        })
    })

}

start();