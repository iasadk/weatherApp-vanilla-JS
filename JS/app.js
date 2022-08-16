const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoText = wrapper.querySelector('.info-txt'),
inputField = wrapper.querySelector('input');
locationBtn = wrapper.querySelector('button');
backBtn = wrapper.querySelector('header i');

locationBtn.addEventListener('click',()=>{
    if(navigator.geolocation){ //if browser supports this api
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
        
    }
    else{
        alert('Your browser dosent support this functionality!!');
    }
})

backBtn.onclick = ()=>{
    wrapper.classList.remove('active');
}
function onSuccess(geoInfo){
    const lat = geoInfo.coords.latitude;
    const long = geoInfo.coords.longitude;
    fetchLocationWeatherResults(lat,long);
    console.log(lat,long);
    console.log(geoInfo);
}


function onError(error){
    infoText.innerText = error.message;
    if(infoText.classList.contains('pending')){
        infoText.classList.remove('pending');
    }
    infoText.classList.add('error');
}

inputField.addEventListener('keyup',(e)=>{
    if(e.key=='Enter' && inputField.value!=""){
        requestApi(inputField.value);
    }
    
});


function requestApi(city){
    const key = 'e421ffe196d0b1a5912aa329d0e23a5e';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    fetchData(url);
};

function weatherDetails(info){
    if(info.cod=='200'){
        wrapper.classList.add('active');
        // storing valuable data in variables: -
        const city = info.name;
        const temp = Math.floor(info.main.temp);
        const country = info.sys.country;
        const description = info.weather[0].description;
        const id = info.weather[0].id;
        const feelsLike = Math.floor(info.main.feels_like);
        const humidity = info.main.humidity;
        const wIcons = wrapper.querySelector('.weather-part img');

        if(id==200){
            wIcons.src = "Weather Icons/storm.svg"
        }
        else if(id==721){
            wIcons.src = "Weather Icons/haze.svg"
        }
        else if(id>=500 && id<=532){
            wIcons.src = "Weather Icons/rain.svg"
        }
        else if(id>=600 && id<=623){
            wIcons.src = "Weather Icons/snow.svg"
        }
        else if(id==800){
            wIcons.src = "Weather Icons/clear.svg"
        }
        else if(id>800 && id<805){
            wIcons.src = "Weather Icons/cloud.svg"
        }
        

        //passing data to our weather card
        wrapper.querySelector('.temp .numb').innerText = temp;
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city},${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = feelsLike;
        wrapper.querySelector('.humidity .details span').innerText = `${humidity}%`;

        console.log(info);

    }
    else{
        onError(info);
    }


}

function fetchData(url){
    infoText.innerText = "Getting details...";
    infoText.classList.add('pending');
    fetch(url)
    .then(result=>{
        return result.json();
    }).then(data=>{
        weatherDetails(data);
    })
}

function fetchLocationWeatherResults(latCord,longCord){
    const key = 'e421ffe196d0b1a5912aa329d0e23a5e';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latCord}&lon=${longCord}&units=metric&appid=${key}`;
    fetchData(url);
    
}