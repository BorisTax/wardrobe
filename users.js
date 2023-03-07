import messages from './messages.js'
import { dbOptions } from "./options.js";
import { UserService } from './userService.js'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import UserServiceSQLite from "./userServiceSQLite.js";

const userServiceProvider = new UserServiceSQLite('./users.db')
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vacuumproject2022@gmail.com",
    pass: "cvbdfrqoedlugmgf",
  },
});

export async function loginUser(user) {
  let message = messages.LOGIN_SUCCEED
  const userService = new UserService(userServiceProvider)
  var userList
  try{
    userList = await userService.getUsers()
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR};
  }
  const foundUser = userList.find(u => (user.name === u.name || user.name === u.email))
  if(!foundUser) return { success: false, message: messages.INVALID_USER_DATA};
  if (!bcrypt.compareSync(user.password, foundUser.password)) return { success: false, message: messages.INVALID_USER_DATA};
  const token = jwt.sign({ name: foundUser.name, activated:foundUser.activated }, "secretkey", {expiresIn: 1440});
  return { success: true, message, token};
}

export async function getUsers() {
  const userService = new UserService(userServiceProvider)
  var userList
  try{
    userList = await userService.getUsers()
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR};
  }
  return userList
}

export async function isUserNameExist(name){
  const userService = new UserService(userServiceProvider)
  try{
    return userService.isUserNameExist(name)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
}

export async function isUserEmailExist(name){
  const userService = new UserService(userServiceProvider)
  try{
    return userService.isUserEmailExist(name)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
}

export async function activate(userName, code) {
  const userService = new UserService(userServiceProvider)
  try{
    const result = await userService.activateUser(userName, code)
    return result;
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
}

function send(mailTo, code) {
  const url = "<a href='https://vacuumproject.herokuapp.com'>vacuumproject.herokuapp.com</a>"
  const htmlText = `<p>This letter was sent from ${url}
  <p>You received this letter because this e-mail address was used to sign up on vacuumproject.herokuapp.com</p>
  <p>If you didn't do it, just ignore and delete this letter.</p>
  <p>Sign in on ${url} and type the following code to activate your account:</p><h1>${code}</h1><br/>
  <p>Please, do not answer this letter. It was generated and sent automatically</p>`;
  var mailOptions = {
    from: "VacuumProject <vacuumproject2022@gmail.com>",
    to: mailTo,
    subject: "Sign up on vacuumproject.herokuapp.com",
    html: htmlText,
  };
  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) rej(err);
      else res(info.response);
    });
  });
}

export async function sendMail(mailTo, code) {
  try {
    await send(mailTo, code);
  } catch (e) {
    console.error(e)
  }
}

export async function registerUser(user) {
  const userService = new UserService(userServiceProvider)
  try{
    var result = await userService.registerUser(user)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }

  //if(result.message === messages.USER_EMAIL_NOT_EXIST) {result.success = true; result.message = messages.REG_SUCCEED}
  if(result.success) await sendMail(user.email, result.activationCode);
  return result
}
