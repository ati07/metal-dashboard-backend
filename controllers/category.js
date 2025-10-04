import Category from '../models/category.js';
import tryCatch from './utils/tryCatch.js';

// create Client
export const createCategory= tryCatch(async (req, res) => {

  //Todo:  error handling

  let CategoryPayload = req.body
  CategoryPayload.addedBy = req.auth.user._id
  
  const newCategory= new Category(CategoryPayload);

  await newCategory.save()
  res.status(200).json({ success: true, message: 'Category added successfully' });

})

// create getClient
export const getCategory= tryCatch(async (req, res) => {

  let findData = {
    isDelete: false
  }

  const Categorys = await Category.find(findData).populate([{ path: 'addedBy', model: 'users' }]).sort({ name: 1 });

  res.status(200).json({ success: true, result: Categorys});
});

//  delete Client
export const deleteCategory= tryCatch(async (req, res) => {
 
  let updateData = {
    $set: {isDelete:true}
  }
  let findCategory={
    _id: req.params.CategoryId
  }
  const c = await Category.updateOne(findCategory,updateData);
//   let findData={
//     clientId: req.params.clientId
//   }
  
//   const u = await Users.updateMany(findData,updateData);
  // console.log('u ',u );

  res.status(200).json({ success: true, message: 'Category and all the related data deleted successfully' });
});



export const updateCategory = tryCatch(async (req, res) => {
  
  let updateData = {
    $set: req.body
  }
  let findCategory={
    _id: req.params.categoryId
  }
  const updatedCategory = await Category.updateOne(findCategory,updateData)
  let message = 'Category edited successfully'

  res.status(200).json({ success: true, message: message })
});

