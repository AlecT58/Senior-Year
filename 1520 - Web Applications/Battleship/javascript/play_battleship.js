function getPlayerName(whichPlayer) {
    let name = prompt("Enter your name, Player " + whichPlayer + ":");

    while (name == '') {
        name = prompt("Your name cannot be blank! \nRe-enter your name, Player " + whichPlayer + ":");
    }

    return name;
}

function getShipPlacementString() {
    let shipString = prompt("Enter your ship placement: ").replace(/[ )]/g, '').replace(/[(]/g, ':');

    while (!isShipStringValid(shipString)) {
        shipString = prompt("Your ship placement is invalid! \nRe-enter your ship placement: ").replace(/[ )]/g, '').replace(/[(]/g, ':');
    }

    return shipString;
}

function isShipStringValid(shipString) {
    const SHIP_PATTERN = /([ABS][:(][A-J]\d[-][A-J]\d\d?[;][ABS][:(][A-J]\d[-][A-J]\d\d?[;][ABS][:(][A-J]\d[-][A-J]\d\d?[;]?)$/i;
    let shipStringSplit = shipString.split(';');

    if (shipString == '' || !shipString.match(SHIP_PATTERN)) {
        return false;
    }

    for (var i = 0; i < 3; i++) {
        let shipType = shipStringSplit[i].substring(0, 1).toUpperCase();
        let startingRow = getArrayRow(shipStringSplit[i].substring(2, 3));
        let startingColumn = shipStringSplit[i].substring(3, 5).replace(/[-]/g, '');
        let endingRow = getArrayRow(shipStringSplit[i].substring(5, 6));
        let endingColumn = shipStringSplit[i].substring(6, 8).replace(/[-]/g, '');

        if ((startingRow != endingRow) && (startingColumn != endingColumn)) {
            return false;
        } else if ((startingRow > endingRow) || (startingColumn > endingColumn)) {
            return false;
        } else if (shipType === 'A' && !((startingRow - endingRow == -4) || (startingColumn - endingColumn == -4))) {
            return false;
        } else if (shipType === 'B' && !((startingRow - endingRow == -3) || (startingColumn - endingColumn == -3))) {
            return false;
        } else if (shipType === 'S' && !((startingRow - endingRow == -2) || (startingColumn - endingColumn == -2))) {
            return false;
        }
    }

    return true;
}

function getArrayRow(character) {
    let columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (var i = 0; i < columns.length; i++) {
        if (character.toUpperCase() === columns[i]) {
            return i;
        }
    }

    return 0;
}

function generatePlayerBoard(shipString) {
    let board = new Array(10);
    let shipStringSplit = shipString.split(';');

    for (var i = 0; i < 10; i++) {
        board[i] = new Array(10);

        for (var j = 0; j < 10; j++) {
            board[i][j] = "-";
        }
    }

    for (var i = 0; i < 3; i++) {
        let shipType = shipStringSplit[i].substring(0, 1).toUpperCase();
        let startingColumn = getArrayRow(shipStringSplit[i].substring(2, 3));
        let startingRow = shipStringSplit[i].substring(3, 5).replace(/[-]/g, '') - 1;
        let endingColumn = getArrayRow(shipStringSplit[i].substring(5, 6));
        let endingRow = shipStringSplit[i].substring(6, 8).replace(/[-]/g, '') - 1;

        for (var row = startingRow; row <= endingRow; row++) {
            for (var col = startingColumn; col <= endingColumn; col++) {
                board[row][col] = shipType;
            }
        }
    }

    return board;
}

function generateOpponentBoard() {
    let board = new Array(10);

    for (var i = 0; i < 10; i++) {
        board[i] = new Array(10);

        for (var j = 0; j < 10; j++) {
            board[i][j] = "-";
        }
    }

    return board;
}

function drawTopGrid(player) {
    const opponentBoard = player.opponentBoard;
    let topTable = document.getElementById('topGrid').getElementsByTagName('tbody')[0];

    for (var i = 0; i < 10; i++) {
        let newRow = topTable.insertRow(i);

        for (var j = 0; j < 11; j++) {
            let newCell = newRow.insertCell(j);

            if (j == 0) {
                newCell.innerText = i + 1;
                newCell.classList.add('board_labels');
            } else {
                newCell.addEventListener('click', cellClicked, false);
                newCell.classList.add('grid_pieces');
            }
        }
    }
}

function drawBottomGrid(player) {
    const playerBoard = player.playerBoard;
    let bottomTable = document.getElementById('bottomGrid').getElementsByTagName('tbody')[0];

    for (var i = 0; i < 10; i++) {
        let newRow = bottomTable.insertRow(i);

        for (var j = 0; j < 11; j++) {
            let newCell = newRow.insertCell(j);

            if (j == 0) {
                newCell.innerText = i + 1;
                newCell.classList.add('board_labels');
            } else {
                if (playerBoard[i][j - 1] === '-') {
                    newCell.classList.add('grid_pieces');
                } else if (playerBoard[i][j - 1] === 'X') {
                    newCell.classList.add('hit_ship');
                    newCell.innerText = playerBoard[i][j - 1];
                } else {
                    newCell.classList.add('unhit_ship');
                    newCell.innerText = playerBoard[i][j - 1];
                }
            }
        }
    }
}

function cellClicked() {
    let topGridCell = document.getElementById('topGrid').rows[this.parentNode.rowIndex].cells[this.cellIndex];
    let currentPlayer = (turn === 1 ? player1 : player2);
    let opposingPlayer = (turn === 2 ? player1 : player2);


    if (currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] === 'X' ||
        currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] === 'M') {
        alert("You already fired at that position!");
    } else {
        if (opposingPlayer.playerBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] == 'A') {
            currentPlayer.aircraftHits += 1;
            topGridCell.style.backgroundColor = 'red';
            currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] = 'X';

            if (currentPlayer.aircraftHits === 5) {
                alert('You sunk their aircraft carrier!');
            } else {
                alert("Thats's a hit!");
            }
        } else if (opposingPlayer.playerBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] == 'B') {
            currentPlayer.battleshipHits += 1;
            topGridCell.style.backgroundColor = 'red';
            currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] = 'X';

            if (currentPlayer.battleshipHits === 4) {
                alert('You sunk their battleship!');
            } else {
                alert("Thats's a hit!");
            }
        } else if (opposingPlayer.playerBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] == 'S') {
            currentPlayer.submarineHits += 1;
            topGridCell.style.backgroundColor = 'red';
            currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] = 'X';

            if (currentPlayer.submarineHits === 3) {
                alert('You sunk their submarine!');
            } else {
                alert("Thats's a hit!");
            }
        } else if (opposingPlayer.playerBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] == '-') {
            topGridCell.style.backgroundColor = 'white';
            currentPlayer.opponentBoard[this.parentNode.rowIndex - 2][this.cellIndex - 1] = 'M';
            alert("That's a miss!");
        }

        if (detectEndGame()) {
            calculateFinalScores();
            storeFinalScores();
            displayHighScores();
        } else {
            turn = (turn === 1 ? 2 : 1);
            hideBoards(opposingPlayer);
        }

    }
}

function hideBoards(player) {
    document.getElementById('topGrid').style.display = 'none';
    document.getElementById('bottomGrid').style.display = 'none';
    document.getElementById("hideBoards").style.display = "block"
    document.getElementById("playerTurn").innerText = "It's " + player.name + "'s turn!"
}

function showBoards() {
    document.getElementById("hideBoards").style.display = "none";
    reDrawBoards();
}

function reDrawBoards() {
    let currentPlayer = (turn === 1 ? player1 : player2);
    let opponentPlayer = (turn === 2 ? player1 : player2);
    let topTable = document.getElementById('topGrid');
    let bottomTable = document.getElementById('bottomGrid');

    topTable.style.display = 'initial';
    bottomTable.style.display = 'initial';

    for (var i = 2; i < topTable.rows.length; i++) {
        for (var j = 1; j < topTable.rows[i].cells.length; j++) {
            topTable.rows[i].cells[j].classList.add('grid_pieces');
            topTable.rows[i].cells[j].style.backgroundColor = '#A0E6FF';

            if (currentPlayer.opponentBoard[i - 2][j - 1] === 'X') {
                topTable.rows[i].cells[j].style.backgroundColor = 'red';
            } else if (currentPlayer.opponentBoard[i - 2][j - 1] === 'M') {
                topTable.rows[i].cells[j].style.backgroundColor = 'white';
            }

            if (currentPlayer.playerBoard[i - 2][j - 1] === 'A') {
                bottomTable.rows[i].cells[j].innerText = 'A';
            } else if (currentPlayer.playerBoard[i - 2][j - 1] === 'B') {
                bottomTable.rows[i].cells[j].innerText = 'B';
            } else if (currentPlayer.playerBoard[i - 2][j - 1] === 'S') {
                bottomTable.rows[i].cells[j].innerText = 'S';
            } else {
                bottomTable.rows[i].cells[j].innerText = '';
            }

            if (opponentPlayer.opponentBoard[i - 2][j - 1] === 'X') {
                bottomTable.rows[i].cells[j].style.backgroundColor = 'red';
                bottomTable.rows[i].cells[j].style.color = 'white';
                bottomTable.rows[i].cells[j].style.border = '1px solid black';
            } else if (opponentPlayer.opponentBoard[i - 2][j - 1] === 'M') {
                bottomTable.rows[i].cells[j].style.backgroundColor = 'white';
                bottomTable.rows[i].cells[j].style.color = 'black';
                bottomTable.rows[i].cells[j].style.border = '1px solid black';
            } else if (bottomTable.rows[i].cells[j].innerText != '') {
                bottomTable.rows[i].cells[j].style.backgroundColor = 'grey';
                bottomTable.rows[i].cells[j].style.color = 'white';
                bottomTable.rows[i].cells[j].style.border = '1px solid black';
            } else {
                bottomTable.rows[i].cells[j].style.backgroundColor = '#A0E6FF';
            }

        }
    }
}

function detectEndGame() {
    let currentPlayer = (turn === 1 ? player1 : player2);

    if (currentPlayer.aircraftHits + currentPlayer.battleshipHits + currentPlayer.submarineHits === 12) {
        return true;
    } else {
        return false;
    }
}

function calculateFinalScores() {
    let winner = (turn === 1 ? player1 : player2);
    let loser = (turn === 2 ? player1 : player2);

    if (loser.aircraftHits === 5) {
        loser.score += 10;
    } else {
        loser.score += (loser.aircraftHits * 2);
    }

    if (loser.battleshipHits === 4) {
        loser.score += 8;
    } else {
        loser.score += (loser.battleshipHits * 2);
    }

    if (loser.submarineHits === 3) {
        loser.score += 6;
    } else {
        loser.score += (loser.submarineHits * 2);
    }

    winner.score = 24 - loser.score;
}

function storeFinalScores() {
    let winner = (turn === 1 ? player1 : player2);
    let loser = (turn === 2 ? player1 : player2);
    let winnerWritten = false;
    let loserWritten = false;
    let winnerJSON = {
        name: winner.name,
        score: winner.score
    };

    let loserJSON = {
        name: loser.name,
        score: loser.score
    };

    if (typeof(Storage) !== "undefined") {
        let tenthScore = JSON.parse(localStorage.getItem('score10'));

        if (tenthScore === null || tenthScore.score !== 24) {
            for (var i = 1; i <= 10; i++) {
                let scoreIteration = "score" + i;
                let currentStorageItem = JSON.parse(localStorage.getItem(scoreIteration));

                if (currentStorageItem === null) {
                    const placeHolderJSON = {
                        name: "PLACEHOLDER ",
                        score: -1
                    };

                    localStorage.setItem(scoreIteration, JSON.stringify(placeHolderJSON));
                }
            }

            for (var i = 1; i <= 10; i++) {
                let scoreIteration = "score" + i;
                let currentStorageItem = JSON.parse(localStorage.getItem(scoreIteration));

                if (currentStorageItem === null && !winnerWritten) {
                    localStorage.setItem(scoreIteration, JSON.stringify(winnerJSON));
                    winnerWritten = true;
                } else if (currentStorageItem === null && !loserWritten) {
                    localStorage.setItem(scoreIteration, JSON.stringify(loserJSON));
                    loserWritten = true;
                } else if (winnerJSON.score > currentStorageItem.score) {
                    const tempScore = currentStorageItem;
                    localStorage.removeItem(scoreIteration);
                    localStorage.setItem(scoreIteration, JSON.stringify(winnerJSON));
                    winnerJSON = tempScore;
                } else if (loserJSON.score > currentStorageItem.score) {
                    const tempScore = currentStorageItem;
                    localStorage.removeItem(scoreIteration);
                    localStorage.setItem(scoreIteration, JSON.stringify(loserJSON));
                    loserJSON = tempScore;
                }
            }
        }
    } else {
        alert("Oh no... Battleship cannot save your scores becuase localStorage is disabled!");
    }
}

function displayHighScores() {
    document.getElementById('topGrid').style.display = 'none';
    document.getElementById('bottomGrid').style.display = 'none';
    document.getElementById('highScores').style.display = 'block';

    let winner = (turn === 1 ? player1 : player2);
    document.getElementById('winnerMessage').innerHTML = 'Congratulations ' + winner.name + '! You won with a score of: ' + winner.score;
    let highScores = document.getElementById('scoresList');
    if (typeof(Storage) !== "undefined") {
        for (var i = 1; i <= 10; i++) {
            let scoreIteration = "score" + i;
            let currentStorageItem = JSON.parse(localStorage.getItem(scoreIteration));

            if (currentStorageItem.name !== 'PLACEHOLDER' && currentStorageItem.score >= 0) {
                let newItem = document.createElement("li");
                let listText = document.createTextNode(currentStorageItem.name + ": " + currentStorageItem.score);
                newItem.appendChild(listText);
                highScores.appendChild(newItem);
            }
        }
    }
}

var player1 = {
    name: getPlayerName(1),
    shipString: getShipPlacementString(),
    aircraftHits: 0,
    battleshipHits: 0,
    submarineHits: 0,
    score: 0
};

var player2 = {
    name: getPlayerName(2),
    shipString: getShipPlacementString(),
    aircraftHits: 0,
    battleshipHits: 0,
    submarineHits: 0,
    score: 0
};

var turn = 1;

player1.playerBoard = generatePlayerBoard(player1.shipString);
player2.playerBoard = generatePlayerBoard(player2.shipString);
player1.opponentBoard = generateOpponentBoard();
player2.opponentBoard = generateOpponentBoard();
drawTopGrid(player1);
drawBottomGrid(player1);
hideBoards(player1);