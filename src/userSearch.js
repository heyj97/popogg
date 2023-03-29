const inputValue = document.querySelector("#summonerName");
const result = document.querySelector(".user-info-div");
const header = document.querySelector("header");
import api_key from "./api_key.js";

function userSearch(e) {
    e.preventDefault()
    let summonerEncryptedId = "";
    let summonerName = inputValue.value
    fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + api_key.keyValue)
        .then(res => res.json())
        .then(data => summonerEncryptedId = data.id )
        .then(() => {
            result.innerHTML = "검색중...";
            fetch('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerEncryptedId + '?api_key=' + api_key.keyValue)
            .then(res => res.json())
            .then(data => {
                header.style.marginTop = 100 + 'px';
                if (data.length === 1 && data[0].queueType === "RANKED_FLEX_SR") {
                    result.innerHTML = `<div class="profile">
                        <div class="rankBoard">
                        <img src="./src/tier/${data[0].tier}.png">
                        <h2 class="profile-rank">자유랭크 ${data[0].tier} ${data[0].rank}</h2>
                        </div>
                        </div>`

                } else if (data.length === 1 && data[0].queueType === "RANKED_SOLO_5x5") {
                    result.innerHTML = `<div class="profile">
                        <div class="rankBoard">
                        <img src="./src/tier/${data[0].tier}.png">
                        <h2 class="profile-rank">솔로랭크 ${data[0].tier} ${data[0].rank}</h2>
                        </div>
                        </div>`

                } else {
                    result.innerHTML = `<div class="profile">
                                        <h2 class="profile-summonerName">${summonerName}</h2>
                                        <div class="rankBoard">
                                        <img src="./src/tier/${data[0].tier}.png">
                                        <h2 class="profile-rank">자유랭크 ${data[0].tier} ${data[0].rank}</h2>
                                        </div>
                                        <div class="rankBoard">
                                        <img src="./src/tier/${data[1].tier}.png">
                                        <h2 class="profile-rank">솔로랭크 ${data[1].tier} ${data[1].rank}</h2>
                                        </div>
                                        </div>`
                }
            })
        })
}

export default userSearch;