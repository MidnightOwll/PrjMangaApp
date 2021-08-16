class MangaList{

    getMangaList(params){
        const url = 'https://api.mangadex.org/manga'

        return  $.get(url, params).pipe(function(json) {
            return json.results
        })
    }
    getCover(id,coverId){
        const url = `https://api.mangadex.org/cover/${coverId}`
        return $.get(url).pipe(function(coverList) {
            return `https://uploads.mangadex.org/covers/${id}/${coverList.data.attributes.fileName}`
        })
    }
    getAuthor(authorId){
        const url = `https://api.mangadex.org/author/${authorId}`
        return $.get(url).pipe(function(authorList) {
            return authorList.data.attributes.name
        })
    }
    async getDate(params){

    }


    mangaListProcess(mangaList){
        let manga=[]
       
        $.each(mangaList, (key, val) => {

            // let promiseRequest = new Promise((resolve, reject)=>{
            //     resolve(() => {
            if (key === 'data') {          
                    
                $.extend(manga, {id: val.id})
                $.extend(manga, {title: val.attributes.title.en})
                $.extend(manga, {description: val.attributes.description.en})   
                                                                    
            }
                // })
                // reject(null)
            // })
            // promiseRequest.then((data) => {
            //     data()
            else if (key === 'relationships') {                            
                $.each(val, (idx, value) => {
                    if(value['type']  === 'author') {
                        $.extend(manga, {authorId: value.id})
                        this.getAuthor(manga.authorId)
                        .then(author => $.extend(manga, {author: author}))
                        
                        // let promiseAuthorRequest = new Promise((resolve, reject)=>{
                        //     resolve(this.getAuthor(manga.authorId))
                        //     reject(null)
                        
                        // })
                        // promiseAuthorRequest.then(author=>{
                        //    // console.log(author)
                        //     $.extend(manga, {author: author})
                        // })
                    } else if(value['type']  === 'cover_art'){
                        $.extend(manga, {coverId: value.id})
                        this.getCover(manga.id,manga.coverId)
                        .then(link => $.extend(manga, {coverLink: link}))
                        // let promiseCoverRequest = new Promise((resolve, reject)=>{
                        //     resolve(this.getCover(manga.id,manga.coverId))
                        //     reject(null)                                
                        // })
                        // promiseCoverRequest.then(link=>{
                        //     return $.extend(manga, {coverLink: link})
                        // })
                        
                    }
                    
                    
                })         
            }
            // })
            

            // if (key === 'data') {          
                              
            //     $.extend(manga, {id: val.id})
            //     $.extend(manga, {title: val.attributes.title.en})
            //     $.extend(manga, {description: val.attributes.description.en})   
                                                                    
            // } else if (key === 'relationships') {                            
            //     $.each(val, (idx, value) => {
            //         if(value['type']  === 'author') {
            //             $.extend(manga, {authorId: value.id})
            //             let promiseAuthorRequest = new Promise((resolve, reject)=>{
            //                 resolve(this.getAuthor(manga.authorId))
            //                 reject(null)
                        
            //             })
            //             promiseAuthorRequest.then(author=>{
            //                 $.extend(manga, {author: author})
            //             })
            //         } else if(value['type']  === 'cover_art'){
            //             $.extend(manga, {coverId: value.id})
            //             let promiseCoverRequest = new Promise((resolve, reject)=>{
            //                 resolve(this.getCover(manga.id,manga.coverId))
            //                 reject(null)                                
            //             })
            //             promiseCoverRequest.then(link=>{
            //                 $.extend(manga, {coverLink: link})
            //             })
            //         }
            //     })         
            // }
        })
        
        return manga
        
                   //console.log(manga)
      
    }

    
 
    

}