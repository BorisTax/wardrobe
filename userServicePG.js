const { Client } = require("pg");
const keygen = require("keygenerator");
const jwt = require("jsonwebtoken");
const { hashData } = require('./userService')
const messages = require('./src/messages')
class UserServicePG {
    constructor(dbOptions){
        this.dbOptions = dbOptions
    }
    async getUsers(){
        var client = new Client(this.dbOptions);
        client.connect();
        var res = await client.query("SELECT * FROM users");
        client.end();
        return res.rows
    }

    async registerUser(user) {
        const hash = await hashData(user.password);
        const code = keygen._({ forceUppercase: true, length: 6 });
        const client = new Client(this.dbOptions);
        client.connect();
        await client.query(
                `INSERT INTO users VALUES('${user.name}','${user.email}','${hash}','false','${code}')`
            );
        client.end();
        const token = jwt.sign({ name: user.name, activated: user.activated }, "secretkey", { expiresIn: 1440 });
        return { success: true, token, activationCode: code, message: messages.REG_SUCCEED }
    }
   
    async activateUser(userName, code) {
        const res =  await this.getUsers()
        const user = res.find(u => (userName === u.name && u.activationCode === code))
        if (user !== undefined) {
                var client = new Client(this.dbOptions);
                client.connect();
                const res = await client.query(
                `UPDATE users SET activated=${true}, "activationCode"=${null} WHERE name='${userName}'`
                );
                client.end();
                if (res.rowCount > 0) {
                const token = jwt.sign({ name: user.name, activated: true }, "secretkey", { expiresIn: 1440 });
                return { success: true, token, message: messages.ACTIVATION_SUCCEED };
                }
                else return { success: false, message: messages.SERVER_ERROR };
            }
        return { success: false, message: messages.INVALID_ACTIVATION_CODE }
    }
}

module.exports = UserServicePG