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
            //console.log(val)
            if (key === 'data') {              
                $.extend(manga, {id: val.id})
                $.extend(manga, {title: val.attributes.title.en ||  val.attributes.title.jp})
                $.extend(manga, {description: val.attributes.description.en})    
                $.extend(manga, {tags: {}})
                $.extend(manga, {authorsIds: {}})
                $.each(val.attributes.tags, (idx, value) => {
                    //console.log(value)
                    $.extend(manga.tags, {[idx]: value.attributes.name.en})
                })
                     
                //console.log(val)                      
                $.each(val.relationships, (idx, value) => {
                   // console.log(idx)
                    if(value['type']  === 'author') {
                        //console.log(value)
                        $.extend(manga.authorsIds, {[idx]: value.id})
                    } else if(value['type']  === 'cover_art'){
                        $.extend(manga, {coverId: value.id})
                    }
                })         
            }
        })
        console.log(manga)
        manga.author = await mangaClass.getAuthor(manga.authorsIds[0])
        manga.coverLink = await mangaClass.getCover(manga.id,manga.coverId)
        manga.mangaUrl = 'manga/'+manga.id
        console.log(manga)
        return manga      
    }
}