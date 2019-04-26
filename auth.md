# Authentication
This project uses a simple username and password to authenticate. On sign up, a new user is created in Firebase and that user's UID is added to the users node. Email is a unique property of a user, and password must be at least 6 characters long. Errors print to the console. 

# auth

## Properties
```
auth = {
    uid: "HKMS6qUbN4d7EWmRcrKzLotCJBt1"
}
```

uid is the unique user id that resides in Firebase.

## Methods

### signUp

Inputs
```
email, password
```
This method uses the 
```
auth().createUserWithEmailAndPassword(email, password)
```
method to create a new user in Firebase and 
```
database.ref("users/" + uid + "/").set(obj)
```
to update the user node when a response is received.

### signIn

Inputs
```
email, password
```
This method uses the 
```
auth().signInWithEmailAndPassword(email, password)
```
method to sign a user into Firebase. When a user is signed in, 
```
auth().onAuthStateChanged()
```
is used to identify the user's state.