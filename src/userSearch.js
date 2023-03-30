const inputValue = document.querySelector("#summonerName");
const result = document.querySelector(".user-info-div");
// const header = document.querySelector("header");
import api_key from "./api_key.js";

function userSearch(e) {
    e.preventDefault()
    let summonerEncryptedId = "";
    let summonerIcon = "";
    let summonerLevel = 0;

    let summonerName = inputValue.value
    result.innerHTML = "소환사 정보 조회중...";

    fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + api_key.keyValue)
        .then(res => res.json())
        .then(data => {
            summonerEncryptedId = data.id;
            summonerIcon = data.profileIconId;
            summonerLevel = data.summonerLevel;
        })
        .catch(error => {
            console.log('에러발생');
        })
        .then(() => {
            fetch('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerEncryptedId + '?api_key=' + api_key.keyValue)
            .then(res => res.json())
            .then(data => {
                // header.style.marginTop = 100 + 'px';
                if (data.length === 1 && data[0].queueType === "RANKED_FLEX_SR") {
                    result.innerHTML = `<div class="profile">
                                        <img id="summonerIcon" src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerIcon}.png">
                                        <h2 class="profile-summonerName">${summonerName} <code>${summonerLevel}</code></h2>
                                        <div class="rankBoard">
                                        <img class="tierIcon" src="./src/tier/${data[0].tier}.png">
                                        <h2 class="profile-rank">자유랭크 <strong>${data[0].tier} ${data[0].rank}</strong></h2>
                                        </div>
                                        </div>`

                } else if (data.length === 1 && data[0].queueType === "RANKED_SOLO_5x5") {
                    result.innerHTML = `<div class="profile">
                                        <img id="summonerIcon" src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerIcon}.png">
                                        <h2 class="profile-summonerName">${summonerName} <code>${summonerLevel}</code></h2>
                                        <div class="rankBoard">
                                        <img class="tierIcon" src="./src/tier/${data[0].tier}.png">
                                        <h2 class="profile-rank">솔로랭크 <strong>${data[0].tier} ${data[0].rank}</strong></h2>
                                        </div>
                                        </div>`

                } else {
                    result.innerHTML = `<div class="profile">
                                        <img id="summonerIcon" src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerIcon}.png">
                                        <h2 class="profile-summonerName">${summonerName} <code>${summonerLevel}</code></h2>
                                        <div class="rankBoard">
                                        <img class="tierIcon" src="./src/tier/${data[0].tier}.png">
                                        <h2 class="profile-rank">자유랭크 <strong>${data[0].tier} ${data[0].rank}</strong></h2>
                                        </div>
                                        <div class="rankBoard">
                                        <img class="tierIcon" src="./src/tier/${data[1].tier}.png">
                                        <h2 class="profile-rank">솔로랭크 <strong>${data[1].tier} ${data[1].rank}</strong></h2>
                                        </div>
                                        </div>`
                }
            })
            // .then(() => {result.innerHTML = result.innerHTML + '<h3 class="champMastery">다시 fetch하여 mastery정보 연동</h3>'})
        })
        
            
}

export default userSearch;