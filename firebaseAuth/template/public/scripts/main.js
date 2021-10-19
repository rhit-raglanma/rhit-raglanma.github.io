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
rhit.variableName = "";

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.ClassName = class {
	constructor() {

	}

	methodName() {

	}
}

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			const phoneNumber = user.phoneNumber;
			const email = user.email;
			const displayName = user.displayName;
			const isAnonymous = user.isAnonymous;
			const photoURL = user.photoURL;


			console.log("user is signed in", uid);
			console.log(displayName);
			console.log(email);
			console.log(photoURL);
			console.log(phoneNumber);
			console.log(isAnonymous);

			// ...
		} else {
			console.log("no user signed in");
			// User is signed out
			// ...
		}
	});

	const inputEmailEl = document.querySelector("#inputEmail");
	const inputPasswordEl = document.querySelector("#inputPassword");

	document.querySelector("#signOutButton").onclick = (event) => {
		//console.log("sign out");

		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log("you are signed out")
		}).catch((error) => {
			console.log("sign out error")
			// An error happened.
		});
	}

	document.querySelector("#createAccountButton").onclick = (event) => {
		console.log(`${inputEmailEl.value}, ${inputPasswordEl.value}`);

		firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then((userCredential) => {
				// Signed in 
				var user = userCredential.user;

				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("error", errorCode, errorMessage);
				// ..
			});
	}

	document.querySelector("#loginButton").onclick = (event) => {
		console.log(`${inputEmailEl.value}, ${inputPasswordEl.value}`);

		firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value)
			.then((userCredential) => {
				// Signed in
				var user = userCredential.user;
				// ...
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("error", errorCode, errorMessage);
			});
	}

	document.querySelector("#anonymousAuth").onclick = (event) => {
		firebase.auth().signInAnonymously()
			.then(() => {
				// Signed in..
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("error", errorCode, errorMessage);
				// ...
			});
	}

	rhit.startFirebaseUI();

};

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
		signInSuccessUrl: '/',
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

rhit.main();
