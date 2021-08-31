import Manga from "./Manga.js";

export default class {

    async getMangaList(params){
        const url = 'https://api.mangadex.org/manga'

        const data = await $.get(url, params).pipe(function(json) {return json})
        return data.results
        
    }

    async mangaListProcess(mangaList){
        let mangaClass = new Manga();


        let manga=[]
        $.each(mangaList, (key, val) => {
            if (key === 'data') {              
                $.extend(manga, {id: val.id})
                $.extend(manga, {title: val.attributes.title.en ||  val.attributes.title.jp})
                $.extend(manga, {description: val.attributes.description.en})                                                       
            }
            else if (key === 'relationships') {                            
                $.each(val, (idx, value) => {
                    if(value['type']  === 'author') {
                        $.extend(manga, {authorId: value.id})
                    } else if(value['type']  === 'cover_art'){
                        $.extend(manga, {coverId: value.id})
                    }
                })         
            }
        })
        manga.author = await mangaClass.getAuthor(manga.authorId)
        manga.coverLink = await mangaClass.getCover(manga.id,manga.coverId)
        manga.mangaUrl = 'manga/'+manga.id;

        return manga      
    }
}