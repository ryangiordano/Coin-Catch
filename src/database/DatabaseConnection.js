import Firebase from 'firebase';
// import * as admin from 'firebase-admin';
export default class {
    constructor(gameId, gameSessionId) {
      this.gameId = gameId;
      this.gameSessionId = gameSessionId;
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
    writeHighScore(name, score) {
        this.connection.ref(`games/${this.gameId}/${this.gameSessionId}`).set({
            name: name,
            score: score
        });
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
