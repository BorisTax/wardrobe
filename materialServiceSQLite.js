import messages from './messages.js'
import sqlite3 from "sqlite3";
export default class MaterialServiceSQLite {
    constructor(dbFile) {
        this.dbFile = dbFile
    }
    async getMaterial(table) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`SELECT * FROM ${table}`, (err, rows) => {
                    if (err) { console.error(err); reject(err); db.close()  }
                    else resolve(rows)
                    db.close()
                });
            });
        }
        )
    }
    async getMaterials(type){
        const mat = await this.getMaterial(type)
        return {[type]: mat}
    }

    async addMaterial(table, material) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(this.dbFile, (err) => {
                if (err) { console.error(err); reject(err); db.close() }
                db.all(`INSERT INTO ${table} VALUES(?)`,[material], (err, rows) => {
                    if (err) { console.error(err); reject({ success: false, message: messages.SERVER_ERROR }); db.close()  }
                    else {
                        resolve({ success: true })
                    }
                    db.close()
                });
            });

        }
        )
    }

}
