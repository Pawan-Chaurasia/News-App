const API_KEY = "4b04cf18cc4d400a9de6b88ee9a2b28c";
const url = "https://newsapi.org/v2/everything?q=";
// newsapi.org to get apikey
// api return response in json(javascript object nottation) format in which there are keys and values

window.addEventListener('load',()=>fetchNews("India"));

function reload(){
    window.location.reload();
}

function scrollToTop(){
    window.scrollTo({
        top: 0,
        behavior:"smooth"                 //set scroll bar to top whenever new data(news) is appended. 
    })
};

async function fetchNews(query) {                                              // `${variable} ` string template
    const res = await fetch(`${url}${query}&apikey=${API_KEY}`);               // fetch is a built-in js function used to fetch resources from a server. It returns a Promise that resolves to the Response to that request.
    const data = await res.json();                                             // Parse the response body as JSON (return a promise )     
    bindData(data.articles);                                                   //because articles are present in data.articles 
}                                                                              // "binding data" refers to connecting data to UI elements or components in a way that allows the UI to update when the data changes.

function bindData(articles){
    const cardContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardContainer.innerHTML = '';                               //if inner html is not set empty every time when site load and api call more and more cards append in website like infinite loop.
    
    articles.forEach(article => {
        if (!article.urlToImage)  return;                           // if no image then return.

        const cardClone = newsCardTemplate.content.cloneNode(true) ;     // cloneNode(true) means we not only want to clone parent template but its child divs also(deep cloning).
        fillDataInCard(cardClone,article);
        cardContainer.appendChild(cardClone);
        scrollToTop();
    });
}

function fillDataInCard(cardClone,article){
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-IN", {           //becaue date is present in time zone (tz) format convert in human readable date time format. by first making a object(Date) of give tz format then calling .toLocalString Method on object providing  given locale (Indian English, "en-IN") and time zone (Jakarta, "Asia/Jakarta"). It returns a string representation of the formatted date and time. 
        timeZone: "Asia/Jakarta"
    });

    newsSource.innerHTML = `${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener('click',()=>{
        window.open(article.url,"_blank")
    });

}

let currentSelectedNav = null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem = document.getElementById(id);
    currentSelectedNav?.classList.remove('active');                 // the optional chaining operator ?. is a safeguard that prevents the code from throwing an error if currentSelectedNav is not defined. If currentSelectedNav is defined, the code will continue executing, removing the 'active' class from the element's classList. If currentSelectedNav is null or undefined, the code will simply do nothing and not raise an error.
    currentSelectedNav = navItem;
    currentSelectedNav.classList.add('active');

};

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click',()=>{
    const query = searchText.value;
    if (!query) return;                                //checks if the query is empty or falsy. If the query is empty (no text has been entered), the return statement will exit the current function or block of code.
    fetchNews(query);
    currentSelectedNav?.classList.remove('active');
    currentSelectedNav = null;
});


