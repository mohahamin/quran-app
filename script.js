// Holly Quran app v.0.1 
// Developed by mohammed ahmed amin , DEC.2023 

const apiUrl = "https://mp3quran.net/api/v3/";
const languages = ['ar','eng','fr','ru','de','es','tr','cn','th','ur','bn','bs','ug','fa','tg','ml','tl','id','pt','ha','sw'];

// Get languages from API 
async function getLanguages() {
    const choseLanguage = document.querySelector("#choseLanguage")
    const response = await fetch(`${apiUrl}languages`)
    const data = await response.json()
    choseLanguage.innerHTML = `<option value="">اختر لغة</option>`
    data.language.forEach(language => choseLanguage.innerHTML += `<option value="${language.id}">${language.native}</option>`);
    choseLanguage.addEventListener('change', e => getRectier(e.target.value))
    choseLanguage.addEventListener('change', e => getSurah(e.target.value))
}
getLanguages();

// Get reciters from API 
async function getRectier(language){
    const choseReciter = document.querySelector("#choseReciter")
    const response = await fetch(`${apiUrl}reciters?language=${languages[language-1]}`)
    const data = await response.json()
    choseReciter.innerHTML = `<option value="">اختر قارئ</option>`
    data.reciters.forEach(reciter => choseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`);
    choseReciter.addEventListener('change', e => getMoshaf(language, e.target.value))
}
getRectier();

// Get Moshaf of each Reciter 
async function getMoshaf(language, reciter){
    const choseMoshaf = document.querySelector("#choseMoshaf")
    const response = await fetch(`${apiUrl}reciters?language=${languages[language-1]}&reciter=${reciter}`)
    const data = await response.json()
    const Moshafs = data.reciters[0].moshaf;
    choseMoshaf.innerHTML = `<option value="">اختر تلاوة</option>`
    Moshafs.forEach(moshaf => choseMoshaf.innerHTML += `<option 
    value="${moshaf.id}"
    data-server="${moshaf.server}" 
    data-surahlist="${moshaf.surah_list}">
    ${moshaf.name}</option>`);
    choseMoshaf.addEventListener('change', e => {
    const selectedMoshaf = choseMoshaf.options[choseMoshaf.selectedIndex]
    const surahServer = selectedMoshaf.dataset.server;
    const surahList = selectedMoshaf.dataset.surahlist;
    getSurah(language, surahServer, surahList)
    })
}
getMoshaf();


// Get Suwar of each Moshaf 
async function getSurah(language, surahServer, surahList) {

    const choseSurah = document.querySelector("#choseSurah")
    const response = await fetch(`${apiUrl}suwar?language=${languages[language-1]}`)
    const data = await response.json()
    const surahName = data.suwar

    surahList = surahList.split(",")
    
    choseSurah.innerHTML = `<option value="">اختر سورة</option>`
    surahList.forEach(surah => {surahName.forEach(surahName => {
        const idPad =  surah.padStart(3,"0")
        if(surahName.id == surah){
            choseSurah.innerHTML += `<option value="${surahServer}${idPad}.mp3">${surahName.name}</option>`
        }
    })});
    choseSurah.addEventListener('change', e => {
        const selectedSurah = choseSurah.options[choseSurah.selectedIndex]
        playSurah(selectedSurah.value)
    });
} 
getSurah();

// Play surah on audio player 
function playSurah(selectedSurah){
    const audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.src = selectedSurah;
    audioPlayer.play();
}
playSurah();

// ------------------------------------------------ Adhan API ---------------------------------------------------------------- //

const cities = [
    {"بورتسودان" : "Red Sea"},
    {"ود مدني" : "Al Jazīrah"},
    {"الخرطوم" : "Khartoum"},
    {"القضارف" : "Gedaref"},
    {"دنقلا" : "Ash Shamālīyah"},
    {"الدمازين" : "Blue Nile"},
    {"كسلا" : "Kassala"},
    {"عطبرة" : "River Nile"},
    {"سنار" : "Sennar"},
    {"شرق دارفور" : "East Darfur"},
    {"وسط دارفور" : "Central Darfur"},
    {"شمال دارفور" : "North Darfur"},
    {"غرب دارفور" : "West Darfur"},
    {"جنوب دارفور" : "South Darfur"},
    {"شمال كردفان" : "North Kordofan"},
    {"غرب كردفان" : "West Kordofan"},
    {"جنوب كردفان" : "South Kordofan"},
    {"زالنجى" : "Zalingei"},
]

const choseLocation = document.querySelector("#choseLocation")
const locationName = document.querySelector("#locationName")

cities.forEach(city => {
    choseLocation.innerHTML += `<option value="${Object.values(city)}">${Object.keys(city)}</option>`
})

choseLocation.addEventListener('change', e => {
    const selectedLocation = choseLocation.options[choseLocation.selectedIndex]
    locationName.innerHTML = `<p id="locationName">${selectedLocation.text}</p>`
    getPrayers(selectedLocation.value)
});

// Get prayers from api
async function getPrayers(selectedLocation) {
    const AdhanApiUrl = "https://api.aladhan.com/v1/timingsByCity";
    const country = "SD";
    const response = await fetch(`${AdhanApiUrl}?country=${country}&city=${selectedLocation}`);
    const data = await response.json();
    const timings = data.data.timings
    document.getElementById("date").innerHTML = `${data.data.date.hijri.weekday.ar} - ${data.data.date.hijri.day} - ${data.data.date.hijri.month.ar}`
    fillPrayerTimes("Fajr", timings.Fajr)
    fillPrayerTimes("Sunrise", timings.Sunrise)
    fillPrayerTimes("Dhuhr", timings.Dhuhr)
    fillPrayerTimes("Asr", timings.Asr)
    fillPrayerTimes("Maghrib", timings.Maghrib)
    fillPrayerTimes("Isha", timings.Isha)
    
    function fillPrayerTimes(id, time){
        document.getElementById(id).innerHTML = `<span>${time}</span>`
    }
}
    getPrayers();

// ------------------------------------------------ Adhan API ---------------------------------------------------------------- //
























// ------------------------------------------------ Adhan API ---------------------------------------------------------------- //

// Toggle active class between channels buttons 
const btnGroup = document.getElementById("btn-group"); 
let prevButton = null;
const buttonPressed = (e) => {
  if(e.target.nodeName === 'BUTTON') {
    e.target.classList.add('active'); 
    if(prevButton !== null) {
      prevButton.classList.remove('active');  
    }
    prevButton = e.target;
  }
}
btnGroup.addEventListener("click", buttonPressed);

// Play live channels using hls player 
function playLive(channel) {
  
    if (Hls.isSupported()) {
        var video = document.getElementById('live');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        video.play();
      }else{
          alert("Cannot stream HLS, use another video source");
      }

}
playLive(channel);
