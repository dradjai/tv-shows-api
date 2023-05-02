import { FieldValue } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';
import { db } from './dbConnect.js';
import { secretKey } from '../secrets.js';

const collection = db.collection('users');

export async function signup(req, res) {
  const { email, password } = req.body;
  
  if(!email || password.length < 6) {
    res.status(400).send({ message: "Valid email and password are required."})
    return
  }
  // TODO: check if email is already in use 
  const newUser = {
    email: email.toLowerCase(),
    password,
    createdAt: FieldValue.serverTimestamp(),
  }
  await collection.add(newUser);
  // once the user is added...log them in...
  login(req, res);
  
}

export async function login(req, res) {
  const { email, password } = req.body;
  if(!email || !password) {
    res.status(400).send({ message: "Email and password are required."})
    return
  }
  //in Mongo collection.findOne({ email: email.toLowerCase(), password: password})
  const users = await collection
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
  //[0] -> takes it out of the array
  let user = users.docs.map(doc => ({...doc.data(), id: doc.id}))[0];
  if(!user) {
    res.status(400).send({ message: "Invalid email and/or password"});
    return
  }
  delete user.password;
  const token = jwt.sign(user, secretKey);
  res.send( {user, token} ); // {email, createdAt, id}

}
