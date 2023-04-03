const submitBtn = document.querySelector("#search");
const inputBox = document.querySelector('#summonerName');
import summonerSearch from "./src/summonerInfo.js";


submitBtn.addEventListener("click", summonerSearch)
inputBox.addEventListener("keypress", (e) => {
    if (e.code === 'Enter') {
        summonerSearch()
    }
})