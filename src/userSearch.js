import api_key from './api_key.js';
const resultBody = document.querySelector(".user-info-div");
const header = document.querySelector("header");

const summonerData = {
    userData: {
        summonerEncryptedId: "",
        summonerIcon: "",
        summonerLevel: 0,
        summonerName: ""
    },

    rankData: {
        rankSoloTier: "UNRANKED", rankSoloRank: "", rankSoloPoints: 0, rankSoloWin: 0, rankSoloLose: 0,
        rankFlexTier: "UNRANKED", rankFlexRank: "", rankFlexPoints: 0, rankFlexWin: 0, rankFlexLose: 0
    },

    masteryData: {
        m1champEng: "", m1champName : "", most1Id : 0, most1Level : 0, most1Points : 0,
        m2champEng: "", m2champName : "", most2Id : 0, most2Level : 0, most2Points : 0,
        m3champEng: "", m3champName : "", most3Id : 0, most3Level : 0, most3Points : 0
    }
    }

async function userDataRequest(username) {
    console.log('user data request start')
    return new Promise((resolve)=> {
        fetch(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}?api_key=${api_key.keyValue}`)
            .then(res => res.json())
            .then(data => {
                summonerData.userData.summonerEncryptedId = data.id;
                summonerData.userData.summonerIcon = data.profileIconId;
                summonerData.userData.summonerLevel = data.summonerLevel;
                summonerData.userData.summonerName = data.name;

                resolve();
            })
            .catch(err => {
                alert('존재하지 않는 소환사입니다!')
            })
    });
}

async function rankDataRequest(encryptedId) {
    console.log('rank data request start')
    return new Promise(resolve => {
        fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedId}?api_key=${api_key.keyValue}`)
            .then(res => res.json())
            .then(data => {
                if(data.length === 2) {
                    summonerData.rankData.rankSoloTier = data[1].tier;
                    summonerData.rankData.rankSoloRank = data[1].rank;
                    summonerData.rankData.rankSoloPoints = data[1].leaguePoints;
                    summonerData.rankData.rankSoloWin = data[1].wins;
                    summonerData.rankData.rankSoloLose = data[1].losses;
    
                    summonerData.rankData.rankFlexTier = data[0].tier;
                    summonerData.rankData.rankFlexRank = data[0].rank;
                    summonerData.rankData.rankFlexPoints = data[0].leaguePoints;
                    summonerData.rankData.rankFlexWin = data[0].wins;
                    summonerData.rankData.rankFlexLose = data[0].losses;
                } else if (data.length === 1 && data[0].queueType === "RANKED_SOLO_5x5") {
                    summonerData.rankData.rankSoloTier = data[0].tier;
                    summonerData.rankData.rankSoloRank = data[0].rank;
                    summonerData.rankData.rankSoloPoints = data[0].leaguePoints;
                    summonerData.rankData.rankSoloWin = data[0].wins;
                    summonerData.rankData.rankSoloLose = data[0].losses;
                } else {
                    summonerData.rankData.rankFlexTier = data[0].tier;
                    summonerData.rankData.rankFlexRank = data[0].rank;
                    summonerData.rankData.rankFlexPoints = data[0].leaguePoints;
                    summonerData.rankData.rankFlexWin = data[0].wins;
                    summonerData.rankData.rankFlexLose = data[0].losses;
                }


                resolve();
            })
    });
}

async function masteryDataRequest (encryptedId) {
    console.log('mastery data request start')
    return new Promise(resolve => {
        fetch(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encryptedId}?api_key=${api_key.keyValue}`)
            .then(res => res.json())
            .then(data => {
                summonerData.masteryData.most1Id = data[0].championId;
                summonerData.masteryData.most1Level = data[0].championLevel;
                summonerData.masteryData.most1Points = data[0].championPoints;

                summonerData.masteryData.most2Id = data[1].championId;
                summonerData.masteryData.most2Level = data[1].championLevel;
                summonerData.masteryData.most2Points = data[1].championPoints;

                summonerData.masteryData.most3Id = data[2].championId;
                summonerData.masteryData.most3Level = data[2].championLevel;
                summonerData.masteryData.most3Points = data[2].championPoints;

                fetch('https://ddragon.leagueoflegends.com/cdn/13.6.1/data/ko_KR/champion.json')
                            .then(res => res.json())
                            .then(data => {
                                for (let i in data.data) {
                                    if (parseInt(data.data[i].key) === summonerData.masteryData.most1Id) {
                                        summonerData.masteryData.m1champName = data.data[i].name;
                                        summonerData.masteryData.m1champEng = data.data[i].id;
                                    }
                                    if (parseInt(data.data[i].key) === summonerData.masteryData.most2Id) {
                                        summonerData.masteryData.m2champName = data.data[i].name;
                                        summonerData.masteryData.m2champEng = data.data[i].id;
                                    }
                                    if (parseInt(data.data[i].key) === summonerData.masteryData.most3Id) {
                                        summonerData.masteryData.m3champName = data.data[i].name;
                                        summonerData.masteryData.m3champEng = data.data[i].id;
                                    }
                                }

                                resolve();
                            })
            })
    })
}

async function userDataInsert() {
    resultBody.className += ' listViewer';
    header.style.marginTop = "60px";
    resultBody.innerHTML = resultBody.innerHTML + `
    <div class="userInfoContainer">
        <div class="iconArea">
            <h4>${summonerData.userData.summonerLevel}</h4>
            <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${summonerData.userData.summonerIcon}.png" alt="userProfile">
        </div>

        <div class="userArea">
            <h2>${summonerData.userData.summonerName}</h2>
            <div class="mostArea">
                <div class="mostChamp">
                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${summonerData.masteryData.m1champEng}.png" alt="mostChamp1" class="championProfile">
                    <ul>
                        <li><h3>${summonerData.masteryData.m1champName}</h3></li>
                        <li><h4>숙련레벨 ${summonerData.masteryData.most1Level}</h4></li>
                        <li><h4>숙련점수 ${summonerData.masteryData.most1Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                    </ul>
                </div>
                <div class="mostChamp">
                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${summonerData.masteryData.m2champEng}.png" alt="mostChamp2" class="championProfile">
                    <ul>
                        <li><h3>${summonerData.masteryData.m2champName}</h3></li>
                        <li><h4>숙련레벨 ${summonerData.masteryData.most2Level}</h4></li>
                        <li><h4>숙련점수 ${summonerData.masteryData.most2Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                    </ul>
                </div>
                <div class="mostChamp">
                    <img src="http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/${summonerData.masteryData.m3champEng}.png" alt="mostChamp3" class="championProfile">
                    <ul>
                        <li><h3>${summonerData.masteryData.m3champName}</h3></li>
                        <li><h4>숙련레벨 ${summonerData.masteryData.most3Level}</h4></li>
                        <li><h4>숙련점수 ${summonerData.masteryData.most3Points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}점</h4></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="rankArea">
            <div class="rankBox">
                <img src="./src/tier/${summonerData.rankData.rankSoloTier}.png" alt="tierImg">
                <ul>
                    <li><h3>솔로랭크</h3></li>
                    <li><h4>${summonerData.rankData.rankSoloTier} ${summonerData.rankData.rankSoloRank}</h4> <h5>${summonerData.rankData.rankSoloPoints}점</h5></li>
                    <li><h5>${summonerData.rankData.rankSoloWin}승 ${summonerData.rankData.rankSoloLose}패 (${(100 * (summonerData.rankData.rankSoloWin / (summonerData.rankData.rankSoloWin + summonerData.rankData.rankSoloLose))).toFixed(2)}%)</h5></li>
                </ul>
            </div>
            <div class="rankBox">
                <img src="./src/tier/${summonerData.rankData.rankFlexTier}.png" alt="tierImg">
                <ul>
                    <li><h3>자유랭크</h3></li>
                    <li><h4>${summonerData.rankData.rankFlexTier} ${summonerData.rankData.rankFlexRank}</h4> <h5>${summonerData.rankData.rankFlexPoints}점</h5></li>
                    <li><h5>${summonerData.rankData.rankFlexWin}승 ${summonerData.rankData.rankFlexLose}패 (${(100 * (summonerData.rankData.rankFlexWin / (summonerData.rankData.rankFlexWin + summonerData.rankData.rankFlexLose))).toFixed(2)}%)</h5></li>
                </ul>
            </div>
        </div>
    </div>
    `
    resultBody.scrollTop = resultBody.scrollHeight;

    return
}

async function searchAsyncFunctions(userInput) {
    await userDataRequest(userInput); // input value 넣기
    await rankDataRequest(summonerData.userData.summonerEncryptedId);
    await masteryDataRequest(summonerData.userData.summonerEncryptedId);
    await userDataInsert();
}

export { searchAsyncFunctions, summonerData };