/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};


// globals
rhit.FB_COLLECTION_PICS = "Pic";
rhit.FB_KEY_CAPTION = "caption";
rhit.FB_KEY_URL = "imageUrl";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbPicsManager = null;

// functions
function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

// classes
rhit.ListPageController = class {
	constructor() {
		document.querySelector("#submitAddPic").onclick = (event) => {

			const pic = document.querySelector("#inputURL").value;
			const caption = document.querySelector("#inputCaption").value;
			// console.log(quote);
			// console.log(movie);
			rhit.fbPicsManager.add(pic, caption);
		}

		$("#addPicDialog").on("show.bs.modal", (event) => {
			const pic = document.querySelector("#inputURL").value = "";
			const caption = document.querySelector("#inputCaption").value = "";
		})
		$("#addPicDialog").on("shown.bs.modal", (event) => {
			document.querySelector("#inputURL").focus();
		})

		//start listening
		rhit.fbPicsManager.beginListening(this.updateList.bind(this));
	}

	_createCard(Pic) {
		return htmlToElement(`<div class="pin" id="">
		<img src="${Pic.pic}" alt="${Pic.caption}">
		<p class="caption">${Pic.caption}</p>
	  </div>`);
	}

	updateList() {
		console.log("update list");
		console.log(rhit.fbPicsManager.length);

		const newList = htmlToElement('<div id="columns"></div>');

		for (let i = 0; i < rhit.fbPicsManager.length; i++) {
			const pc = rhit.fbPicsManager.getPicAtIndex(i);
			const newCard = this._createCard(pc);

			newCard.onclick = (event) => {
				console.log(`You clicked on ${pc.id}`);
				//rhit.storage.setMovieQuoteId(mq.id);

				//TODO: finish
				window.location.href = `/pic.html?id=${pc.id}`;

			};


			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#columns");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);

	}
}

rhit.Pic = class {
	constructor(id, pic, caption) {
		this.id = id;
		this.pic = pic;
		this.caption = caption;
	}
}

rhit.FbPicsManager = class {
	constructor() {
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PICS);
		this._unsubscribe;
	}
	add(pic, caption) {
		// console.log(quote);
		// console.log(movie);

		this._ref.add({
			[rhit.FB_KEY_URL]: pic,
			[rhit.FB_KEY_CAPTION]: caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			})
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref
			.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc")
			.onSnapshot((querySnapshot) => {
				console.log("Pics Update");
				this._documentSnapshots = querySnapshot.docs;
				// querySnapshot.forEach((doc) => {
				// 	console.log(doc.data());
				// });
				if (changeListener) {
					changeListener();
				}
			});
	}
	stopListening() {
		this._unsubscribe();
	}

	update(id, quote, movie) { }
	delete(id) { }

	get length() {
		return this._documentSnapshots.length;
	}

	getPicAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const pc = new rhit.Pic(docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_URL),
			docSnapshot.get(rhit.FB_KEY_CAPTION));
		return pc;
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#listPage")) {
		console.log("list page");
		rhit.fbPicsManager = new rhit.FbPicsManager();
		new rhit.ListPageController();

	}




};

rhit.main();
