class MangaList{

    getMangaList(params){
        let mangaList;
        let url = 'https://api.mangadex.org/manga';

        return $.get(url, params).pipe(function(json) {
               return json.results;
        });
    }
    async getCover(id,coverId){
        let url = `https://api.mangadex.org/cover/${coverId}`;
        return await $.get(url).pipe(function(coverList) {
            return `https://uploads.mangadex.org/covers/${id}/${coverList.data.attributes.fileName}`;
        });
    }
    async getAuthor(authorId){
        let url = `https://api.mangadex.org/author/${authorId}`;
        return await $.get(url).pipe(function(authorList) {
            return authorList.data.attributes.name;
        });
    }
    mangaListProcess(mangaList){
        let manga=[];
        $.each(mangaList, (key, val) => {
            if (key === 'data') {
                $.extend(manga, {id: val.id})
                $.extend(manga, {title: val.attributes.title.en})
                $.extend(manga, {description: val.attributes.description.en})                                                    
            } else if (key === 'relationships') {                            
                $.each(val, (idx, value) => {
                             if(value['type']  === 'author') {
                                 $.extend(manga, {authorId: value.id})
                                 let promiseAuthorRequest = new Promise((resolve, reject)=>{
                                    resolve(this.getAuthor(manga.authorId))
                                    reject(null)
                                    
                                })
                                promiseAuthorRequest.then(author=>{
                                    $.extend(manga, {author: author})
                                })
                             } else if(value['type']  === 'cover_art'){
                                 $.extend(manga, {coverId: value.id})
                                 let promiseCoverRequest = new Promise((resolve, reject)=>{
                                    resolve(this.getCover(manga.id,manga.coverId))
                                    reject(null)
                                    
                                })
                                promiseCoverRequest.then(link=>{
                                    $.extend(manga, {coverLink: link})
                                })
                             }
                         })         
                     }
            })        
         return manga;
    }
}