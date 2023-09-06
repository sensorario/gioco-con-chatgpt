const myObject = {
    counter: 0,
    incrementCounter: function() {
      if (this.isGameFinished) return; // Esci se il gioco è finito
      this.counter++;
    },
    interval: 100, // Imposta l'intervallo a 100 millisecondi
    players: [
      {
        nome: "Frodo",
        energia: 0,
        building: [],
        waitUntil: 0
      },
      {
        nome: "Aragorn",
        energia: 0,
        building: [],
        waitUntil: 0
      }
    ],
    threshold: 3,
    isGameFinished: false,
    checkCounter: function() {
      if (this.isGameFinished) return; // Esci se il gioco è finito
      if (this.counter % this.threshold === 0) {
        this.players.forEach(function(player) {
          if (myObject.isGameFinished) return; // Esci se il gioco è finito
          player.energia += 1;
          console.log(`${player.nome}: Nuovo valore dell'energia: ${player.energia}`);
        });
      }
    },
    buildings: [
      {
        nome: "Casa",
        energia: 8
      },
      {
        nome: "Torre",
        energia: 7
      }
    ],
    funzioneVuota: function() {
      if (this.isGameFinished) return; // Esci se il gioco è finito
      this.players.forEach(function(player) {
        if (myObject.isGameFinished) return; // Esci se il gioco è finito
        if (player.waitUntil < myObject.counter) {
          const edificiNonOttenuti = myObject.buildings.filter(function(edificio) {
            return !player.building.some(function(building) {
              return building.nome === edificio.nome;
            });
          });
  
          if (edificiNonOttenuti.length > 0) {
            // Scegli un edificio tra quelli non ancora ottenuti
            const edificioCasuale = edificiNonOttenuti[Math.floor(Math.random() * edificiNonOttenuti.length)];
            console.log(`${player.nome}: Risultato: testa (poiché waitUntil è inferiore a counter)`);
  
            // Scegli un edificio tra quelli non ancora ottenuti
            console.log(`${player.nome}: Ha ottenuto "${edificioCasuale.nome}" con energia ${edificioCasuale.energia}`);
  
            if (player.energia > edificioCasuale.energia) {
              // Aggiungi l'edificio all'array del giocatore solo se ha più energia
              player.building.push(edificioCasuale);
              console.log(`${player.nome}: Ha ottenuto l'edificio "${edificioCasuale.nome}"`);
  
              // Sottrai l'energia del giocatore con il valore dell'edificio
              player.energia -= edificioCasuale.energia;
              console.log(`${player.nome}: Energia rimanente: ${player.energia}`);
  
              // Imposta waitUntil con il valore del contatore più l'energia dell'edificio
              player.waitUntil = myObject.counter + edificioCasuale.energia;
              console.log(`${player.nome}: waitUntil impostato a ${player.waitUntil}`);
            } else {
              console.log(`${player.nome}: Non ha abbastanza energia per ottenere l'edificio "${edificioCasuale.nome}"`);
            }
          } else {
            console.log(`${player.nome}: Ha ottenuto tutti gli edifici disponibili.`);
          }
        }
      });
    },
  
    verificaVittoria: function() {
      if (this.isGameFinished) return; // Esci se il gioco è finito
      this.players.forEach(function(player) {
        if (myObject.isGameFinished) return; // Esci se il gioco è finito
        if (player.building.length === myObject.buildings.length && player.waitUntil < myObject.counter) {
          console.log(`${player.nome} ha vinto! Ha ottenuto tutti gli edifici disponibili.`);
          myObject.isGameFinished = true;
        }
      });
    }
  };
  
  setInterval(function() {
    myObject.incrementCounter();
    myObject.checkCounter();
    myObject.funzioneVuota();
    myObject.verificaVittoria();
  
    if (myObject.isGameFinished) {
      clearInterval(this);
      console.log("Il gioco è finito!");
    }
  }, myObject.interval);
  