import Firebase from 'firebase';
// import * as admin from 'firebase-admin';
export default class {
    constructor(gameId) {
      this.gameId = gameId;
      // Initialize Firebase
      var config = {
          apiKey: "AIzaSyCsuL_6nDpr4tqtwTQEGn3FEITRQh5Em-k",
          authDomain: "game-scores-74271.firebaseapp.com",
          databaseURL: "https://game-scores-74271.firebaseio.com",
          projectId: "game-scores-74271",
          storageBucket: "game-scores-74271.appspot.com",
          messagingSenderId: "327816537978"
      };
      Firebase.initializeApp(config);
      this.connection = Firebase.database();
    }
    writeHighScore(name, score, sessionId) {
      return new Promise((resolve,reject)=>{
        this.connection.ref(`games/${this.gameId}/${sessionId}`).set({
            name: name,
            score: score
        }, (err)=>{
            if(!err){
              resolve('Data successfully posted');
            }else{
              reject(err);
            }
        });
      })

    }
    getHighScores() {
        //get the top 10 or so high scores
        let ref = this.connection.ref(`games/${this.gameId}`);
        ref.once("value", (snapshot)=>{
          return snapshot.val()
        })
    }
    clearHighScores(){
      let ref = this.connection.ref(`games/${this.gameId}`);
      ref.remove();
    }
}
