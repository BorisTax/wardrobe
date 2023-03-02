export default class SelectionManager {
    selected = new Set()
    add(p){
        this.selected.add(p)
    }
    delete(p){
        this.selected.delete(p)
    }
    has(p){
        return this.selected.has(p)
    }
    getFirst(){
        return this.selected.values().next().value
    }

}