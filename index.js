// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function
const APP_ID = "amzn1.ask.skill.990cac85-3735-4aca-abe6-19fc681fad4b";
const slotName = "shop";
const skillName = "Tagesangebote";
const WELCOME_MESSAGE = "Willkommen bei Tagesangebote";
const HELP_MESSAGE = "Du kannst sagen, 'Zeig mir die Tagesangebote von Betzold' oder 'Was ist das heutige Angebot von Puma?'. ";
const SHUTDOWN_MESSAGE = "Ok. Auf wiedersehen. ";
const EXIT_SKILL_MESSAGE = "Ok. Auf wiedersehen. ";

const data = [
	{name: "globetrotter", details: {article:"wanderschuhe", price:"fünfzig euro"}}, 
	{name: "betzold",  details: {article:"bunte kreide", price:"fünf euro"}}, 
	{name: "hagebau",  details: {article:"sonnenschirm grün", price:"fünfundzwanzig euro"}},
	{name: "mammut",  details: {article:"isoschlafsack", price:"neunzig euro"}},
	{name: "vangraaf",  details: {article:"rotes top", price:"zwanzig euro"}},
	{name: "puma",  details: {article:"sneakers", price:"hundert euro"}}
];

// 2. Skill Code =======================================================================================================

const Alexa = require('alexa-sdk');
var yesQuestion = "0";
var noQuestion = "0";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        var speechOutput = WELCOME_MESSAGE;
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
        'TagesangeboteIntent': function () {
        var speechOutput;
        var slotValue = isSlotValid(this.event.request, slotName); 
        if  (slotValue) {
            for (let i=0; i<data.length; i++){
            	if (sanitizeSearchQuery(slotValue) == data[i].name){
            		var shop = data[i].name;
            		var article = data[i].details.article;
            		var price = data[i].details.price;
            	}
            }
            speechOutput= shop + " hat " + article +" für " + price + " im Angebot. Soll ich dir das Angebot zuschicken?";
        } else {
            speechOutput="Es gibt keine aktuellen Angebote von  " + slotValue + ".";
        }
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
    "AMAZON.YesIntent": function() {
        var speechOutput;
        if(yesQuestion === "0"){
            var imageObj = {
                   smallImageUrl: 'https://simosviolaris.com/7749-large_default/philips-fc933109-powerpro-compact-.jpg',
                   largeImageUrl: 'https://simosviolaris.com/7749-large_default/philips-fc933109-powerpro-compact-.jpg'
                };
            speechOutput = "Alles klar, ich schicke dir das Angebot zu. Hast du Interesse an weiteren Angeboten?";
            this.response.speak(speechOutput).cardRenderer(skillName, speechOutput, imageObj).listen(speechOutput);
    		this.emit(':responseReady');
    		yesQuestion = "1";
        }else{
            speechOutput = "Bitte wähle einen weiteren Anbieter.";
            this.response.speak(speechOutput).listen(speechOutput);
    		this.emit(':responseReady');
    		yesQuestion = "0";
        }
	},
	"AMAZON.NoIntent": function() {
	     var speechOutput;
        if((noQuestion === "0") && (yesQuestion ==="0")){
            speechOutput = "Hast du Interesse an Angeboten anderer Anbieter?";
            this.response.speak(speechOutput).listen(speechOutput);
    		this.emit(':responseReady');
    		noQuestion = "1";
        }else{
            this.response.speak(SHUTDOWN_MESSAGE);
    		this.emit(':responseReady');
    		noQuestion = "0";
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
    
// 3. Helper Function  =================================================================================================

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