import Customer from '../models/customer.js';
import tryCatch from './utils/tryCatch.js';

// create Customer
export const createCustomer= tryCatch(async (req, res) => {

  //Todo:  error handling

  let CustomerPayload = req.body
  CustomerPayload.addedBy = req.auth.user._id

  const existingEmail = await Customer.find({ email: req.body.email });
  // console.log('existingMerchant',existingMerchant)
  if (existingEmail.length) {
    return res.status(400).json({ success: true, message: `Email is alrady existed` });
  }
  const newCustomer= new Customer(CustomerPayload);

  await newCustomer.save()
  res.status(200).json({ success: true, message: 'Customer added successfully' });

})

// create getCustomer
export const getCustomer= tryCatch(async (req, res) => {

  let findData = {
    isDelete: false
  }

  const Customers = await Customer.find(findData).sort({ _id: -1 });
    // const Customers = await Customer.find(findData).populate([
    // { path: 'categoryId', model: 'Category' }]).sort({ _id: -1 });

  res.status(200).json({ success: true, result: Customers});
});

//  delete Client
export const deleteCustomer= tryCatch(async (req, res) => {
 
  let updateData = {
    $set: {isDelete:true}
  }
  let findCustomer={
    _id: req.params.customerId
  }
  const c = await Customer.updateOne(findCustomer,updateData);

  res.status(200).json({ success: true, message: 'Customer and all the related data deleted successfully' });
});



export const updateCustomer= tryCatch(async (req, res) => {
  
  let updateData = {
    $set: req.body
  }
  let findCustomer={
    _id: req.params.customerId
  }
  const updatedCustomer = await Customer.updateOne(findCustomer,updateData)
  let message = 'Customer edited successfully'

  res.status(200).json({ success: true, message: message })
});

