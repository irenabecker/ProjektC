// DATA

const APP_ID = "amzn1.ask.skill.990cac85-3735-4aca-abe6-19fc681fad4b";
const slotName = "shop";
const skillName = "Tagesangebot";
const WELCOME_MESSAGE = "Willkommen bei Tagesangebote";
const HELP_MESSAGE = "Du kannst sagen, 'Zeig mir die Tagesangebote von Betzold' oder 'Was ist das heutige Angebot von Puma?'. ";
const SHUTDOWN_MESSAGE = "Ok. Auf wiedersehen. ";
const EXIT_SKILL_MESSAGE = "Ok. Auf wiedersehen. ";
const data = [
	{name: "globetrotter", details: {article:"Wanderschuhe", price:"fünfzig euro", digit:"50", shopName:"Globetrotter"}}, 
	{name: "betzold",  details: {article:"bunte Kreide", price:"fünf euro", digit: "5", shopName:"Betzold"}}, 
	{name: "hagebau",  details: {article:"Sonnenschirm grün", price:"fünfundzwanzig euro", digit: "25", shopName:"Hagebau"}},
	{name: "mammut",  details: {article:"Isoschlafsack", price:"neunzig euro", digit: "90", shopName:"Mammut"}},
	{name: "vangraaf",  details: {article:"rotes Top", price:"zwanzig euro", digit: "20", shopName:"Vangraaf"}},
	{name: "puma",  details: {article:"Sneakers", price:"hundert euro", digit: "100", shopName:"Puma"}}
];
const imgG =             {
                   smallImageUrl: 'https://i.ebayimg.com/images/g/lOYAAOSwJcZWdDge/s-l300.jpg',
                   largeImageUrl: 'https://i.ebayimg.com/images/g/lOYAAOSwJcZWdDge/s-l300.jpg'
                };
const imgB =             {
                   smallImageUrl: 'https://static.betzold.de/images/prod/74972/12-Stueck-Kreide-in-Faltschachtel-6-Farben-je-2-Stueck-rund-74972_bdefops-M.jpg',
                   largeImageUrl: 'https://static.betzold.de/images/prod/74972/12-Stueck-Kreide-in-Faltschachtel-6-Farben-je-2-Stueck-rund-74972_bdefops-M.jpg'
                };
const imgH =             {
                   smallImageUrl: 'https://media.real-onlineshop.de/images/items/200x200/8aa7479e80a20ea0cff912a47880ec54.jpg',
                   largeImageUrl: 'https://media.real-onlineshop.de/images/items/200x200/8aa7479e80a20ea0cff912a47880ec54.jpg'
                };
const imgM =            {
                   smallImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71lWIrEbPkL._SY355_.jpg',
                   largeImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71lWIrEbPkL._SY355_.jpg'
                };
const imgV =             {
                   smallImageUrl: 'https://images-eu.ssl-images-amazon.com/images/I/41zVWeGttEL._AC_UL260_SR200,260_.jpg',
                   largeImageUrl: 'https://images-eu.ssl-images-amazon.com/images/I/41zVWeGttEL._AC_UL260_SR200,260_.jpg'
                };
const imgP =             {
                   smallImageUrl: 'https://photos6.spartoo.com/photos/678/6780803/6780803_350_A.jpg',
                   largeImageUrl: 'https://photos6.spartoo.com/photos/678/6780803/6780803_350_A.jpg'
                };
var yesQuestion;
var noQuestion;
var shop;
var article;
var price;
var shopName;
var digit;
var speechOutput;
                
/*API Request könnte so aussehen:

const https = require('https');

https.get('https://www.hagebau.de/ipad-api/v20/search/?queryTerm=' + queryterm, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
*/


// Skill Code

const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        speechOutput = WELCOME_MESSAGE;
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
    'TagesangeboteIntent': function () {
        var slotValue = isSlotValid(this.event.request, slotName); 
        if  (slotValue) {
            for (let i=0; i<data.length; i++){
            	if (sanitizeSearchQuery(slotValue) == data[i].name){
            		shop = data[i].name;
            		article = data[i].details.article;
            		price = data[i].details.price;
            		digit = data[i].details.digit;
            		shopName = data[i].details.shopName;
            	}
            }
            speechOutput = shop + " hat " + article +" für " + price + " im Angebot. Soll ich dir das Angebot zuschicken?";
        } else {
            speechOutput = HELP_MESSAGE;
        }
        yesQuestion = "0";
        noQuestion = "0";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
    "AMAZON.YesIntent": function() {
        var imageObj;
        var productDetails = (shopName + " hat " + article +" für " + digit + " € im Angebot!");
         
        if(yesQuestion === "0"){
            if(shop == "betzold"){
                imageObj = imgB;
            }
            else if(shop == "mammut"){
                imageObj = imgM;
            }
            else if(shop == "vangraaf"){
                imageObj = imgV;
            }
            else if(shop == "puma"){
                imageObj = imgP;
            }
            else if(shop == "globetrotter"){
                imageObj = imgG;
            }
            else {
                imageObj = imgH;
            }
            
            speechOutput = "Alles klar, ich schicke dir das Angebot zu. Hast du Interesse an weiteren Angeboten?";
            this.response.speak(speechOutput).cardRenderer(shopName, productDetails, imageObj).listen(speechOutput);
    		yesQuestion = "1";
    		
        } else {
            speechOutput = "Bitte wähle einen weiteren Anbieter.";
            this.response.speak(speechOutput).listen(speechOutput);
    		yesQuestion = "0";
        }
        this.emit(':responseReady'); 

	},
	
	"AMAZON.NoIntent": function() {
        if((noQuestion === "0") && (yesQuestion ==="0")){
            speechOutput = "Hast du Interesse an Angeboten anderer Anbieter?";
            this.response.speak(speechOutput).listen(speechOutput);
    		this.emit(':responseReady');
    		noQuestion = "1";
        }else{
            this.response.speak(SHUTDOWN_MESSAGE);
    		this.emit(':responseReady');
    		noQuestion = "0";
    		yesQuestion = "0";
        }
	},
	
	"AMAZON.StopIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	
	"AMAZON.CancelIntent": function() {
		this.response.speak(EXIT_SKILL_MESSAGE);
		this.emit(':responseReady');
	},
	
	"AMAZON.HelpIntent": function() {
		this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
		this.emit(':responseReady');
	},
	
	"Unhandled" : function(){
	    this.response.speak("Wie bitte?").listen(HELP_MESSAGE);
		this.emit(':responseReady');
	}
};
    
//Helper Functions

function isSlotValid(request, slotName){
        var slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        var slotValue;
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            return false;
        }
}

function sanitizeSearchQuery(searchQuery){
	searchQuery = searchQuery.replace(/’s/g, "").toLowerCase();
	searchQuery = searchQuery.replace(/'s/g, "").toLowerCase();
	return searchQuery;
}