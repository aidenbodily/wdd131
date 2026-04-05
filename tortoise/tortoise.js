// computational thinking:
//
// 1. break the problem into smaller parts
//    - setting up the board, shuffling tiles and dealing them out
//    - letting the player pick which column to shove a blank into
//    - figuring out where the tile that pops out goes (dots = user, bamboo = bot's)
//    - the chain thing, tiles keep getting pushed around until a blank pops out
//    - bot takes turns too, just picks randomly
//    - checking if anyone won yet
//    - redrawing the board after stuff changes
//
// 2. look for repeated or similar steps
//    - the push in pop out thing happens a ton, for both the user and the bot
//    - the chain is basically the same loop over and over: pop a tile,
//      figure out where it goes, put it there, pop the next one
//    - drawing the grid works the same way for both sides
//    - checking if tiles are sorted is the same check for every column
//
// 3. make a list of steps
//    - make all 72 tiles, shuffle them, deal them into two grids
//    - randomly pick who goes first
//    - on the player's turn they click a column to push a blank in,
//      on the bot's turn it just picks a random column
//    - whatever tile falls out the bottom starts a chain
//    - dots tiles user places, bamboo tiles go to the bot automatically
//    - chain keeps going until a blank falls out, then swap turns
//    - after each placement check if all 36 tiles are sorted for either side
//
// pseudocode:
//    - have an object with all the tile emojis so i can look them up
//    - variables for both grids, whose turn, game phase, held tile, move count
//    - new game: make tiles, shuffle, set up empty grids, deal them in
//    - column click: if we're inserting, push blank in and start chain.
//      if we're placing, stick the tile in the right column and keep going
//    - chain logic: blank = turn over. dots = user places it. bamboo = auto-place on bot's side
//    - rendering: update score/turn labels, show held tile, rebuild the grid html

const tileEmojis = {
    d1: '\u{1F019}', d2: '\u{1F01A}', d3: '\u{1F01B}', d4: '\u{1F01C}',
    d5: '\u{1F01D}', d6: '\u{1F01E}', d7: '\u{1F01F}', d8: '\u{1F020}', d9: '\u{1F021}',
    b1: '\u{1F010}', b2: '\u{1F011}', b3: '\u{1F012}', b4: '\u{1F013}',
    b5: '\u{1F014}', b6: '\u{1F015}', b7: '\u{1F016}', b8: '\u{1F017}', b9: '\u{1F018}'
};

let playerGrid = [];
let botGrid = [];
let currentTurn = '';
let gamePhase = '';
let heldTile = null;
let moveCount = 0;
let isLocked = false;

function getEl(id) {
    return document.getElementById(id);
}

function getTileEmoji(tile) {
    if (!tile) return '';
    const key = tile.suit + tile.num;
    if (tileEmojis[key]) {
        return tileEmojis[key];
    }
    return '?';
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// push a tile into the top of a column and pop the bottom one out
function pushIntoColumn(grid, colIndex, item) {
    grid[colIndex].unshift(item);
    return grid[colIndex].pop();
}

// count how many tiles are in the right spot
function countSorted(grid, suit) {
    let total = 0;
    for (let colIndex = 0; colIndex < grid.length; colIndex++) {
        const column = grid[colIndex];
        for (let i = 0; i < column.length; i++) {
            const tile = column[i];
            if (tile !== null && tile.suit === suit && tile.num === colIndex + 1 && tile.faceUp) {
                total++;
            }
        }
    }
    return total;
}

function showMessage(text) {
    getEl('message').textContent = text;
}

function startNewGame() {
    const allTiles = [];
    for (let num = 1; num <= 9; num++) {
        for (let copy = 0; copy < 4; copy++) {
            allTiles.push({ suit: 'd', num: num, faceUp: false });
            allTiles.push({ suit: 'b', num: num, faceUp: false });
        }
    }

    shuffleArray(allTiles);

    playerGrid = [];
    botGrid = [];
    for (let i = 0; i < 9; i++) {
        playerGrid.push([]);
        botGrid.push([]);
    }

    let idx = 0;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 9; col++) {
            playerGrid[col].push(allTiles[idx]);
            idx++;
        }
    }
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 9; col++) {
            botGrid[col].push(allTiles[idx]);
            idx++;
        }
    }

    if (Math.random() < 0.5) {
        currentTurn = 'player';
    } else {
        currentTurn = 'bot';
    }
    gamePhase = 'INSERT_BLANK';
    heldTile = null;
    moveCount = 0;
    isLocked = false;

    renderGame();

    if (currentTurn === 'player') {
        showMessage('You go first! Click a column number to push a blank in.');
    } else {
        showMessage('Bot goes first...');
        setTimeout(botTakeTurn, 800);
    }
}

function handleColumnClick(col) {
    if (isLocked) return;

    if (gamePhase === 'INSERT_BLANK' && currentTurn === 'player') {
        const popped = pushIntoColumn(playerGrid, col, null);
        if (popped) popped.faceUp = true;
        heldTile = popped;
        moveCount++;
        isLocked = true;
        renderGame();
        setTimeout(processChain, 400);
        return;
    }

    if (gamePhase === 'WAIT_PLAYER' && heldTile && heldTile.suit === 'd') {
        if (col === heldTile.num - 1) {
            const tile = heldTile;
            const popped = pushIntoColumn(playerGrid, col, tile);
            if (popped) popped.faceUp = true;
            heldTile = popped;
            isLocked = true;
            renderGame();
            if (checkForWinner()) return;
            setTimeout(processChain, 400);
        }
        return;
    }
}

// keep the chain going after placing a tile
function processChain() {
    if (heldTile === null) {
        switchTurn();
        return;
    }

    heldTile.faceUp = true;

    if (heldTile.suit === 'd') {
        // dots tile means player places it
        gamePhase = 'WAIT_PLAYER';
        isLocked = false;
        showMessage('Place ' + getTileEmoji(heldTile) + ' into column ' + heldTile.num);
        renderGame();
    } else {
        // bamboo tile goes to bot
        gamePhase = 'AUTO';
        showMessage(getTileEmoji(heldTile) + ' goes to Bot column ' + heldTile.num);
        renderGame();
        setTimeout(function() {
            const tile = heldTile;
            const popped = pushIntoColumn(botGrid, tile.num - 1, tile);
            if (popped) popped.faceUp = true;
            heldTile = popped;
            renderGame();
            if (checkForWinner()) return;
            setTimeout(processChain, 400);
        }, 450);
    }
}

function switchTurn() {
    if (currentTurn === 'player') {
        currentTurn = 'bot';
        gamePhase = 'INSERT_BLANK';
        isLocked = true;
        showMessage("Bot's turn...");
        renderGame();
        setTimeout(botTakeTurn, 800);
    } else {
        currentTurn = 'player';
        gamePhase = 'INSERT_BLANK';
        isLocked = false;
        showMessage('Your turn! Click a column to push a blank in.');
        renderGame();
    }
}

function checkForWinner() {
    if (countSorted(playerGrid, 'd') === 36) {
        gamePhase = 'OVER';
        heldTile = null;
        isLocked = false;
        showMessage('You win! Nice job!');
        renderGame();
        return true;
    }
    if (countSorted(botGrid, 'b') === 36) {
        gamePhase = 'OVER';
        heldTile = null;
        isLocked = false;
        showMessage('Bot wins! Better luck next time.');
        renderGame();
        return true;
    }
    return false;
}

function pickBotColumn() {
    return Math.floor(Math.random() * 9);
}

function botTakeTurn() {
    const col = pickBotColumn();
    showMessage('Bot pushes blank into column ' + (col + 1));
    const popped = pushIntoColumn(botGrid, col, null);
    if (popped) popped.faceUp = true;
    heldTile = popped;
    moveCount++;
    isLocked = true;
    renderGame();
    setTimeout(processChain, 400);
}

// draw everything on the page
function renderGame() {
    getEl('player-score').textContent = countSorted(playerGrid, 'd');
    getEl('bot-score').textContent = countSorted(botGrid, 'b');
    getEl('move-count').textContent = moveCount;
    if (currentTurn === 'player') {
        getEl('turn-label').textContent = 'You';
    } else {
        getEl('turn-label').textContent = 'Bot';
    }

    const handArea = getEl('hand-area');
    if (heldTile) {
        handArea.classList.remove('hidden');
        getEl('hand-tile').textContent = getTileEmoji(heldTile);
        if (heldTile.suit === 'd') {
            getEl('hand-dest').textContent = '\u2192 Your column ' + heldTile.num;
        } else {
            getEl('hand-dest').textContent = '\u2192 Bot column ' + heldTile.num;
        }
    } else {
        handArea.classList.add('hidden');
    }

    // draw both grids
    buildGrid('bot', botGrid, false);
    buildGrid('player', playerGrid, true);
}

// build one grids html
function buildGrid(prefix, grid, isPlayer) {
    const colNumsEl = getEl(prefix + '-col-nums');
    const gridEl = getEl(prefix + '-grid');

    colNumsEl.innerHTML = '';
    gridEl.innerHTML = '';

    const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    columns.forEach(function(num, index) {
        const btn = document.createElement('button');
        btn.className = 'col-num';
        btn.textContent = num;
        btn.disabled = true;

        if (isPlayer && currentTurn === 'player') {
            if (gamePhase === 'INSERT_BLANK') {
                btn.disabled = false;
                btn.classList.add('active');
                btn.addEventListener('click', function() {
                    handleColumnClick(index);
                });
            }
        }

        if (isPlayer && gamePhase === 'WAIT_PLAYER' && heldTile && index === heldTile.num - 1) {
            btn.disabled = false;
            btn.classList.add('target');
            btn.addEventListener('click', function() {
                handleColumnClick(index);
            });
        }

        colNumsEl.appendChild(btn);
    });

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 9; col++) {
            const tile = grid[col][row];
            const div = document.createElement('div');

            if (tile === null) {
                div.className = 'cell blank';
            } else if (tile.faceUp) {
                div.className = 'cell face-up';
                div.textContent = getTileEmoji(tile);
            } else {
                div.className = 'cell face-down';
            }

            gridEl.appendChild(div);
        }
    }
}

getEl('new-game-btn').addEventListener('click', startNewGame);
startNewGame();
