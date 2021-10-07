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
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;


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
	constructor() {
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
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function(error) {
				console.error("Error adding document: ", error);
			})
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref
		.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc")
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


/* Main */
/** function and class syntax examples */
rhit.main = function () {

	if (document.querySelector("#listPage")) {
		console.log("list page");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManager();
		new rhit.ListPageController();
		
	}

	if (document.querySelector("#detailPage")) {
		console.log("detail page");
	}

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
