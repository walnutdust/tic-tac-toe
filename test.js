//displayController module
const displayController = (() => {

  //display screen elements
  let selectionContainer = document.createElement('div');
  let welcomeMessage = document.createElement('p');
  let twoPlayer = document.createElement('button');
  let easyComputer = document.createElement('button');
  let hardComputer = document.createElement('button');
  let buttonContainer = document.createElement('table');

  welcomeMessage.id = "welcome-message";
  welcomeMessage.innerHTML = "Welcome to Tic-Tac-Toe! \n Select your mode:";
  easyComputer.id = "easy-computer";
  easyComputer.innerHTML = "Easy Computer";
  easyComputer.addEventListener('click',function (e){
    displayName(1);
    name2input.value = "Computer (Easy)";
    gameBoard.setMode(1);
  })
  hardComputer.id = "hard-computer";
  hardComputer.innerHTML = "Hard Computer";
  hardComputer.addEventListener('click',function (e){
    displayName(1);
    name2input.value = "Computer (Hard)";
    gameBoard.setMode(2);
  })
  twoPlayer.id = "two-player";
  twoPlayer.innerHTML = "Two Player";
  twoPlayer.addEventListener('click',function (e){
    displayName(2);
    name2input.value = "Player 2";
    gameBoard.setMode(0);
  })
  selectionContainer.id = "selection-container";
  buttonContainer.id = "button-container";

  buttonContainer.append(easyComputer, hardComputer, twoPlayer);

  selectionContainer.append(welcomeMessage, buttonContainer);

  //name screen elements
  let nameContainer = document.createElement('div');
  let nameMessage = document.createElement('p');
  let name1input = document.createElement('input');
  let name2input = document.createElement('input');
  let startGame = document.createElement('button');
  startGame.addEventListener('click',function (e){
    if(name1input.value == "") name1input.value = "Player 1";
    if(name2input.value == "") name2input.value = "Player 2";
    gameBoard.addPlayers(playerFactory(name1input.value), playerFactory(name2input.value));
    displayGame();
  })

  name1input.value = "Player 1";
  name2input.value = "Player 2";
  nameContainer.id = "name-container";
  nameMessage.innerHTML = "Input your Names:";
  startGame.innerHTML = "Start Game";

  nameContainer.append(nameMessage, name1input, name2input, startGame);
  nameContainer.style.display = 'none';

  document.body.appendChild(nameContainer);

  //game board elements
  let gameScreen = document.createElement('div');
  let screenText = document.createElement('p');
  let screenC = document.createElement('div');
  let gameBody = document.createElement('div');
  let resetBoard = document.createElement('button');
  let resetGame = document.createElement('button');

  screenText.id = "screen-text";
  screenC.id = "screen";
  gameBody.id = "game-body";
  resetBoard.id = "reset-board";
  resetGame.id = "reset-game";
  resetBoard.innerHTML = "RESET BOARD";
  resetBoard.addEventListener('click',function (e){
    gameBoard.reset();
  })
  resetGame.innerHTML = "PLAY GAME WITH DIFFERENT SETTINGS";
  resetGame.addEventListener('click',function (e){
    gameBoard.reset();
    name1input.value = "Player 1";
    displaySelection();
  })

  gameScreen.style.display = 'none';

  screenC.appendChild(screenText);
  document.body.appendChild(selectionContainer);

  gameScreen.append(screenC, gameBody, resetBoard, resetGame);
  document.body.appendChild(gameScreen);

  const displaySelection = () =>{
    selectionContainer.style.display = '';
    nameContainer.style.display = 'none';
    gameScreen.style.display = 'none';
  };

  const displayGame = () =>{
    selectionContainer.style.display = 'none';
    nameContainer.style.display = 'none';
    gameScreen.style.display = '';
  };

  const displayName = (numPlayers) =>{
    nameContainer.style.display = '';
    if(numPlayers == 1) {
      nameMessage.innerHTML = "Input your Name:";
      name2input.style.display = 'none';
    }
    else{
      nameMessage.innerHTML = "Input your Names:";
      name2input.style.display = '';
    }
    selectionContainer.style.display = 'none';
    gameScreen.style.display = 'none';
  }

})();


//gameBoard module
const gameBoard =  (() => {
  const container = document.querySelector('#game-body');
  const screenText = document.querySelector('#screen-text');

  let victory = false;
  let playerOneTurn = true;
  let mode = 0;
  let squaresLeft = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let player1 = {};
  let player2 = {};
  let buttons = [["","",""],["","",""],["","",""]];
  let move = 0;

  for(let i = 0; i<3;i++){
    for(let j = 0; j<3;j++){
      let content = document.createElement('button');
      content.classList.add('play-button');
      content.classList.add('row' + i);
      content.classList.add('col' + j);
      content.innerHTML = "";
      content.addEventListener('click',function (e){
        if(e.target.innerHTML=="" && !victory){
          squaresLeft.splice(squaresLeft.indexOf(i*3+j),1);
          if (playerOneTurn) {
            e.target.innerHTML = "o";
            generateCheckVictory(buttons);

            if(!victory && squaresLeft.length > 0){
              if(mode == 0) screenText.innerHTML = player2.name + "'s turn!";
              else if (mode == 1) easyMove();
              else hardMove();
              if(mode !=0 )playerOneTurn = !playerOneTurn;
            }
          }
          else {
            e.target.innerHTML = "x";
            screenText.innerHTML = player1.name + "'s turn!";
            generateCheckVictory(buttons);
          }

          if(victory){
            if(playerOneTurn) screenText.innerHTML = player1.name + " won!";
            else screenText.innerHTML = player2.name + " won!";
          }
          else if (squaresLeft.length == 0) screenText.innerHTML = "The game is tied!";

          playerOneTurn = !playerOneTurn;
        }
      })
      buttons[i][j] = content;
      container.appendChild(content);
    }
  }

  const reset = () => {
    victory = false;
    playerOneTurn = true;
    squaresLeft = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for(let i = 0; i<3; i++){
      for(let j = 0; j<3; j++){
        buttons[i][j].innerHTML = "";
        buttons[i][j].style.color = 'black';
      }
    }

    screenText.innerHTML = player1.name + "'s turn!";
  }

  const addPlayers = (play1, play2) =>{
    player1 = play1;
    player2 = play2;
    screenText.innerHTML = player1.name + "'s turn!";
  }

  const addPlayer = (play1) =>{
    player1 = play1;
    screenText.innerHTML = player1.name + "'s turn!";
  }

  const easyMove = () =>{
    let dummy = Math.floor(Math.random()*squaresLeft.length);
    buttons[Math.floor(squaresLeft[dummy]/3)][squaresLeft[dummy]%3].innerHTML = "x";
    squaresLeft.splice(dummy,1);
    generateCheckVictory(buttons);
      }

  const hardMove = () =>{
    let dumb = buttons;
    minimax(dumb, squaresLeft, 0, false);
    buttons[Math.floor(move/3)][move%3].innerHTML= "x";
    squaresLeft.splice(squaresLeft.indexOf(move), 1);
    for(let i = 0; i<3;i++){
      for(let j = 0; j<3; j++){
        buttons[i][j].style.color = 'black';
      }
    }

    generateCheckVictory(buttons);

  }

  const setMode = (modeChoice) => {
    mode = modeChoice;
  }

  const generateCheckVictory = (buttonsI) => {
    checkVictory(buttonsI[0][0], buttonsI[0][1],buttonsI[0][2]);
    checkVictory(buttonsI[1][0], buttonsI[1][1],buttonsI[1][2]);
    checkVictory(buttonsI[2][0], buttonsI[2][1],buttonsI[2][2]);
    checkVictory(buttonsI[0][0], buttonsI[1][0],buttonsI[2][0]);
    checkVictory(buttonsI[0][1], buttonsI[1][1],buttonsI[2][1]);
    checkVictory(buttonsI[0][2], buttonsI[1][2],buttonsI[2][2]);
    checkVictory(buttonsI[0][0], buttonsI[1][1],buttonsI[2][2]);
    checkVictory(buttonsI[0][2], buttonsI[1][1],buttonsI[2][0]);
  };

  const checkVictory = (box1, box2, box3) =>{
    if(box1.innerHTML == box2.innerHTML &&
      box2.innerHTML == box3.innerHTML && box3.innerHTML != ""){
        victory = true;
        box1.style.color = 'red';
        box2.style.color = 'red';
        box3.style.color = 'red';
      }
  };


  const score = (depth, win, turn) =>{
    if (win && turn) return (10 - depth);
    else if (win&& !turn) return (depth - 10);
    else return 0;
  }

  const minimax = (buttonsInput, currState, depth, turn) => {

    let scores = [];
    let dummy = new Array(currState.length);
    let index = -1;

    turn = !turn;
    depth ++;

    for(let i = 0; i < currState.length; i++){
      dummy[i] = currState[i];
    }

    generateCheckVictory(buttonsInput);


    if(currState.length == 0 || victory) {
      turn = !turn;
      let finalScore = score(depth, victory, turn);
      victory = false;

      return finalScore;
    }


    for(let i = 0; i<currState.length; i++){
      if(!turn) buttonsInput[Math.floor(dummy[i]/3)][dummy[i]%3].innerHTML= "o";
      else buttonsInput[Math.floor(dummy[i]/3)][dummy[i]%3].innerHTML = "x";
      dummy.splice(i,1);
      scores.push(minimax(buttonsInput, dummy, depth, turn));
      buttonsInput[Math.floor(currState[i]/3)][currState[i]%3].innerHTML = "";
      dummy.splice(i,0,currState[i]);
    }

    if(depth % 2 != 0) index = scores.indexOf(Math.max.apply(null, scores));
    else index = scores.indexOf(Math.min.apply(null, scores));

    move = currState[index];
    return scores[index];
  }

  return {addPlayers, reset, setMode};
})();



const playerFactory = (name) => {
  return {name};
};
