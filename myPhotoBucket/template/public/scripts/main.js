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
rhit.fbSinglePicManager = null;
rhit.FbAuthManager = null;

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

	update(id, pic, caption) { }
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



rhit.DetailPageController = class {
	constructor() {
		console.log("detail");



		document.querySelector("#submitEditURL").onclick = (event) => {

			const url = document.querySelector("#inputUrl").value;
			const caption = document.querySelector("#inputCaption").value;
			
			rhit.fbSinglePicManager.update(url, caption);
		}

		$("#editUrlDialog").on("show.bs.modal", (event) => {
			document.querySelector("#inputUrl").value = rhit.fbSinglePicManager.pic;
			document.querySelector("#inputCaption").value = rhit.fbSinglePicManager.caption;
		})
		$("#editUrlDialog").on("shown.bs.modal", (event) => {
			document.querySelector("#inputUrl").focus();
		})



		document.querySelector("#submitDeleteUrl").onclick = (event) => {


			rhit.fbSinglePicManager.delete().then(function () {
				console.log("deleted");
				window.location.href = "/";
			}).catch(function (error) {
				console.log("error deleting document");
			});
		}


		rhit.fbSinglePicManager.beginListening(this.updateView.bind(this));




	}
	updateView() {
		console.log("update view");
		// document.querySelector(".detail-image").innerHTML = rhit.fbSinglePicManager.pic;
		// document.querySelector(".caption").innerHTML = rhit.fbSinglePicManager.caption;
		document.querySelector(".pin").innerHTML = `<img src="${rhit.fbSinglePicManager.pic}" alt="${rhit.fbSinglePicManager.caption} class=".img-fluid">
		<p class="caption">${rhit.fbSinglePicManager.caption}</p>`;
	}
}


rhit.FbSinglePicManager = class {
	constructor(PicId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_PICS).doc(PicId);
		console.log("listening");
	}
	beginListening(changeListener) {

		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("no such doc");
			}
		})






	}
	stopListening() {
		this._unsubscribe();
	}
	update(url, caption) {

		this._ref.update({
			[rhit.FB_KEY_URL]: url,
			[rhit.FB_KEY_CAPTION]: caption,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
			.then(function (docRef) {
				//console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				//console.error("Error adding document: ", error);
			})

	}

	get pic() {
		return this._documentSnapshot.get(rhit.FB_KEY_URL);
	}

	get caption() {
		return this._documentSnapshot.get(rhit.FB_KEY_CAPTION);
	}

	delete() {

		return this._ref.delete();
		// .then(function() {

		// }).catch(function (error) {
		// 	console.log("error deleting document");
		// });

	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}
	beginListening(changeListener) {

		firebase.auth().onAuthStateChanged((user) => {

			this._user = user;
			if (user) {
				console.log(user, " is signed in");
			} else {
				console.log("no user signed in");
			}
			changeListener();
		});


	}
	signIn() {

		// Please note this needs to be the result of a user interaction
		// (like a button click) otherwise it will get blocked as a popup
		Rosefire.signIn("a0312fcd-868b-49d0-8fe3-6ccb8ba91f7b", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);

			// TODO: Use the rfUser.token with your server.

			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				if (error.code === 'auth/invalid-custom-token') {
					console.log("The token you provided is not valid.");
				} else {
					console.log("signInWithCustomToken error", error.message);
				}
			}); // Note: Success should be handled by an onAuthStateChanged listener.

		});
	}
	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}
	get isSignedIn() {
		return !!this._user;
	}
	get uid() {
		return this._user.uid;
	}


}

rhit.startFirebaseUI = function() {
	var uiConfig = {
		callbacks: {
			signInSuccessWithAuthResult: function (authResult, redirectUrl) {
				// User successfully signed in.
				// Return type determines whether we continue the redirect automatically
				// or whether we leave that to developer to handle.
				
				return true;
			},
			uiShown: function () {
				// The widget is rendered.
				// Hide the loader.
				//document.getElementById('loader').style.display = 'none';
			}
		},
		// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
		signInFlow: 'popup',
		signInSuccessUrl: '/list.html',
		signInOptions: [
			// Leave the lines as is for the providers you want to offer your users.
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.EmailAuthProvider.PROVIDER_ID,
			firebase.auth.PhoneAuthProvider.PROVIDER_ID,
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		],
		// Terms of service url.
		tosUrl: '<your-tos-url>',
		// Privacy policy url.
		privacyPolicyUrl: '<your-privacy-policy-url>'

		
	};

	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	ui.start('#firebaseui-auth-container', uiConfig);
}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.FbAuthManager.isSignedIn) {
		window.location.href = "/list.html";
	}

	// console.log(!document.querySelector("#loginPage"));
	// console.log("runs");

	if (!document.querySelector("#loginPage") && !rhit.FbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
}




/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	rhit.FbAuthManager = new rhit.FbAuthManager();
	rhit.FbAuthManager.beginListening(() => {
		rhit.checkForRedirects();
	});

	if (document.querySelector("#listPage")) {
		console.log("list page");
		rhit.fbPicsManager = new rhit.FbPicsManager();
		new rhit.ListPageController();

	}

	if (document.querySelector("#detailPage")) {
		console.log("detail page");
		//const movieQuoteId = rhit.storage.getMovieQuoteId();

		const queryString = window.location.search;

		const urlParams = new URLSearchParams(queryString);
		const PicId = urlParams.get("id");


		console.log(`Detail page for ${PicId}`);

		if (!PicId) {
			console.log("error");
			window.location.href = "/list.html";
		}

		rhit.fbSinglePicManager = new rhit.FbSinglePicManager(PicId);
		new rhit.DetailPageController();


	}

	if (document.querySelector("#loginPage")) {

		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.FbAuthManager.signIn();
		}
		rhit.startFirebaseUI();
	}

	

};

rhit.main();
