import User from '../models/user.js';
import tryCatch from './utils/tryCatch.js';
import bcrypt from 'bcryptjs';

export const addUser= tryCatch(async (req, res) => {
  let userClient = req.body


  // if(req.auth.user.role == 'Partner' ){
  //   userClient.partnerId = req.auth.user._id
  // }
  // userClient.addedBy = req.auth.user._id

  const existingEmail = await User.find({ email: req.body.email });
  // console.log('existingMerchant',existingMerchant)
  if (existingEmail.length) {
    return res.status(400).json({ success: true, message: `Email is alrady existed` });
  }

  const hashedPassword = await bcrypt.hash(userClient.password, 12);
  userClient.password = hashedPassword
  const newUser = new User(userClient);
  await newUser.save()
  res.status(200).json({ success: true, message: 'User added successfully' });
});


export const getUsers = tryCatch(async (req, res) => {
  let findUsers = {
    isDelete: false
  }
  

  // if(req.auth.user.role !=='Admin' && req.auth.user.role !== 'Partner'){
  //   findUsers.clientId = req.auth.user.clientId
  // }

  // if(req.auth.user.role == 'Partner' ){
  //   findUsers.partnerId = req.auth.user._id
  // }

  // const users = await User.find(findUsers).populate({path:'clientId',model:'clients'}).sort({ _id: -1 });
  const users = await User.find(findUsers).sort({ _id: -1 });
  console.log('users',users)
  
  res.status(200).json({ success: true, result: users });
});

export const deleteUser= tryCatch(async (req, res) => {
  let updateData = {
    $set: {isDelete:true}
  }
  let findUser={
    _id: req.params.userId
  }
  const { _id } = await User.updateOne(findUser,updateData);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

export const editUserDetails = tryCatch(async (req, res) => {
 let findUser= {_id : req.params.userId}
 
 if(req.body.password){
  req.body.password = await bcrypt.hash(req.body.password, 12);
 }
 let updateUser =  { $set : req.body }
  
  await User.updateOne(findUser, updateUser);
   
  let message = 'User edited successfully'
  if(req.body.isActive  || !req.body.isActive){
    message = 'User status update successfully'
  }else if(req.body.isBlock || !req.body.isBlock){
    message = `User ${req.body.isBlock ? 'Block' :'Unblock'} update successfully`
  }
  res.status(200).json({ success: true, message: message  });
});