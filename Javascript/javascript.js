/*This function uses search bar for user input, 
then puts this input into the loadFromAPI function to search for the specified title.*/
var resultView = document.getElementById("resultsCount");
resultView.style.display = "none";
var searchListView = document.getElementById("searchList");
searchListView.style.display = "none";
var leftBlockview = document.getElementById("movieInfoBlock")
// leftBlockview.style.display = "none";
var rightBlockView = document.getElementById("movieInfoRightBlock")
var type = 0;

function radioCheck(){
    if(document.getElementById('any').checked) {
        type = 0;
    }else if(document.getElementById('movies').checked) {
        type = 1;
    }else if(document.getElementById('series').checked) {
        type = 2;
    }else if(document.getElementById('episodes').checked){
        type = 3;
    }
}

function searchTitle(){
    let searchText = (searchFields.value).trim();
    /*If no search has been made the movie list will be hidden, else it will show titles found*/

    if(searchText.length > 0){
        resultView.style.display = "initial";
        searchListView.style.display = "initial";
        // leftBlockview.style.display = "initial"
        rightBlockView.style.display = "flex"
        loadFromAPI(searchText);
    } else {
        resultView.style.display = "none";
        searchListView.style.display = "none";
        rightBlockView.style.display = "none";
    }
}

// Async function loads search results from API
const searchFields = document.getElementById('searchField');

async function loadFromAPI(titleName){

    /*Switch cases alters the URL being used to filter for specific type of content*/
    switch (type) {
        case 0: {
            var URL = `https://omdbapi.com/?s=${titleName}&apikey=9ed4deda`;
            // console.log("any")
        } 
        break;
        case 1: {
            var URL = `https://omdbapi.com/?s=${titleName}&type=movie&apikey=9ed4deda`
            // console.log("movie")
        } 
        break;
        case 2: {
            var URL = `https://omdbapi.com/?s=${titleName}&type=series&apikey=9ed4deda`
            // console.log("series")
        } 
        break;
        case 3: {
            var URL = `https://omdbapi.com/?s=${titleName}&type=episode&apikey=9ed4deda`
            // console.log("episode")
        } 
        break;
    }
    
    const result = await fetch(`${URL}`);
    const searchData = await result.json();
    /*If results for the search title is found call the display function with 
    searched title as parameter*/
    if(searchData.Response == "True"){
        displayTitles(searchData.Search);
    }
    /*If no results for the title is found, display message*/ 
    else{
        resultsCount.innerHTML = "Title Not Found!";
    }
}

/* This function displays found titles in different divs with respective title and year*/
function displayTitles(titles){
    searchList.innerHTML = "";

    /*Sets the number of results found*/
    resultsCount.innerHTML = + titles.length + " results";

    /*For loop to create a different div for every title found with respective title info*/
    for(let i = 0; i < titles.length; i++){
        let movieListItem = document.createElement('div');


        movieListItem.classList.add('searchListItem');

        /*Set poster to be the one specified in API*/
        let poster = titles[i].Poster;
        
        /*Sets title info*/
        movieListItem.innerHTML = 
        `
        <div class = "IMBDid">
        <p style="visibility: hidden" id="IMBDid">${titles[i].imdbID}</p>
        </div>
        <div class = "search-item-thumbnail">
            <img src = "${poster}">
        </div>
        <div class = "search-item-info">
            <h3>${titles[i].Title}</h3>
            <p>${titles[i].Year}</p>
        </div>
        `;
        /* Adding the new div[i] to the searchList class*/
        searchList.appendChild(movieListItem);
    }
    loadTitleDetail();
}

async function loadTitleDetail(){
    var finalIMBDidNo;
    /*titleSearchResults will be the variable to hold all the divs of results*/
    const titleSearchResults = searchList.querySelectorAll('.searchListItem');
    
    /*Loop uses the API to load results for the particular title when it's div is clicked
    by using its IMBD id*/
    for(var j = 0; j<titleSearchResults.length; j++){
    // console.log(titleSearchResults[j]);
        try{throw j}
        catch(jj){
        titleSearchResults[j].addEventListener("click", async function onClick() {
        // console.log(jj)
    
        var IMBDidNo = document.getElementsByClassName("IMBDid");
        finalIMBDidNo = IMBDidNo[jj].textContent.trim();
        // console.log(finalIMBDidNo);

        /*Uses IMBD id to fetch the titles details */
        const result = await fetch(`http://www.omdbapi.com/?i=${finalIMBDidNo}&apikey=9ed4deda`);
        const movieDetails = await result.json();
        // console.log(movieDetails);
        displayMovieDetails(movieDetails);
    });}}
}

function displayMovieDetails(details){
    movieInfoRightBlock.innerHTML =
    `
        <div class="posterAndTitleInfo">
            <div class="poster">
                <img id="poster" src="${details.Poster}"  width="200" height="300">
            </div>
            <div class="titleAndCast">
                <div class="movieTitle">
                    <h1 id="movieTitle">${details.Title}</h1>
                </div>
                <ul class = "movieSubInfo">
                    <li class = "rated">${details.Rated}</li>
                    <br>
                    <li class = "year">${details.Year}</li>
                    <br>
                    <li class = "genre">${details.Genre}</li>
                    <br>
                    <li class = "runtime">${details.Runtime}</li>
                </ul>
                <div class="cast">
                <h3 id="cast">${details.Actors}</h3>
                </div>
            </div>
        </div> 
        <div class="plot">
        <p id="plot">${details.Plot}</p>
    </div>
    <div class="scores">
        <div class="internetMovieDatabase">
            <h3 id="internetMovieDatabaseScore">${details.Ratings[0].Value}</h3>
            <h5>Internet Movie Database</h5>
        </div>
        <div class="rottenTomatoes">
            <h3 id="rottenTomatoesScore">${details.Ratings[1].Value}</h3>
            <h5>Rotten Tomatoes</h5>
        </div>
        <div class="metacritic">
            <h3 id="metacriticScore">${details.Ratings[2].Value}</h3>
            <h5>Metacritic</h5>
        </div>
    </div>   
    `
    ;
}