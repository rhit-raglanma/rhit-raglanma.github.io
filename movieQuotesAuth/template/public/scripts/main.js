/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * PUT_YOUR_NAME_HERE
 */

/** namespace. */
var rhit = rhit || {};

/** globals */
rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_AUTHOR = "author";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;
rhit.FbAuthManager = null;

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor() {

		document.querySelector("#menuShowAllQuotes").addEventListener("click", (event) => {
			console.log("all");

			window.location.href="/list.html";
		});

		document.querySelector("#menuShowMyQuotes").addEventListener("click", (event) => {
			console.log("my");

			window.location.href = `/list.html?uid=${rhit.FbAuthManager.uid}`;
		});

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.FbAuthManager.signOut();
		});


		document.querySelector("#submitAddQuote").onclick = (event) => {

			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			// console.log(quote);
			// console.log(movie);
			rhit.fbMovieQuotesManager.add(quote, movie);
		}

		$("#addQuoteDialog").on("show.bs.modal", (event) => {
			const quote = document.querySelector("#inputQuote").value = "";
			const movie = document.querySelector("#inputMovie").value = "";
		})
		$("#addQuoteDialog").on("shown.bs.modal", (event) => {
			document.querySelector("#inputQuote").focus();
		})

		//start listening
		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));
	}

	_createCard(movieQuote) {
		return htmlToElement(`<div class="card">
        <div class="card-body">
          <h5 class="card-title">${movieQuote.quote}</h5>
          <p class="card-text">${movieQuote.movie}</p>
        </div>
      </div>`);
	}

	updateList() {
		console.log("update list");
		console.log(rhit.fbMovieQuotesManager.length);

		const newList = htmlToElement('<div id="quoteListContainer"></div>');

		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++) {
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);

			newCard.onclick = (event) => {
				console.log(`You clicked on ${mq.id}`);
				//rhit.storage.setMovieQuoteId(mq.id);


				window.location.href = `/moviequote.html?id=${mq.id}`;

			};


			newList.appendChild(newCard);
		}

		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;

		oldList.parentElement.appendChild(newList);

	}
}

rhit.MovieQuote = class {
	constructor(id, quote, movie) {
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManager = class {
	constructor(uid) {
		this._uid = uid;
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE);
		this._unsubscribe;
	}
	add(quote, movie) {
		// console.log(quote);
		// console.log(movie);

		this._ref.add({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_AUTHOR]: rhit.FbAuthManager.uid,
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
	let query = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50);
		if (this._uid) {
			query = query.where(rhit.FB_KEY_AUTHOR, "==", this._uid);
		}
		this._unsubscribe = query
			.onSnapshot((querySnapshot) => {
				console.log("MovieQuote update");
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
	getMovieQuoteAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE));
		return mq;
	}
}


rhit.DetailPageController = class {
	constructor() {
		console.log("detail");

		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.FbAuthManager.signOut();
		});

		document.querySelector("#submitEditQuote").onclick = (event) => {

			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			// console.log(quote);
			// console.log(movie);
			rhit.fbSingleQuoteManager.update(quote, movie);
		}

		$("#editQuoteDialog").on("show.bs.modal", (event) => {
			const quote = document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			const movie = document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;
		})
		$("#editQuoteDialog").on("shown.bs.modal", (event) => {
			document.querySelector("#inputQuote").focus();
		})



		document.querySelector("#submitDeleteQuote").onclick = (event) => {


			rhit.fbSingleQuoteManager.delete().then(function () {
				console.log("deleted");
				window.location.href = "/list.html";
			}).catch(function (error) {
				console.log("error deleting document");
			});
		}


		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));




	}
	updateView() {
		console.log("update view");
		document.querySelector(".card-title").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector(".card-text").innerHTML = rhit.fbSingleQuoteManager.movie;

		if (rhit.fbSingleQuoteManager.author == rhit.FbAuthManager.uid) {
			document.querySelector("#menuEdit").style.display = "flex";
			document.querySelector("#menuDelete").style.display = "flex";
		}
	}
}


rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
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
	update(quote, movie) {

		this._ref.update({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			})

	}

	get quote() {
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}

	get movie() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}

	delete() {

		return this._ref.delete();
		// .then(function() {

		// }).catch(function (error) {
		// 	console.log("error deleting document");
		// });

	}
}




// rhit.storage = rhit.storage || {};
// rhit.storage.MOVIEQUOTE_ID_KEY = "movieQuoteId";

// rhit.storage.getMovieQuoteId = function () {
// 	const mqId = sessionStorage.getItem(rhit.storage.MOVIEQUOTE_ID_KEY);
// 	if (!mqId) {
// 		console.log("No movie quote id in sessionStorage");
// 	}
// 	return mqId;
// };

// rhit.storage.setMovieQuoteId = function (movieQuoteId) {
// 	sessionStorage.setItem(rhit.storage.MOVIEQUOTE_ID_KEY, movieQuoteId);
// };

/* Main */
/** function and class syntax examples */

rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.FbAuthManager.signIn();
		}
	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		console.log("you made the auth manager");
	}
	beginListening(changeListener) {

		firebase.auth().onAuthStateChanged((user) => {
			// if (user) {
			// 	// User is signed in, see docs for a list of available properties
			// 	// https://firebase.google.com/docs/reference/js/firebase.User
			// 	this._user = user;
			// 	changeListener();
			// 	//console.log("user is signed in", this._user.uid);

			// 	// ...
			// } else {
			// 	console.log("no user signed in");
			// 	// User is signed out
			// 	// ...
			// }

			this._user = user;
			changeListener();
		});

	}
	signIn() {

		// Please note this needs to be the result of a user interaction
		// (like a button click) otherwise it will get blocked as a popup
		Rosefire.signIn("01e3b1d8-21b0-470b-bce5-6480db25dd50", (err, rfUser) => {
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

rhit.initializePage = function () {
	if (document.querySelector("#listPage")) {
		console.log("list page");

		const urlParams = new URLSearchParams(window.location.search);
		const uid = urlParams.get("uid");

		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager(uid);
		new rhit.ListPageController();

	}

	if (document.querySelector("#detailPage")) {
		console.log("detail page");
		//const movieQuoteId = rhit.storage.getMovieQuoteId();

		const queryString = window.location.search;

		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");


		console.log(`Detail page for ${movieQuoteId}`);

		if (!movieQuoteId) {
			console.log("error");
			window.location.href = "/";
		}

		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();

	}

	if (document.querySelector("#loginPage")) {
		console.log("login page");

		new rhit.LoginPageController();

	}
}


rhit.main = function () {

	rhit.FbAuthManager = new rhit.FbAuthManager();
	rhit.FbAuthManager.beginListening(() => {
		console.log("auth change callback fired");

		rhit.checkForRedirects();
		rhit.initializePage();

	});



	// const ref = firebase.firestore().collection("MovieQuotes");
	// ref.onSnapshot((querySnapshot) => {

	// 	querySnapshot.forEach((doc) => {
	// 		console.log(doc.data());
	// 	});


	//     // console.log("Current data: ", doc.data());
	// });

	// ref.add({
	// 	quote: "My first test",
	// 	movie: "My first movie",
	// 	lastTouched: firebase.firestore.Timestamp.now(),
	// });

};

rhit.main();
