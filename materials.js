import messages from './messages.js'
import MaterialServiceSQLite from './materialServiceSQLite.js';
import { MaterialService } from './materialService.js';

const materialServiceProvider = new MaterialServiceSQLite('./materials.db')


export async function getMaterials() {
  const materialService = new MaterialService(materialServiceProvider)
  var materials
  try{
    materials = await materialService.getMaterials()
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR};
  }
  return materials
}

export async function addMaterial(material) {
  const materialService = new MaterialService(materialServiceProvider)
  try{
    var result = await MaterialService.addMaterial(user)
  }catch(e){
    return { success: false, message: messages.SERVER_ERROR };
  }
  return result
}
