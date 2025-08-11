import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import tryCatch from './utils/tryCatch.js';
import {validateUser} from '../middleware/auth.js';

export const login = tryCatch(async (req, res) => {

  const { email, password } = req.body;

  let payload = {...req.body, populate: true };
  let userData = await validateUser(payload);

  if (userData.error) {
    console.log("Errroooooologin....", userData);
    return res.status(401).json({
      success: false,
      message: userData.message,
    });
  }

  let userDetails = userData.userDetails

  // const userDetails = await User.findOne({ email: email.toLowerCase() });

  const correctPassword = await bcrypt.compare(password, userDetails.password);

  if (!correctPassword) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { _id: id, name, photoURL, role, isActive, createdAt, clientId, userEmail } = userDetails;

  const signOptions = {
    issuer: "Authorization",
    subject: "iam@user.me",
    audience: "cbpro",
    expiresIn: "36h", // 36 hrs validity
    algorithm: "HS256"
  };

  const token = jwt.sign({ id, name, role, email }, process.env.JWT_SECRET, signOptions);

  res.status(200).json({
    success: true,
    result: { id, name, email: userEmail, photoURL, token, role, isActive, createdAt, clientId },
  });
});



// export const blockUser = tryCatch(async (req, res) => {
//   const { role, isActive } = req.body;
//   await User.findByIdAndUpdate(req.params.userId, { isActive });
//   res.status(200).json({ success: true, message: 'user edited successfully' });
// });