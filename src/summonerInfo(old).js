import api_key from "./api_key.js";
const resultBody = document.querySelector(".user-info-div");
const inputValue = document.querySelector("#summonerName");
const header = document.querySelector("header");


function summonerSearch(e) {
    // e.preventDefault()
    
    /** 소환사 기본 정보 */
    let userInfo = {
        summonerEncryptedId : "",
        summonerIcon : "",
        summonerLevel : 0,
        summonerName : ""
    };

    /** 소환사 랭크 정보*/
    let rankInfo = {
        rankSoloTier : "UNRANKED", rankSoloRank: "", rankSoloPoints: 0, rankSoloWin: 0, rankSoloLose: 0,
        rankFlexTier : "UNRANKED", rankFlexRank: "", rankFlexPoints: 0, rankFlexWin: 0, rankFlexLose: 0
    };
    
    /** 챔피언 마스터리 정보 */
    let masteryInfo = {
        m1champEng: "", m1champName : "", most1Id : 0, most1Level : 0, most1Points : 0,
        m2champEng: "", m2champName : "", most2Id : 0, most2Level : 0, most2Points : 0,
        m3champEng: "", m3champName : "", most3Id : 0, most3Level : 0, most3Points : 0
    };

    fetch('https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + inputValue.value + '?api_key=' + api_key.keyValue) // 소환사 정보 조회 API
        // 400
        .catch(error => {
            alert('존재하지 않는 소환사입니다!')
        })

        // 200
        .then(res => res.json())
        .then(data => {
                resultBody.className += ' listViewer';
                header.style.marginTop = "60px"; 
                userInfo.summonerEncryptedId = data.id;
                userInfo.summonerIcon = data.profileIconId;
                userInfo.summonerLevel = data.summonerLevel;
                userInfo.summonerName = data.name;

                fetch('https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' + userInfo.summonerEncryptedId + '?api_key=' + api_key.keyValue) // 랭크정보 조회 API
                    .then(res => res.json())
                    .then(data => {
                        if (data.length === 2) {    
                            rankInfo.rankSoloTier = data[1].tier;
                            rankInfo.rankSoloRank = data[1].rank;
                            rankInfo.rankSoloPoints = data[1].leaguePoints;
                            rankInfo.rankSoloWin = data[1].wins;
                            rankInfo.rankSoloLose = data[1].losses;

                            rankInfo.rankFlexTier = data[0].tier;
                            rankInfo.rankFlexRank = data[0].rank;
                            rankInfo.rankFlexPoints = data[0].leaguePoints;
                            rankInfo.rankFlexWin = data[0].wins;
                            rankInfo.rankFlexLose = data[0].losses;

                        } else if (data.length === 1 && data[0].queueType === "RANKED_FLEX_SR") {
                            rankInfo.rankFlexTier = data[0].tier;
                            rankInfo.rankFlexRank = data[0].rank;
                            rankInfo.rankFlexPoints = data[0].leaguePoints;
                            rankInfo.rankFlexWin = data[0].wins;
                            rankInfo.rankFlexLose = data[0].losses;

                        } else if (data.length === 1 && data[0].queueType === "RANKED_SOLO_5x5") {
                            rankInfo.rankSoloTier = data[0].tier;
                            rankInfo.rankSoloRank = data[0].rank;
                            rankInfo.rankSoloPoints = data[0].leaguePoints;
                            rankInfo.rankSoloWin = data[0].wins;
                            rankInfo.rankSoloLose = data[0].losses;
                        }
                    
                    fetch('https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/' + userInfo.summonerEncryptedId + '?api_key=' + api_key.keyValue)
                        .then(res => res.json())
                        .then(data => {
                            masteryInfo.most1Id = data[0].championId;
                            masteryInfo.most1Level = data[0].championLevel;
                            masteryInfo.most1Points = data[0].championPoints;

                            masteryInfo.most2Id = data[1].championId;
                            masteryInfo.most2Level = data[1].championLevel;
                            masteryInfo.most2Points = data[1].championPoints;

                            masteryInfo.most3Id = data[2].championId;
                            masteryInfo.most3Level = data[2].championLevel;
                            masteryInfo.most3Points = data[2].championPoints;

                            fetch('https://ddragon.leagueoflegends.com/cdn/13.6.1/data/ko_KR/champion.json')
                            .then(res => res.json())
                            .then(data => {
                                for (let i in data.data) {
                                    if (parseInt(data.data[i].key) === masteryInfo.most1Id) {
                                        masteryInfo.m1champName = data.data[i].name;
                                        masteryInfo.m1champEng = data.data[i].id;
                                    }
                                    if (parseInt(data.data[i].key) === masteryInfo.most2Id) {
                                        masteryInfo.m2champName = data.data[i].name;
                                        masteryInfo.m2champEng = data.data[i].id;
                                    }
                                    if (parseInt(data.data[i].key) === masteryInfo.most3Id) {
                                        masteryInfo.m3champName = data.data[i].name;
                                        masteryInfo.m3champEng = data.data[i].id;
                                    }
                                }

                                resultBody.innerHTML = resultBody.innerHTML + `
                                    <div class="userInfoContainer">
                                        <div class="iconArea">
                                            <h4>${userInfo.summonerLevel}</h4>
                                            <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${userInfo.summonerIcon}.png" alt="userProfile">
                                        </div>

                                        <div class="userArea">
                                            <h2>${userInfo.summonerName}</h2>
                                            <div class="mostArea">
                                                <div class="mostChamp">
                                                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${masteryInfo.m1champEng}.png" alt="mostChamp1" class="championProfile">
                                                    <ul>
                                                        <li><h3>${masteryInfo.m1champName}</h3></li>
                                                        <li><h4>숙련레벨 ${masteryInfo.most1Level}</h4></li>
                                                        <li><h4>숙련점수 ${masteryInfo.most1Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                                                    </ul>
                                                </div>
                                                <div class="mostChamp">
                                                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${masteryInfo.m2champEng}.png" alt="mostChamp2" class="championProfile">
                                                    <ul>
                                                        <li><h3>${masteryInfo.m2champName}</h3></li>
                                                        <li><h4>숙련레벨 ${masteryInfo.most2Level}</h4></li>
                                                        <li><h4>숙련점수 ${masteryInfo.most2Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                                                    </ul>
                                                </div>
                                                <div class="mostChamp">
                                                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${masteryInfo.m3champEng}.png" alt="mostChamp3" class="championProfile">
                                                    <ul>
                                                        <li><h3>${masteryInfo.m3champName}</h3></li>
                                                        <li><h4>숙련레벨 ${masteryInfo.most3Level}</h4></li>
                                                        <li><h4>숙련점수 ${masteryInfo.most3Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="rankArea">
                                            <div class="rankBox">
                                                <img src="./src/tier/${rankInfo.rankSoloTier}.png" alt="tierImg">
                                                <ul>
                                                    <li><h3>솔로랭크</h3></li>
                                                    <li><h4>${rankInfo.rankSoloTier} ${rankInfo.rankSoloRank}</h4> <h5>${rankInfo.rankSoloPoints}점</h5></li>
                                                    <li><h5>${rankInfo.rankSoloWin}승 ${rankInfo.rankSoloLose}패 (${(100 * (rankInfo.rankSoloWin / (rankInfo.rankSoloWin + rankInfo.rankSoloLose))).toFixed(2)}%)</h5></li>
                                                </ul>
                                            </div>
                                            <div class="rankBox">
                                                <img src="./src/tier/${rankInfo.rankFlexTier}.png" alt="tierImg">
                                                <ul>
                                                    <li><h3>자유랭크</h3></li>
                                                    <li><h4>${rankInfo.rankFlexTier} ${rankInfo.rankFlexRank}</h4> <h5>${rankInfo.rankFlexPoints}점</h5></li>
                                                    <li><h5>${rankInfo.rankFlexWin}승 ${rankInfo.rankFlexLose}패 (${(100 * (rankInfo.rankFlexWin / (rankInfo.rankFlexWin + rankInfo.rankFlexLose))).toFixed(2)}%)</h5></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    `
                                resultBody.scrollTop = resultBody.scrollHeight;
                            })
                        })
                    })
        })
    
    }

export default summonerSearch;