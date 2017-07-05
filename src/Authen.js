import React, { Component } from 'react';


//SET UP FIREBASE
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDfJmyaxtIIJ_JCK9OzXI8poZ9mcF0OMbQ",
    authDomain: "fir-login-892b7.firebaseapp.com",
    databaseURL: "https://fir-login-892b7.firebaseio.com",
    projectId: "fir-login-892b7",
    storageBucket: "fir-login-892b7.appspot.com",
    messagingSenderId: "820811260718"
  };
  firebase.initializeApp(config);

class Authen extends Component {


  login(event){
    //Get value by this.ref.whatref.thevalueofit
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    console.log(email+" and " +password);

    //Send query to firebase with a promise
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    //TODO: handle login promise
    promise
    .then(user => {
      var logout = document.getElementById('logout');
      logout.classList.remove('hide');

      var err = "Welcome " + user.email;
      this.setState({err: err});
    })

    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    });
  }

  signup(event){
    //Get email and password and create new user
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password);

    promise
    .then(user => {
      var err = "Welcome" + user.email;
      //Creates new user in firebase using
      firebase.database().ref('users/' + user.uid).set({
        email: user.email
      });
      console.log(user);
      this.setState({err: err});
    })
    .catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err:err});
    });

  }

  logout(){
    firebase.auth().signOut();
    var logout = document.getElementById('logout');
    logout.classList.add('hide');

    var err = "Thanks for using this app ";
    this.setState({err: err});
  }

  google(){
    var provider = new firebase.auth.GoogleAuthProvider();
    var promise = firebase.auth().signInWithRedirect(provider);

    promise
    .then(result => {
      var user = result.user;
      var logout = document.getElementById('logout');
      logout.classList.remove('hide');
      console.log(result);
      firebase.database().ref('users/' + user.uid).set({
        email: user.email,
        name: user.displayName
      });
      var err = "Welcome " + user.email;
      this.setState({err: err});

    })
    .catch (e => {
      var msg = e.message;
      console.log(msg);
    });

  }

  constructor(props){
    super(props);

    this.state={
      err: ''
    };
    //BIND METHODS
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
  }



  render(){
    return(
      <div>
       <input id="email" ref="email" type="email" placeholder="Enter your email" /><br />
       <input id="pass" ref="password" type="password" placeholder="Enter your password" /><br />
       <h2>{this.state.err}</h2>

       <button onClick={this.login}>Log In</button>
       <button onClick={this.signup}>Sign Up</button>
       <button onClick={this.logout} id="logout" className="hide">Log Out</button><br />
       <button onClick={this.google} id="google" className="google">Sign In with Google</button>
      </div>
    );
  }
}

export default Authen;
