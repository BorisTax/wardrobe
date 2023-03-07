const fs = require('fs')
const keygen = require("keygenerator");
const jwt = require("jsonwebtoken");
const { hashData } = require('./userService')
const messages = require('./src/messages')

class UserServiceJSON {
    constructor(fileName) {
        this.fileName = fileName
    }
    async getUsers() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.fileName, 'utf-8', (err, data) => { if(err) reject(err); else resolve(JSON.parse(data)) })
        }
        )
    }
    async registerUser(newUser) {
        const users = await this.getUsers()
        newUser.password = await hashData(newUser.password);
        const code = keygen._({ forceUppercase: true, length: 6 });
        newUser.activationCode = code
        newUser.activated = false
        users.push(newUser)
        fs.writeFileSync(this.fileName, JSON.stringify(users), { encoding: 'utf-8' })
        const token = jwt.sign({ name: newUser.name, activated: newUser.activated }, "secretkey", { expiresIn: 1440 });
        return { success: true, token, activationCode: code, message: messages.REG_SUCCEED }
    }
    async activateUser(userName, code) {
        const users =  await this.getUsers()
        const user = users.find(u => (userName === u.name && u.activationCode === code))
        if (user !== undefined) {
            delete user.activationCode
            user.activated = true
            fs.writeFileSync(this.fileName, JSON.stringify(users), { encoding: 'utf-8' })
            const token = jwt.sign({ name: user.name, activated: user.activated }, "secretkey", { expiresIn: 1440 });
            return { success: true, token, message: messages.ACTIVATION_SUCCEED }
        }
        return { success: false, message: messages.INVALID_ACTIVATION_CODE }
    }
}

module.exports = UserServiceJSON