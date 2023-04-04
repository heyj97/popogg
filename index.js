const submitBtn = document.querySelector("#search");
const inputBox = document.querySelector('#summonerName');
import { searchAsyncFunctions, summonerData } from "./src/userSearch.js";


submitBtn.addEventListener("click", (e) => {
    searchAsyncFunctions(inputBox.value);
})
inputBox.addEventListener("keypress", (e) => {
    if (e.code === 'Enter' || e.which === 13) {
        searchAsyncFunctions(inputBox.value);
    }
})