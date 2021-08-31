import AbstractViews from "./AbstractViews.js"
import Manga from "../models/Manga.js";

export default class extends AbstractViews {
    constructor(params){
        super(params)
    }


    async getHTML(main_content) {

        let manga = new Manga(this.params.mangaId);
        let currentManga = document.querySelector('#mangaPage').innerHTML
        let template = Handlebars.compile(currentManga);
        
       manga.getManga().then(list => {
        manga.mangaListProcess(list).then(oneManga =>{
            let result = template(oneManga)
            $(main_content).append(result)
        })})
    }

    additionalJS(){}
}