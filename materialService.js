import messages from './messages.js'
import bcrypt from "bcrypt";
import emailValidator from 'deep-email-validator';

export class MaterialService {
    types = ['DSP', 'MIRROR', 'LACOBEL', 'SAND', 'FMP']
    constructor(provider){
        this.provider = provider
    }
    async getMaterials(){
      let materials = {}
      for(let t of this.types) {
        let mat = await this.provider.getMaterials(t)
        materials = {...materials, ...mat}
      }
      return materials
    }
    async addMaterial(newMaterial){
        let result = await this.isMaterialExist(newMaterial)
        if(!result.success) return result
        return this.provider.addMaterial(newMaterial)
    }
}

