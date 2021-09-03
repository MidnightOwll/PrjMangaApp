export default class {

    constructor(params){

        this.params = params
        this.setTitle('MangaApp')
    }

    setTitle(title){
        document.title = title
    }

    async getHTML(){
        return ''
    }

    additionalJS(){}
}