import Vendor from '../models/vendor.js';
import tryCatch from './utils/tryCatch.js';

// create Vendor
export const createVendor= tryCatch(async (req, res) => {

  //Todo:  error handling

  let VendorPayload = req.body
  VendorPayload.addedBy = req.auth.user._id

  const existingEmail = await Vendor.find({ email: req.body.email });
  // console.log('existingMerchant',existingMerchant)
  if (existingEmail.length) {
    return res.status(400).json({ success: true, message: `Email is alrady existed` });
  }
  const newVendor= new Vendor(VendorPayload);

  await newVendor.save()
  res.status(200).json({ success: true, message: 'Vendor added successfully' });

})

// create getVendor
export const getVendor= tryCatch(async (req, res) => {

  let findData = {
    isDelete: false
  }

  const Vendors = await Vendor.find(findData).populate([
    { path: 'categoryId', model: 'Category' }]).sort({ _id: -1 });

  res.status(200).json({ success: true, result: Vendors});
});

//  delete Client
export const deleteVendor= tryCatch(async (req, res) => {
 
  let updateData = {
    $set: {isDelete:true}
  }
  let findVendor={
    _id: req.params.vendorId
  }
  const c = await Vendor.updateOne(findVendor,updateData);

  res.status(200).json({ success: true, message: 'Vendor and all the related data deleted successfully' });
});



export const updateVendor= tryCatch(async (req, res) => {
  
  let updateData = {
    $set: req.body
  }
  let findVendor={
    _id: req.params.vendorId
  }
  const updatedVendor = await Vendor.updateOne(findVendor,updateData)
  let message = 'Vendor edited successfully'

  res.status(200).json({ success: true, message: message })
});

