class MangaList{

    async getMangaList(params){
        const url = 'https://api.mangadex.org/manga'

        const data = await $.get(url, params).pipe(function(json) {return json})
        return data.results
        
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
    async getDate(params){

    }

    async mangaListProcess(mangaList){
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
        manga.author = await this.getAuthor(manga.authorId)
        manga.coverLink = await this.getCover(manga.id,manga.coverId)
        manga.mangaUrl = document.location.pathname + '#manga/'+manga.id;

        return manga      
    }

    
 
    

}