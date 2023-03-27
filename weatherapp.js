const { response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { getEnvironmentData } = require('worker_threads');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
//we can only use response.send for once for express...
//but we can use response.write()...multiple times

app.use("/public",express.static('public'));

app.get("/",(request,response)=>{
    response.sendFile(__dirname+"/weather.html");
});

app.post("/",(request,response)=>{

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+request.body.cityname+"&units=metric&appid=b1cedfe38c0fd50f17231b3f1b7b3219#"
    https.get(url,(response_by_api)=>{
        console.log(response_by_api.statusCode);
        response_by_api.on("data",(data)=>{
            var weatherData = JSON.parse(data);
            console.log(weatherData);

           if(response_by_api.statusCode===200){
            var temperature = weatherData.main.temp;
            var icon = weatherData.weather[0].icon;
            response.write("<p>thanks for using my web app</p>");
            response.write("<h1>the temperature  in "+request.body.cityname+" is "+temperature+" degree centigrate</h1>");
            response.write("weather : "+weatherData.weather[0].description);
            response.write(`<img src='http://openweathermap.org/img/wn/${icon}@2x.png'>`);
            response.send();
           }
           else{
            response.sendFile(__dirname+"/failure.html");
           }
    })  ;
    });
})

app.post("/failure",(request,response)=>{
    response.redirect("/");
})



app.listen(process.env.PORT || 3000,()=>{
    console.log("this port 3000");
});

