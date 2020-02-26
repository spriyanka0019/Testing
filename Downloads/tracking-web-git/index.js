//Firebase Credentials 
var config = {
  apiKey: "AIzaSyDIUZbqsSGfkAoz8gTSkHp16BSW5pjuwNM",
  authDomain: "stromr3-c3633.firebaseapp.com",
  databaseURL: "https://stromr3-c3633.firebaseio.com",
  projectId: "stromr3-c3633",
  storageBucket: "stromr3-c3633.appspot.com",
  messagingSenderId: "1057307123268",
  appId: "1:1057307123268:web:d79e29db4c13ae20c9a611",
  measurementId: "G-09R02PNTTR"
};

//initialize current APP
firebase.initializeApp(config);

const ShowTripsTaken = document.querySelector("#bttShowTrips");
// const ShowTripsName = document.querySelector("#bttTripName")
const rinputTextFieldid = document.querySelector("#textcarID");

//For Button Trips Taken
// const rinputTripsCarID = document.querySelector("#rtxtTripsCarID");
// const rinputTripsDate = document.querySelector("#rtxtTripsDate"); 
const gMap=document.querySelector("map");
var firestore = firebase.firestore();
        
// const locationRef = firestore.collection("locations");//OLD DB
const locationRef = firestore.collection("CarGPSLocation");

var i = 0;
var j = 0;
var flightPath = [];
var eventDates = [];


//Button To Show the Calendar Highlighting TripsTaken on that Date
ShowTripsTaken.addEventListener("click",function(){

          document.getElementById('battery').innerHTML =""  
          document.getElementById('distance').innerHTML = ""
          document.getElementById('energyconsume').innerHTML =""
          document.getElementById('odometer').innerHTML =""
//  locationRef.where('CarID',"==",rinputTextFieldid.value).get().then(snapshot=>{
//     snapshot.forEach( doc =>{
//       //  eventDates[ new Date( '01/23/2020' )] = new Date( '01/23/2020' );
//       // eventDates[ new Date( doc.data().GPSRenderDate)] = new Date( doc.data().GPSRenderDate);      
//     });  
//       });


$( function() {
    // eventDates[ new Date( '01/23/2020' )] = new Date( '01/23/2020' );
    $('#datepicker').datepicker({
        // beforeShowDay: function(date) {
        //     var highlight = eventDates[date];
        //     if(highlight) {
        //          return [true, "event", 'Trip Available'];
        //     } else {
        //          return [true, '', ''];
        //     }
        // },
   
  onSelect: function (date) {
    //Initializing map function to Refresh For every Date Selected
     map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 19.075983, lng: 72.877655},
          zoom: 8
        });

  //Variable to calculate cumulative distance travedlled in the particular day.
  var cumulative_distance =0;
  var TripCovered = [];
  var BatterySOC = [];
  var arr = [];
  var RecentSOC = [];
  locationRef.where('CarID',"==",rinputTextFieldid.value).where("GPSRenderDate","==",date).orderBy('ServerTimeStamp','desc')
  .get().then(snapshot =>{

     document.getElementById('battery').innerHTML =""  
         document.getElementById('distance').innerHTML = ""
          document.getElementById('energyconsume').innerHTML =""
          document.getElementById('odometer').innerHTML =""
   
    snapshot.forEach(doc=>{
        if(!RecentSOC.includes(doc.data().BatterySOC))
        RecentSOC.push(doc.data().BatterySOC);

      //  console.log("SoC",doc.data().GPSTime,doc.data().BatterySOC);

        if(!TripCovered.includes(doc.data().DistanceTravelled))
         TripCovered.push(doc.data().DistanceTravelled);

      if(!arr.includes(doc.data().TripID))
      arr.push(doc.data().TripID); 
    }); 
  console.log(("Final Arrray"),"=>",arr ); 
//  console.log(TripCovered[0],TripCovered[TripCovered.length-1]); 

if(!arr.length==0){
   document.getElementById('popup').innerHTML = ""
  console.log("TripIsThere")
}
else{
   document.getElementById('popup').innerHTML = "No Data Available"
    document.getElementById('battery').innerHTML ="-"  
         document.getElementById('distance').innerHTML = "-"
          document.getElementById('energyconsume').innerHTML ="-"
          document.getElementById('odometer').innerHTML ="-"
 }

//Loop for showing trails of the particular date and show calculated distance

// if (arr.length>8){
//   arr.length = 10;
// }
// else
// arr.length = arr.length;
   
  for(j = 0 ;j<arr.length;j++){        
        locationRef.where('CarID','==',rinputTextFieldid.value).where('TripID', '==',arr[j]).
        where("GPSRenderDate","==",date).orderBy('ServerTimeStamp','desc').get()
        .then(snapshot => {   
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  
       var carTrail = [];
        snapshot.forEach(doc => { 
        var data = doc.data();
        var la = data.GeoPoint.latitude;
        var lo = data.GeoPoint.longitude;
        var timestamp = data.ServerTimeStamp;
        var GPStime = data.GPSTime;
        console.log(GPStime,la,lo)
        carTrail.push(new google.maps.LatLng(la, lo));
        });

         document.getElementById('battery').innerHTML =RecentSOC[0] +"%";  
         var chopped_cum = cumulative_distance.toFixed(2);     
         document.getElementById('distance').innerHTML = Math.abs((TripCovered[0]-TripCovered[TripCovered.length-1])).toFixed(0)+ " Km";  
         document.getElementById('energyconsume').innerHTML =Math.abs(RecentSOC[0]-RecentSOC[RecentSOC.length-7]) +"%"; 
         document.getElementById('odometer').innerHTML =TripCovered[0].toFixed(2) +" Km";  
        updateMap(carTrail);
      })
     }
   })
   }
 }) 
})})
  

  function updateMap(carTrail){
   flightPath = new google.maps.Polyline({
      path: carTrail,
      geodesic: false,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    map.setZoom(15);
    flightPath.setMap(map);
    map.setCenter(carTrail[0]);
    console.log("Set Map Function Called");
}






    
 
