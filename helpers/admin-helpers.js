const client = require('../config/connection');
let objectId = require('mongodb').ObjectId;
const config = require('../config/config');
const collections = require("../config/collections");
const { response } = require('express');
const {admin} = require('../firebase-config');

const jwt = require('jsonwebtoken');

module.exports = {
   doLogin: (adminData) => {
      return new Promise(async (resolve, reject) => {
         try {
            const adminName = "shubham"
            const adminPassword = "shubham"
            const token = jwt.sign({ adminName: adminName }, config.secretKey, { expiresIn: '60d' });
            if (adminData.adminName === adminName && adminData.password === adminPassword) {
               resolve({ status: "success", message: "admin logged successfully", token: token });
            } else {
               resolve({ status: "fail", message: "Admin name or password incorrect" });
            }
         } catch (error) {
            console.log(error)
            resolve({ status: "fail", message: "Something went wrong" });
         }
      }).catch((error) => {
         console.log(error)
         resolve({ status: "fail", message: "Something went wrong" });
      })
   },

   getDashboardData: () => {
      return new Promise(async (resolve, reject) => {
         try {
            const unapprovedVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).countDocuments({ permission: false });
            const totalVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).countDocuments();
            const totalUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).countDocuments();
            const approvedVideos = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).countDocuments({ permission: true });
            const recentPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find().limit(3).toArray();
            const recentUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find().limit(3).toArray();
            const onlineUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).countDocuments({ online: true });
            const unapprovedPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find({ permission: false }).toArray();
            const allPosts = await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).find().toArray();
            const allUsers = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).find().toArray();

            console.log(unapprovedVideos, totalVideos, totalUsers, approvedVideos)
            resolve({
               unapprovedVideos: unapprovedVideos,
               totalVideos: totalVideos,
               totalUsers: totalUsers,
               approvedVideos: approvedVideos,
               recentPosts: recentPosts,
               recentUsers: recentUsers,
               onlineUsers: onlineUsers,
               unapprovedPosts: unapprovedPosts,
               allPosts: allPosts,
               allUsers: allUsers,
            })
         } catch (error) {
            console.log(error)
         }
      })
   },


   setApprove: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            const user = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).findOne({ _id: new objectId(data.uid) })
            console.log(user, "UUUUUUUUUUUUUUUUU")
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).updateOne({ _id: new objectId(data.postId) }, { $set: { permission: true } }).then((response)=>{
               if(response){
                  
                  const options = {
                     priority: "high",
                  };
                  const messages = {
                     data: "Your post has been Approved 🥳 !!!"
                  }
                  const payload = {
                     'notification': {
                       'title': 'Post Status',
                       'body': 'Your post has been Approved 🥳 !!!',
                     },
                  };
                  admin.messaging().sendToDevice(user.token, payload, options)
                     .then(async response => {
                        console.log(response, "RRRRRRRRRRRRRRRR");
                        await client.db(collections.DATABASE).collection(collections.NOTIFICATION_COLLECTION).insertOne({
                           uid: user._id,
                           title: payload.notification.title,
                           body: payload.notification.body,
                           date: Date.now()
                       })
                  })
                     .catch(error => {
                        console.log(error);
                  });
                  resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
         } catch (error) {
            console.log(error)
         }
      })
   },

   setunApprove: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            const user = await client.db(collections.DATABASE).collection(collections.USER_COLLECTION).findOne({ _id: new objectId(data.uid) })
            console.log(user, "UUUUUUUUUUUUUUUUU")
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).updateOne({ _id: new objectId(data.postId) }, { $set: { permission: false } }).then(async(response)=>{
               if(response){
                     const options = {
                        priority: "high",
                     };
                     const messages = {
                        data: "Your post has not been Approved 😔 !!!"
                     }
                     const payload = {
                        'notification': {
                          'title': 'Post Status',
                          'body': `Your post has not been Approved 😔 !!! Reason - ${data.reason}`,
                        },
                     };
                     admin.messaging().sendToDevice(user.token, payload, options)
                        .then(async response => {
                           await client.db(collections.DATABASE).collection(collections.NOTIFICATION_COLLECTION).insertOne({
                              uid: user._id,
                              title: payload.notification.title,
                              body: payload.notification.body,
                              date: Date.now()
                          })
                           console.log(response, "RRRRRRRRRRRRRRRR");
                     })
                        .catch(error => {
                           console.log(error);
                     });
                     resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
         } catch (error) {
            console.log(error)
         }
      })
   },

   deletePost: (data) => {
      return new Promise(async (resolve, reject) => {
         try {
            await client.db(collections.DATABASE).collection(collections.POST_COLLECTION).deleteOne({ _id: new objectId(data.postId) }).then((response)=>{
               if(response){
                  resolve({status:"success"})
               }
               else{
                  resolve({status:'fail'})
               }
            }).catch((error)=>{
               console.log(error)
               resolve({status:'fail'})
            })
         } catch (error) {
            console.log(error)
         }
      })
   }
}