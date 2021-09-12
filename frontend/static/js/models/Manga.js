export default class {


    constructor(mangaID){
        this.mangaID = mangaID
    }

    async getManga(id){
        const url = `https://api.mangadex.org/manga/${this.mangaID}`

        const data = await $.get(url).pipe(function(json) {return json})
        
        return data
        
    }
    async getCover(id,coverId){
        const url = `https://api.mangadex.org/cover/${coverId}`
        const fileName = await $.get(url).pipe(function(coverList) {
            return coverList.data.attributes.fileName
        })
        return `https://uploads.mangadex.org/covers/${id}/${fileName}`
    }
    async getAuthor(authorId){
        const url = `https://api.mangadex.org/author/${authorId}`
        const authorName = $.get(url).pipe(function(authorList) {
            return authorList.data.attributes.name
        })
        return authorName
    }

    async mangaListProcess(mangaList){
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
        manga.author = await this.getAuthor(manga.authorsIds[0])
        manga.coverLink = await this.getCover(manga.id,manga.coverId)
        manga.mangaUrl = 'manga/'+manga.id

        return manga      
    }
}