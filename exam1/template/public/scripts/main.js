/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Matthew Ragland
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.variableName = "";

/**
 *  Provided in order so that an INCREASE in the index will result in moving EAST
 *  and a DECREASE in the index will result in moving WEST
 * 
 *  To make this VERY simple we are just using a single index value, which is 
 * the placement within this array. Indiana is the 8th item with index=7
 *  
 */
 rhit.tzStrings = [
    {"label":"(GMT-12:00) International Date Line West","value":"Etc/GMT+12"},
    {"label":"(GMT-11:00) Midway Island, Samoa","value":"Pacific/Midway"},
    {"label":"(GMT-10:00) Hawaii","value":"Pacific/Honolulu"},
    {"label":"(GMT-09:00) Alaska","value":"US/Alaska"},
    {"label":"(GMT-08:00) Pacific Time (US & Canada)","value":"America/Los_Angeles"},
    {"label":"(GMT-07:00) Arizona","value":"US/Arizona"},
    {"label":"(GMT-06:00) Central Time (US & Canada)","value":"US/Central"},
    {"label":"(GMT-05:00) Indiana (East)","value":"US/East-Indiana"},
    {"label":"(GMT-04:00) Atlantic Time (Canada)","value":"Canada/Atlantic"},
    {"label":"(GMT-03:00) Buenos Aires, Georgetown","value":"America/Argentina/Buenos_Aires"},
    {"label":"(GMT-02:00) Mid-Atlantic","value":"America/Noronha"},
    {"label":"(GMT-01:00) Cape Verde Is.","value":"Atlantic/Cape_Verde"},
    {"label":"(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London","value":"Etc/Greenwich"},
    {"label":"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna","value":"Europe/Amsterdam"},
    {"label":"(GMT+02:00) Amman","value":"Asia/Amman"},
    {"label":"(GMT+03:00) Kuwait, Riyadh, Baghdad","value":"Asia/Kuwait"},
    {"label":"(GMT+04:00) Abu Dhabi, Muscat","value":"Asia/Muscat"},
    {"label":"(GMT+05:00) Yekaterinburg","value":"Asia/Yekaterinburg"},
    {"label":"(GMT+06:00) Almaty, Novosibirsk","value":"Asia/Almaty"},
    {"label":"(GMT+07:00) Bangkok, Hanoi, Jakarta","value":"Asia/Bangkok"},
    {"label":"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi","value":"Asia/Hong_Kong"},
    {"label":"(GMT+09:00) Osaka, Sapporo, Tokyo","value":"Asia/Tokyo"},
    {"label":"(GMT+10:00) Brisbane","value":"Australia/Brisbane"},
    {"label":"(GMT+11:00) Magadan, Solomon Is., New Caledonia","value":"Asia/Magadan"},
    {"label":"(GMT+12:00) Fiji, Kamchatka, Marshall Is.","value":"Pacific/Fiji"},
    {"label":"(GMT+13:00) Nuku'alofa","value":"Pacific/Tongatapu"}
]


/** Provided. Given an integer representing the current timezone lookup the label of the timezone.*/
rhit.getTimeZoneLabel = function ( offset) {
	return rhit.tzStrings[offset].label;
};

/** Provided. Given an integer representing the current timezone lookup the value needed to format a string in the timezone.*/
rhit.getTimeZoneValue = function ( offset) {
	return rhit.tzStrings[offset].value;
};



rhit.TimezoneManager = class {
	constructor() {
        //TODO initialize values in class
        this.zoneIndex = 7;
        this.weekday = true;
        this.minute = true;
        this.second = true;
	}

    //TODO - hint: at some point you will need to shift the current offset +1 or -1 to shift time zones
    // if x is the current offset, you can use the modulus % operator to help out. Since the array has
    // length 26, we can make sure it does not go too high or too low with the following approach:
    // x = (26 + (x + 1)) % 26;  //add +1 when at (25) 26+25+1-> 52 % 26 = 0
    // x = (26 + (x - 1)) % 26;  //add +1 when at (0)  26+0 -1-> 25 % 26 = 25


    //TODO  currently hardcoded to always be Indiana (7)
	getCurrentLocationString(){
		return `Currently in ${rhit.getTimeZoneLabel(this.zoneIndex) } with local time:`;
	}

    //TODO  currently hardcoded to always be Indiana (7) change to be whatever timezone we should be
	getCurrentDateString(){

        

        if (this.weekday && this.minute && this.second) {
            let options = {weekday: 'long', hour:'numeric', minute:'numeric',second:'numeric', timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        } else if (this.weekday && this.minute) {
            let options = {weekday: 'long', hour:'numeric', minute:'numeric', timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        } else if (this.weekday) {
            let options = {weekday: 'long', hour:'numeric', timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        } else if (this.minute && this.second) {
            let options = {hour:'numeric', minute:'numeric',second:'numeric', timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        } else  if (this.minute) {
            let options = {hour:'numeric', minute:'numeric',timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        } else {
            let options = {hour:'numeric', timeZone:rhit.getTimeZoneValue(this.zoneIndex)  };
            this.currentLocalDate = new Date().toLocaleTimeString('en-US', options);
        }
        
		
		return this.currentLocalDate;

	}


}


rhit.ViewController = class {
	constructor() {
		this.timeZoneManager = new rhit.TimezoneManager();
		
        //TODO add more view control code here

        document.getElementById("west").onclick = (event) => {
            this.timeZoneManager.zoneIndex--;
            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }
        document.getElementById("home").onclick = (event) => {
            this.timeZoneManager.zoneIndex = 7;
            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }
        document.getElementById("east").onclick = (event) => {
            this.timeZoneManager.zoneIndex++;
            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }

        const wButton = document.getElementById("weekButton")
        wButton.onclick = (event) => {
            this.timeZoneManager.weekday = !this.timeZoneManager.weekday;
            if (!this.timeZoneManager.weekday || !this.timeZoneManager.minute) wButton.style.background = "grey";
                else wButton.style.background = "green";

            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }
        const sButton = document.getElementById("sButton")
        sButton.onclick = (event) => {
            this.timeZoneManager.second = !this.timeZoneManager.second;
            if (!this.timeZoneManager.second || !this.timeZoneManager.minute) sButton.style.background = "grey";
                else sButton.style.background = "green";

            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }

        const mButton = document.getElementById("mButton")
        mButton.onclick = (event) => {
            this.timeZoneManager.minute = !this.timeZoneManager.minute;
            if (this.timeZoneManager.minute) mButton.style.background = "green"; 
                else mButton.style.background = "grey";

            if (!this.timeZoneManager.second || !this.timeZoneManager.minute) sButton.style.background = "grey";
                else sButton.style.background = "green";

            //console.log(this.timeZoneManager.zoneIndex);
            this.updateView();
        }

		this.updateView();
	}

	updateView() {
		//TODO update view not just print to the console
		console.log(  this.timeZoneManager.getCurrentLocationString() );
		console.log(  this.timeZoneManager.getCurrentDateString() );

        document.getElementById("time").innerText = this.timeZoneManager.getCurrentLocationString();
        document.getElementById("number").innerText = this.timeZoneManager.getCurrentDateString();

		
	}
}




/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	viewController = new rhit.ViewController();
};

rhit.main();
