
# [UpShift](https://expo.dev/@mrchrish/UpShift)

[UpShift](https://expo.dev/@mrchrish/UpShift) is a group project social media app designed for the use by motorcyclists. The app allows for users to find other riders within your local area and plan trips. Features of the app include: 
  - Login/ Sign up Authentication
  - Upload photos
  - Create Routes
  - Save Routes
  - View Routes
  - Search for riders
  - Filter rider Search
  - View Rider Profiles
  - Send connection requests
  - Approve/Deny connection requests
  - Send/Receive realtime messages

Users can sign up or login to the app using Firebase Authentication when opening it. Upon logging in, the user is presented with their own profile. Using the profile navigation bar, routes can be created using the route creation screen. You can also view previously created routes from the profile screen. By navigating the rider finder, a list of users in the selected region is displayed to the user in a random order. The user can further filter the list by gender and age range. If other users accept, the user can then connect in real time using socket IO with Firebase Firestore for message history.      [Socket Server](https://github.com/MrChris-H/upshift-server)
## Video Demo
A video demonstration can be found [here](https://www.youtube.com/watch?v=XJKzN_o_oHw)
## Known Issues
 - The hosting link provided only works for android users
 - IOS users can run the following [build](https://www.dropbox.com/s/t2756by000amycn/UpShift.app.zip?dl=0) on Xcode 
 - Running locally will not allow for maps use due to missing api key
 - Search functionality on android
## Run Locally
### Requirements

node - v16.13.2\

### Cloning & Set-up

#### Clone the project

```bash
  git clone https://github.com/MrChris-H/UpShift.git
```

#### Go to the project directory

```bash
  cd UpShift
```

#### Install dependencies

```bash
  npm install
```

### Starting

#### Start React App

```bash
  npm run start
```


## Tech Stack

**App:** Node, React Native, Socket IO, Express, Google Maps API, Firebase, Expo

