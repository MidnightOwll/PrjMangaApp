import MangaListView from "./views/MangaListView.js"
import MangaView from "./views/MangaView.js"


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match =>{
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result=>result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return  [key, values[i]]
    }))
}

const navigateTo = url => {
    history.pushState(null,null, url)
    router()
}


const router = async() => {

    const routes = [
        {path: '/', view: MangaListView},
        {path: '/manga/:mangaId', view: MangaView},
    ];

    const potetnialMatches = routes.map(route=>{
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    });

    let match = potetnialMatches.find(potetnialMatche => potetnialMatche.result !== null)

    if(!match){
        match = {
            route: routes[0],
            result: location.pathname
        }
    }

    const view = new match.route.view(getParams(match));

    let main_content = '#main_content';

    document.querySelector(main_content).innerHTML = ''

    await view.getHTML(main_content)
}

window.addEventListener('popstate',router)

document.addEventListener("DOMContentLoaded", ()=>{
    document.body.addEventListener('click', e => {
        if(e.target.matches('[data-link]')){
            e.preventDefault();
            navigateTo(e.target.href)
        }
    })
    router()
})