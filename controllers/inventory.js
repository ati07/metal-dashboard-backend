import Inventory from '../models/inventory.js';
import tryCatch from './utils/tryCatch.js';

// create Inventory
export const createInventory= tryCatch(async (req, res) => {

  //Todo:  error handling

  let InventoryPayload = req.body
  InventoryPayload.addedBy = req.auth.user._id

    // Get the item with the highest SKU
  const lastItem = await Inventory
    .findOne({})
    .sort({ sku: -1 })   // sort descending
    .select('sku')
    .lean();

  // Extract numeric part (assumes SKU like "SK0001" or "0001")
  let lastNumber = 0;
  if (lastItem?.sku) {
    lastNumber = parseInt(lastItem.sku.replace(/^SK/, ''), 10);
  }

  const nextNumber = lastNumber + 1;

  // Format: pad to 4 digits, optional "SK" prefix
  const nextSku = 'SK' + String(nextNumber).padStart(4, '0');
  InventoryPayload.sku = nextSku;
  
  const newInventory= new Inventory(InventoryPayload);

  await newInventory.save()
  res.status(200).json({ success: true, message: 'Inventory added successfully' });

})

// create getInventory
export const getInventory= tryCatch(async (req, res) => {

  let findData = {
    isDelete: false
  }

  if (req.query.categoryId) {
    findData['categoryId'] = req.query.categoryId
  }

  if (req.query.component) {
    findData['component'] = req.query.component
  }

  if (req.query.vendorId) {
    findData['vendorId'] = req.query.vendorId
  }

  if (req.query.sku) {
    findData['sku'] = req.query.sku
  }

  const Inventorys = await Inventory.find(findData).populate([
    { path: 'vendorId', model: 'Vendor'},
    { path: 'categoryId', model: 'Category'}
  ]).sort({ _id: -1 });

  res.status(200).json({ success: true, result: Inventorys});
});

//  delete Client
export const deleteInventory= tryCatch(async (req, res) => {
 
  let updateData = {
    $set: {isDelete:true}
  }
  let findInventory={
    _id: req.params.inventoryId
  }
  const c = await Inventory.updateOne(findInventory,updateData);

  res.status(200).json({ success: true, message: 'Inventory and all the related data deleted successfully' });
});



export const updateInventory= tryCatch(async (req, res) => {
  
  let updateData = {
    $set: req.body
  }
  let findInventory={
    _id: req.params.inventoryId
  }
  const updatedInventory = await Inventory.updateOne(findInventory,updateData)
  let message = 'Inventory edited successfully'

  res.status(200).json({ success: true, message: message })
});

