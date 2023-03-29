const inputValue = document.querySelector("#summonerName");
const submitBtn = document.querySelector("#search");
const result = document.querySelector("#result");

import api_key from "./api_key.js";

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let summonerEncryptedId = "";
    let summonerName = inputValue.value
    fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName + '?api_key=' + api_key.keyValue)
        .then(res => res.json())
        .then(data => { summonerEncryptedId = data.id })
        .then(() => {
            fetch('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + summonerEncryptedId + '?api_key=' + api_key.keyValue)
            .then(res => res.json())
            .then(data => {
                if (data.length === 1 && data[0].queueType === "RANKED_FLEX_SR") {
                    result.innerHTML = `<h2>자유랭크</h2>
                        <p>${summonerName}의 자유랭크는 ${data[0].tier} ${data[0].rank} 입니다.`
                } else if (data.length === 1 && data[0].queueType === "RANKED_SOLO_5x5") {
                    result.innerHTML = `<h2>솔로랭크</h2>
                        <p>${summonerName}의 솔로랭크는 ${data[0].tier} ${data[0].rank} 입니다.`
                } else {
                    result.innerHTML = `<h2>자유랭크</h2>\
                                        <p>${summonerName}의 자유랭크는 ${data[0].tier} ${data[0].rank} 입니다.\
                                        <h2>솔로랭크</h2>\
                                        <p>${summonerName}의 솔로랭크는 ${data[1].tier} ${data[1].rank} 입니다.`
                }
            })
        })
})