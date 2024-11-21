import AdminJS from "adminjs"
import AdminJSFastify from '@adminjs/fastify'
import * as AdminJSMongoose from '@adminjs/mongoose'
import * as Models from '../models/index.js'
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import {dark,light,noSidebar} from '@adminjs/themes'
AdminJS.registerAdapter(AdminJSMongoose)

export const admin = new AdminJS({
    resources:[
        {
            resource:Models.Customer,
            options:{
               listProperties:["phone","role","isActivated"],
               filterProperties:["phone","role",]
            }
        },
        {
            resource:Models.DeliveryPartner,
            options:{
               listProperties:["email","role","isActivated"],
               filterProperties:["email","role"],
            }
        },
        {
            resource:Models.Admin,
            options:{
               listProperties:["email","role","isActivated"],
               filterProperties:["email","role"],
            }
        },
        { resource:Models.Branch },
        { resource:Models.Product },
        { resource:Models.Category },
        { resource:Models.Order },
        { resource:Models.Counter },
    ],
    branding:{
        companyName:'DeltaKebab',
        withMadeWithLove:false,
        favicon:"https://restaumatic-production.imgix.net/uploads/restaurants/275281/logo/1689151634.png?auto=compress%2Cformat&crop=focalpoint&fit=clip&h=500&w=500",
        logo:"https://restaumatic-production.imgix.net/uploads/restaurants/275281/logo/1689151634.png?auto=compress%2Cformat&crop=focalpoint&fit=clip&h=500&w=500"
    },
    defaultTheme:dark.id,
    rootPath:'/admin'

});

export const buildAdminRouter = async(app) =>{
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
           cookiePassword:COOKIE_PASSWORD,
           cookieName:'adminjs'
        },
        app,
        {
            store:sessionStore,
            saveUnintialized:true,
            secret:COOKIE_PASSWORD,
            cookie:{
                httpOnly:process.env.NODE_ENV === 'production',
                secure:process.env.NODE_ENV === 'production',

            },

        }
    )
}