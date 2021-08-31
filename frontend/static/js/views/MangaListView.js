import AbstractViews from "./AbstractViews.js"
import MangaList from "../models/MangaList.js";

export default class extends AbstractViews {
    constructor(params){
        super(params)
        this.setTitle('Manga List')

    }


    async getHTML(main_content) {

        let mangaList = new MangaList();
        let currentManga = document.querySelector('#currentManga').innerHTML
        let template = Handlebars.compile(currentManga);
        // в качестве параметра функции выступает массив, 
        // ключем и значениями которого выступают параметры для запроса на АПИ

       mangaList.getMangaList({'limit':15}).then(list => {

            $.each(list, (num, rez) => {
                const oneManga = mangaList.mangaListProcess(rez).then(oneManga =>{
                    let result = template(oneManga)
                    $(main_content).append(result)
                })
            })

        })

        let offset=15 //переменная счетчик
        //функция загрузки
        // тут есть пробрема. если при скролле не ждать пока заполнитяся данные появляется ошибка 
        $(window).scroll(() => {
            if($(window).scrollTop() + $(window).height() >= $(document).height()) {
                mangaList.getMangaList({'limit':15, 'offset':offset}).then(list => {
                    console.log(list)
                    $.each(list, (num, rez) => {
                        const oneManga = mangaList.mangaListProcess(rez).then(oneManga =>{
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