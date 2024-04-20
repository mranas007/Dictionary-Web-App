const searchBtn = document.querySelector("#searchButton");
const alertBox = document.querySelector(".notifications-container");
const removeAlertBtn = document.querySelector("#dismissBtn");

const searchBtnEnable = () => {
    searchBtn.disabled = false;
    searchBtn.innerHTML = "Search";
}

const searchBtnDisable = () => {
    searchBtn.disabled = true;
    searchBtn.innerHTML = `<div class="loader"></div>`;
}

searchBtn.addEventListener("click", async () => {
    searchBtnDisable()
    let inputValue = document.querySelector("#searchInput").value;
    if (inputValue == "") {
        return searchBtnEnable();
    };

    const showResult = document.querySelector(".results");
    const blobValue = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue}`)
    const readyData = await blobValue.json();

    const alertMsg = document.querySelector("#alertMsg");
    const title = "No Definitions Found";

    if (readyData.title == title) {
        searchBtnEnable()
        alertMsg.innerHTML = `Sorry, we couldn't find any results for the <span>${inputValue}</span> you were looking for.`
        alertBox.classList.add("alertPosition")
        return
    };

    let audioPath = "";
    let audioBtn = "";
    const speakerIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="30" height="30" fill="#fff"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`;

    readyData.forEach((data) => {

        if (data.phonetics[0] != undefined) {
            if (data.phonetics[0].audio != undefined) {
                audioPath = data.phonetics[0].audio;
                audioBtn = `<div id="audioIcon">${speakerIcon}</div>`
            }
        }

        searchBtnEnable()
        let synonyms = "";
        if (data.meanings[0].synonyms[0] != undefined) {
            synonyms = `<div id="synonyms"><span>Synonyms:</span> ${data.meanings[0].synonyms.join(', ')}</div>`;
            console.log("undefine nai ostad");
        }

        showResult.innerHTML = `
            <div id="wordInfo">
            <h2 id = "word">Word: <span>${inputValue}</span></h2>
            <div id="partOfSpeech"><span>Part of Speech:</span> ${data.meanings[0].partOfSpeech}</div>
            <div id="definitions"><span>Definition:</span> ${data.meanings[0].definitions[0].definition}</div>
            ${synonyms}
            ${audioBtn}
        </div> `
    })

    // prounce the word 
    const speakBtn = document.querySelector("#audioIcon");
    speakBtn.addEventListener("click", () => {
        const audioSrc = audioPath;
        const audio = new Audio(audioSrc);
        audio.play();
    })
})

// dismiss the alert 
removeAlertBtn.addEventListener("click", () => {
    alertBox.classList.remove("alertPosition");
    document.querySelector("#searchInput").value = "";
});