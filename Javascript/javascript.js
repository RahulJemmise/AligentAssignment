/*This function uses search bar for user input, 
then puts this input into the loadFromAPI function to search for the specified title.*/
function searchTitle(){
    let searchText = (searchFields.value).trim();
    /*If no search has been made the movie list will be hidden, else it will show titles found*/
    if(searchText.length > 0){
        searchList.classList.remove('hide-search-list');
        loadFromAPI(searchText);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

// Async function loads search results from API
const searchFields = document.getElementById('searchField');

async function loadFromAPI(titleName){
    const URL = `https://omdbapi.com/?s=${titleName}&apikey=9ed4deda`;
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
}