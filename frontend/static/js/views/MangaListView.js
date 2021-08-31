import AbstractViews from "./AbstractViews.js"
import MangaList from "../models/MangaList.js";

export default class extends AbstractViews {
    constructor(params){
        super(params)
        this.mangaList = new MangaList();

    }


    async getHTML(main_content) {

        
        let currentManga = document.querySelector('#currentManga').innerHTML
        let template = Handlebars.compile(currentManga);
        // в качестве параметра функции выступает массив, 
        // ключем и значениями которого выступают параметры для запроса на АПИ

        this.mangaList.getMangaList({'limit':15}).then(list => {

            $.each(list, (num, rez) => {
                const oneManga = this.mangaList.mangaListProcess(rez).then(oneManga =>{
                    let result = template(oneManga)
                    $(main_content).append(result)
                })
            })

        })
    }

    additionalJS(){


        let currentManga = document.querySelector('#currentManga').innerHTML
        let template = Handlebars.compile(currentManga);
        let offset=15 //переменная счетчик
        //функция загрузки
        // тут есть пробрема. если при скролле не ждать пока заполнитяся данные появляется ошибка 
        $(window).scroll(() => {
            if($(window).scrollTop() + $(window).height() >= $(document).height()) {
                this.mangaList.getMangaList({'limit':15, 'offset':offset}).then(list => {
                    console.log(list)
                    $.each(list, (num, rez) => {
                        const oneManga = this.mangaList.mangaListProcess(rez).then(oneManga =>{
                            let result = template(oneManga)
                            $('#main_content').append(result)
                        })
                    })
                    offset +=15
                    console.log(offset)
                })       
            }
        })
    }
}