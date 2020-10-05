// Initializing global variables
var validPlacements;
var validCoords;
var validShot = true;
var p1Ships = 0;
var p2Ships = 0;
let hitScore1 = 0;
let hitScore2 = 0;
let sunkScore1 = 0;
let sunkScore2 = 0;
let boom = String.fromCodePoint(0x1F525);

/**
 * Reacts to the players selection of opponent and sets the global variable playMode
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function playersSet(){
    var playVS = document.getElementsByName("manVSmachine");

    for(i = 0; i < playVS.length; i++){
        if (playVS[i].checked){
            playMode = playVS[i].value;
        }
    }
    console.log("Mode:" + playMode);
    document.getElementById("manVS").hidden = true;
    if(playMode == "vsMachine"){
        p2 = robotPlayer;
        document.getElementById('Mode').hidden = false;
    }
    if(playMode == "vsMan")
    {
        document.getElementById('shipInput').hidden = false;
    }
}

/**
 * Reacts to the players selection of AI difficulty and sets the global variable difficulty
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function modeSet(){
    var mode = document.getElementsByName("PlayLevel");
    for(i = 0; i < mode.length; i++){
        if (mode[i].checked){
            difficulty = mode[i].value;
        }
    }
    console.log(" AI difficulty: " + difficulty);
    document.getElementById("Mode").hidden = true;
    document.getElementById('shipInput').hidden = false;
    if(playMode == "Easy")
    {

    }
    else if(playMode == "Medium")
    {
        mediumMode();
    }
    else if (playMode == "Hard")
    {
        hardMode();
    }

}

/**
 * Updates the copies of the players board that way they match the actual one
 * @pre A copy of each of the players' board exists but doesn't match them
 * @post Copy now matches the respective player's board
 * @param board1 Player one's board
 * @param board2 Player two's board
 * @throws None
 * @return None
 */
function updateCopies(board1, board2){
    for (let i = 1; i < 10; i++){
        for (let j = 1; j < 10; j++){
            if(board1[i][j] == 'S'){
                copy1.board[i][j] == '~';
            }
            else{
                copy1.board[i][j] = board1[i][j];
            }

            if(board2[i][j] == 'S'){
                copy2.board[i][j] == '~';
            }
            else{
                copy2.board[i][j] = board2[i][j];
            }
        }
    }
}


/**
 * @classdesc Game board is initialized with given height, width, totalShips
 * @constructor 
 *  {Number} - height - The height of the board 
 *  {Number}  - width - The width of the board
 *  {Number}  - totalShips - the total number of ships 
 *  {Array,<Number>}  - board - 2D array 
 *  {Number} - hitX - The coordinate X to hit
 *  {Number} - hitY - The coordinate Y to hit 
 *  {Boolean} - turn - Boolean to store who's turn it is
 */
class Board
{
    constuctor() {
        this.height;
        this.width;
        this.board;
        this.totalShips = 0;
        this.turn;
        this.hitX;
        this.hitY;
        this.validNum;
        this.gotShips;
        this.message;
        
    }

    /**
     * Initializes a player's board
     * @pre Player exists but they don't have a board
     * @post Board created for the user
     * @param None 
     * @throws None
     * @return None
     */
    initboard(){
        this.hitX = -1;
        this.hitY = -1;
        this.turn = false;
        this.height = 10;
        this.width = 10;
        this.board = [];
        for (let i = 0; i<10; i++){
			this.board[i] = [];
			for (let j = 0; j<10; j++){
                this.board[i][j] = '~'; // 0 represents water
			}
        }
        console.log("Board initialized");
        for(let i = 0; i < 10; i++){
            this.board[i][0] = i;
            if(i == 0){
                this.board[0][i] = String.fromCharCode(32);
            }else{
                this.board[0][i] = String.fromCharCode(64 + i); 
            }
            
        }
    }

    /**
     * checks if the input coordinates are within the range
     * @pre None
     * @post None 
     * @param {Number} - x - X coordinate 
     * @param {Number} - y - Y coordinate 
     * @param {Number} - t - type  
     * @throws None
     * @returns true if it's a valid coordinate and false otherwise
     */
    checkCoord(x,y,t,l,o)
    {
        console.log("Checking coords");
        console.log( x + " xval " + y + " yval " + t + " tval " + l + " lval " + o + " oval");
        for (let i = 0; i < l; i++) 
        {
            if(o == 'H')
            {
                if((x+l-1) > 9)
                {
                    console.log("Out of bounds (horizontally)")
                    validPlacements = false;
                    return false;
                }
                else if (this.board[y][x+i] != '~')
                {
                    console.log("Can't place on another ship");
                    validPlacements = false;
                    return false;
                }
            }
            else
            {
                if((y+l-1) > 9)
                {
                    console.log("Out of bounds (vertically)")
                    validPlacements = false;
                    return false;
                }
                else if (this.board[y+i][x] != '~')
                {
                    console.log("Can't place on another ship");
                    validPlacements = false;
                    return false;
                }
            }
            validPlacements = true;
            return true;
        }
    }

    /**
     * sets the hit x coordinate 
     * @pre None
     * @post None
     * @param {Number} - x - The X coordinate to hit
     * @throws None
     * @returns None  
     */
    setHitX(x){
            this.hitX = parseInt(x);
    }
 
    /**
    * sets the hit  y coordinate
    * @pre None
    * @post None  
    * @param {Number} - x - The Y coordinate to hit
    * @throws None
    * @returns None
    */
    setHitY(y){
            this.hitY = parseInt(y);
    }
 
    /**
     * adds ship to the grid
     * @pre A ship needs to be added to the board
     * @post Ship has been placed if it is valid 
     * @param {Number} x - x coordinate of the board
     * @param {Number} y - y coordinate of the board
     * @param {Number} t - type of the ship
     * @throws None
     * @returns None 
     */
    addShip(x,y,t, length, or){
        console.log("ADDING SHIP");
        if (this.checkCoord(x, y,t,length,or))
        {
            for (let i = 0; i < length; i++) 
            {
                if (or.toUpperCase() == 'H') 
                {
                    this.board[y][x+i] = t;
                } 
                else 
                {
                    this.board[y+i][x] = t;
                }
            }
        }
    }
 
    /**
     * checks the board for placed ships
     * @pre Need to see of a coordinate is a ship
     * @post Tells the program if there is a ship
     * @param {Number} - x - The X coordinate of the board
     * @param {Number} - y - The Y coordinate of the board 
     * @throws None
     * @returns true if it the spot is a ship and false otherwise
     */
    checkBoard(x,y){
        console.log("Check board");
        if(this.board[y][x] == 'S'){
            return true;
        }
        else{
            return false;
        }
    }
 
    /**
     * if the ship is hit change the grid position to 9
     * @pre Need to mark a spot after a shot
     * @post Marks a spot accordinly if it's a miss or a hit
     * @param {Number}-  x - X coordinate of the board
     * @param {Number}- y - Y coordinate of the board 
     * @throws None
     * @returns None 
     */
    shipHit(x,y){
       if((this.board[y][x] == '0') || (this.board[y][x] == boom))
        {
         	//document.getElementById("hitY").selectedIndex = "-1";
         	//document.getElementById("hitX").selectedIndex = "-1";
            validShot = false;
			alert("Index has already been fired at. Try Again"); 
        }
        if (this.board[y][x] == '~'){
            this.board[y][x] = '0';
            validShot = true;
        }else if (this.board[y][x] == 'S') {
            this.board[y][x] = boom;
            validShot = true;
            //alert("HIT AT " + x + " " + y); 
        }
    }

    /**
     * Checks to see if all ships have been destroyed
     * @pre There are ships that may have all been destroyed
     * @post Tells the program if all ships have indeed been destroyed
     * @param None 
     * @throws None
     * @return true if all of the ships have been destoryed and false otherwise
     */
    shipsDestroyed()
    {
        let destroyed = false; 
        for(let i = 1; i < 10; i++)
        {
            for(let j = 1; j < 10; j++)
            {
                if(this.board[i][j] == 'S') //checks every indicie to see if the ship is still there
                {
                    return(false); 
                }
                else 
                {
                    destroyed = true; 
                }
            }
        }
        return(destroyed); 
    }
}
 
/**
 * @classdesc  initialises the ship with the given x and y coordinates, the size of the ship, orientation and the type
 */
class Ships{
    constructor() {
        this.xCoord;
        this.yCoord;
        this.size;
        this.orien;
        this.type;
    
    }
    
    /**
     * Sets the X coordinate of the ship 
     * @pre Need to set an x coordinate for a ship
     * @post Sets the x coordinate for a ship
     * @param {Number} - x - the X coordinate of the ship 
     * @throws None
     * @returns None  
     */
    setX(x){
        // if()
        this.xCoord = parseInt(x);
       
    }

    /**
     * Sets the Y coordinate of the ship
     * @pre Need to set a y coordinate for a ship
     * @post Sets the y coordinate for a ship 
     * @param {Number} - y - the Y coordinate of the ship
     * @throws None
     * @returns None 
     */
    setY(y){
        
        this.yCoord = parseInt(y);
    }
 
    /**
     * Sets the ship size and type
     * @pre Need to set a ship's size and type
     * @post Set a ship's size and type
     * @param {Number} -  s - the given of the ship
     * @throws None 
     * @returns None
     */
    setShipSize(s){
        this.size = parseInt(s);
        this.type = parseInt(s);
    }

    /**
     * Sets the orientation of the ship
     * @pre Need to set the orientation of a ship
     * @post Sets the orientation of a ship 
     * @param {String} - o - the orientation of the given ship (V/H)
     * @throws None
     * @returns None 
     */
    setOrientation(o){
        this.orien = o.toUpperCase();
    }

    /**
     * Sets the ship to the player one
     * @pre Need to set a ship for player one
     * @post Sets a ship for player one
     * @param {Object} - player - the player object the instance of the board class 
     * @throws None
     * @returns None 
     */
    setShip1(player){
        if (player.checkCoord(this.xCoord, this.yCoord,'S',this.size, this.orien))
        {
            player.addShip(this.xCoord,this.yCoord,'S', this.size, this.orien);
            p1Ships ++;
            displayShipInputs();
        }  
    }

    /**
     * Sets the ship to the player two
     * @pre Need to set a ship for player two
     * @post Sets a ship for player two
     * @param {Object} - player - the player object the instance of the board class 
     * @throws None
     * @return None
     */
    setShip2(player){
        if (player.checkCoord(this.xCoord, this.yCoord,'S',this.size, this.orien))
        {
            player.addShip(this.xCoord,this.yCoord,'S', this.size, this.orien);
            p2Ships ++;
            displayShipInputs();
        }  
    } 
}

//Initiailizing variables
var playMode;
var difficulty;

let robotPlayer = new Board();
let p1 = new Board();
let p2 = new Board();
let copy1 = new Board();
let copy2 = new Board();

p1.initboard();
p2.initboard();
copy1.initboard();
copy2.initboard();


let p1S1 = new Ships();
let p1S2 = new Ships();
let p1S3 = new Ships();
let p1S4 = new Ships();
let p1S5 = new Ships();
 
p1S1.setShipSize(1);
p1S2.setShipSize(2);
p1S3.setShipSize(3);
p1S4.setShipSize(4);
p1S5.setShipSize(5);
 
let p2S1 = new Ships();
let p2S2 = new Ships();
let p2S3 = new Ships();
let p2S4 = new Ships();
let p2S5 = new Ships();
 
p2S1.setShipSize(1);
p2S2.setShipSize(2);
p2S3.setShipSize(3);
p2S4.setShipSize(4);
p2S5.setShipSize(5);
p1.turn = true;

/**
 * Reacts to the players selection of number of ships and sets the global variable totalShips
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function initNumShips()
{
    var x = document.getElementById('numberShips').value;
    if(Number(x) > 0 && Number(x) < 6)
    {
        this.totalShips = x;
        this.validNum = true
        console.log("valid");
        document.getElementById('shipInput').hidden = true;
        p1.turn = true;
        displayShipInputs();
    }
    else
    {
        this.validNum = false;
        window.alert("Not a valid number! Try again.");
        console.log("not valid");
    }
}
 
/**
 * Controls what the player can see on the screen for ship placements
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function displayShipInputs(){
    if(p1.turn)
    {
        if(p1Ships == 0)
        {
            document.getElementById('p1Ships').hidden = false;
        }
        if(this.totalShips >= 2 && p1Ships == 1)
        {
            document.getElementById('p1One').hidden = true;
            document.getElementById('p1Two').hidden = false;
        }
        if(this.totalShips >= 3 && p1Ships == 2)
        {
            document.getElementById('p1Two').hidden = true;
            document.getElementById('p1Three').hidden = false;
        }
        if(this.totalShips >= 4 && p1Ships == 3)
        {
            document.getElementById('p1Three').hidden = true;
            document.getElementById('p1Four').hidden = false;
        }
        if(this.totalShips == 5 && p1Ships == 4)
        {
            document.getElementById('p1Four').hidden = true;
            document.getElementById('p1Five').hidden = false;
        }
    }
    else if(p2.turn){
        if(p2Ships == 0)
        {
            document.getElementById('p2Ships').hidden = false;
        }
        if(this.totalShips >= 2 && p2Ships == 1)
        {
            document.getElementById('p2One').hidden = true;
            document.getElementById('p2Two').hidden = false;
        }
        if(this.totalShips >= 3 && p2Ships == 2)
        {
            document.getElementById('p2Two').hidden = true;
            document.getElementById('p2Three').hidden = false;
        }
        if(this.totalShips >= 4 && p2Ships == 3)
        {
            document.getElementById('p2Three').hidden = true;
            document.getElementById('p2Four').hidden = false;
        }
        if(this.totalShips == 5 && p2Ships == 4)
        {
            document.getElementById('p2Five').hidden = true;
            document.getElementById('p2Five').hidden = false;
        }
    }
}

/**
 * Print function
 * @pre Need to print an html board for the user to see
 * @post Prints a view of a board to the user  
 * @param {Object}  - player - player object is the instance of board class 
 * @param {Number} - t - the type of the ship
 * @throws None
 * @returns None 
 */
function prettyPrint(player,t){
   
    var result = "<table class='player-view'>";
    for(var i=0; i<player.height; i++) {
        result += "<tr>";
        for(var j=0; j<player.width; j++){
            result += "<td>"+player.board[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    document.getElementById(t).innerHTML = result;

}
 
// Initializes hiding of HTML elements
document.getElementById('Mode').hidden = true;
document.getElementById('shipInput').hidden = true;
document.getElementById('game').hidden = true;
document.getElementById('p1div').hidden = true;
document.getElementById('p2div').hidden = true;
document.getElementById('p1Ships').hidden = true;
document.getElementById('p1Two').hidden = true;
document.getElementById('p1Three').hidden = true;
document.getElementById('p1Four').hidden = true;
document.getElementById('p1Five').hidden = true;
document.getElementById('p2Ships').hidden = true;
document.getElementById('p2Two').hidden = true;
document.getElementById('p2Three').hidden = true;
document.getElementById('p2Four').hidden = true;
document.getElementById('p2Five').hidden = true;
document.getElementById('score-board').hidden = true;
document.getElementById('player1-score').hidden = true;
document.getElementById('player2-score').hidden = true;


/**
 * Reacts to the number of hits for each player and updates a scoreboard
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function scoreUpdate(){
	document.getElementById('total-hits-1').innerHTML = hitScore1;
	document.getElementById('total-hits-2').innerHTML = hitScore2;
	//document.getElementById('total-sunk-1').innerHTML = sunkScore1;
	//document.getElementById('total-sunk-2').innerHTML = sunkScore2;
}

/**
 * Create a letter representation for a number value for an x coordinate
 * @pre x coordinate value exists but we want it as a letter
 * @post Turns the x coordinate value into a letter
 * @param val the x coordinate's value 
 * @throws None
 * @return char that corresponds to a letter from A-I
 */
function converttoLetter(val){
    let char;
    if( val == 1)
    {
      char = 'A';
    }
    else if(val == 2)
    {
      char = 'B';
    }
    else if(val == 3)
    {
      char = 'C';
    }
    else if(val == 4)
    {
      char = 'D';
    }
    else if(val == 5)
    {
      char = 'E';
    }
    else if(val == 6)
    {
      char = 'F';
    }
    else if(val == 7)
    {
      char = 'G';
    }
    else if(val == 8)
    {
      char = 'H';
    }
    else if(val == 9)
    {
      char = 'I';
    }
    else{
      char = '0';
    }
    return (char);
}

/**
 * The function sets the different variables available to the board class after taking inputs for player 1
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None
 */
function formUpdate(){
    if(document.getElementById('S1X').value !=="" && document.getElementById('S1Y').value !=="" && document.getElementById('S1Orien').value !=="")
    {
        p1S1.setX(document.getElementById('S1X').value);
        p1S1.setY(document.getElementById('S1Y').value);
        p1S1.setOrientation(document.getElementById('S1Orien').value);
        validCoords = true;
    }
    else if (p1Ships == 0)
    {
        validCoords = false;
    }
    
    if(document.getElementById('S2X').value !=="" && document.getElementById('S2Y').value !=="" && document.getElementById('S2Orien').value !=="")
    {
        p1S2.setX(document.getElementById('S2X').value);
        p1S2.setY(document.getElementById('S2Y').value);
        p1S2.setOrientation(document.getElementById('S2Orien').value);
        validCoords = true;
    }
    else if (totalShips >= 2 && p1Ships == 1)
    {
        validCoords = false;
    }

    if(document.getElementById('S3X').value !=="" && document.getElementById('S3Y').value !=="" && document.getElementById('S3Orien').value !=="")
    {
        p1S3.setX(document.getElementById('S3X').value);
        p1S3.setY(document.getElementById('S3Y').value);
        p1S3.setOrientation(document.getElementById('S3Orien').value);
        validCoords = true;
    }
    else if (totalShips >= 3 && p1Ships == 2)
    {
        validCoords = false;
    }
    
    if(document.getElementById('S4X').value !=="" && document.getElementById('S4Y').value !=="" && document.getElementById('S4Orien').value !=="")
    {
        p1S4.setX(document.getElementById('S4X').value);
        p1S4.setY(document.getElementById('S4Y').value);
        p1S4.setOrientation(document.getElementById('S4Orien').value);
        validCoords = true;
    }
    else if (totalShips >= 4 && p1Ships == 3)
    {
        validCoords = false;
    }
    
    if(document.getElementById('S5X').value !=="" && document.getElementById('S5Y').value !=="" && document.getElementById('S5Orien').value !=="")
    {
        p1S5.setX(document.getElementById('S5X').value);
        p1S5.setY(document.getElementById('S5Y').value);
        p1S5.setOrientation(document.getElementById('S5Orien').value);
        validCoords = true;
    }
    else if (totalShips == 5 && p1Ships == 4)
    {
        validCoords = false;
    }
 
}
 
/**
 * The function sets the different variables available to the board class after taking inputs for player 2
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None
 */
 
function formUpdate1(){
    if(document.getElementById('2S1X').value !=="" && document.getElementById('2S1Y').value !=="" && document.getElementById('2S1Orien').value !=="")
    {
        p2S1.setX(document.getElementById('2S1X').value);
        p2S1.setY(document.getElementById('2S1Y').value);
        p2S1.setOrientation(document.getElementById('2S1Orien').value);
        validCoords = true;
    }
    else if(p2Ships == 0)
    {
        validCoords = false;
    }
    
    if(document.getElementById('2S2X').value !=="" && document.getElementById('2S2Y').value !=="" && document.getElementById('2S2Orien').value !=="")
    {
        p2S2.setX(document.getElementById('2S2X').value);
        p2S2.setY(document.getElementById('2S2Y').value);
        p2S2.setOrientation(document.getElementById('2S2Orien').value);
        validCoords = true;
    }
    else if(totalShips >= 2 && p2Ships == 1)
    {
        validCoords = false;
    }
 
    if(document.getElementById('2S3X').value !=="" && document.getElementById('2S3Y').value !=="" && document.getElementById('2S3Orien').value !=="")
    {
        p2S3.setX(document.getElementById('2S3X').value);
        p2S3.setY(document.getElementById('2S3Y').value);
        p2S3.setOrientation(document.getElementById('2S3Orien').value);
        validCoords = true;
    }
    else if(totalShips >=3 && p2Ships == 2)
    {
        validCoords = false;
    }
    
    if(document.getElementById('2S4X').value !=="" && document.getElementById('2S4Y').value !=="" && document.getElementById('2S4Orien').value !=="")
    {
        p2S4.setX(document.getElementById('2S4X').value);
        p2S4.setY(document.getElementById('2S4Y').value);
        p2S4.setOrientation(document.getElementById('2S4Orien').value);
        validCoords = true;
    }
    else if(totalShips >= 4 && p2Ships == 3)
    {
        validCoords = false;
    }

    if(document.getElementById('2S5X').value !=="" && document.getElementById('2S5Y').value !=="" && document.getElementById('2S5Orien').value !=="")
    {
        p2S5.setX(document.getElementById('2S5X').value);
        p2S5.setY(document.getElementById('2S5Y').value);
        p2S5.setOrientation(document.getElementById('2S5Orien').value);
        validCoords= true;
    }
    else if(totalShips == 5 && p2Ships == 4)
    {
        validCoords = false;
    }
 
}

/**
 * Reacts to the player's click on the submit button for ships and calls the respective player's set ship
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
 function setShips(){
     if(validCoords)
     {
         if(p1.turn)
         {
             setShipsP1();
         }
         else if(p2.turn)
         {
             setShipsP2();
         }
     }
     else
     {
         alert("You have an invalid coordinate! You need fix it before moving on!");
     }
 }

 var pause;
/**
 * sets ship for player 1 
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None
 */
function setShipsP1(){
    pause = false;
    console.log("setting p1");
    if(p1Ships == 0)
    {
        p1S1.setShip1(p1);
        pause = true;
    }
    if(this.totalShips >= 2 && p1Ships == 1 && pause == false)
    {
        p1S2.setShip1(p1);
        pause = true;
    }
    if(this.totalShips >= 3 && p1Ships == 2 && pause == false)
    {
        p1S3.setShip1(p1);
        pause = true;
    }
    if(this.totalShips >= 4 && p1Ships == 3 && pause == false)
    {
        p1S4.setShip1(p1);
        pause = true;
    }
    if(this.totalShips == 5 && p1Ships == 4 && pause == false)
    {
        p1S5.setShip1(p1);
        pause = true;
    }
    if(validPlacements != true)
    {
        alert("You have an invalid placed ship");
    }
    else if(validPlacements && p1Ships == totalShips)
    {
        document.getElementById('p1Ships').hidden = true;
        document.getElementById('p1data').hidden = true;
        document.getElementById('p1div').hidden = false;
        prettyPrint(p1,"p1div");
        setTimeout(function() { 
        p1.turn = false;
        p2.turn = true;
        document.getElementById('p1div').hidden = true;
        if(playMode == 'vsMachine')
        {
            setShipsP2();
        }
        else
        { 
        displayShipInputs();
        }}, 3000);
    }
    let wait;
    do
    {
        wait = true
        if(playMode == 'vsMachine' && p1Ships == totalShips && wait)
        {
            setTimeout(function(){
            document.getElementById('aiturn').innerHTML = "AI's turn";
            },2800);
            setTimeout(function(){
                document.getElementById('aiturn').hidden = true;
            wait = false
            }, 6000);
        }
        else (wait == false)
        {
        setTimeout(function(){
            if(p1Ships == totalShips)
            {
                //document.getElementById('aiturn').hidden = true;
            }
            document.getElementById('pturn').innerHTML = "Player one turn";},5000);
            break;
        }
    }while(wait == false);
}

/**
 * sets the ship for player 2
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None 
 */
function setShipsP2(){
    pause = false
    if(playMode == 'vsMachine')
    {
        setAIShips(p2);
        if(validPlacements && p2Ships == totalShips)
        {
            document.getElementById('p2Ships').hidden = true;
            document.getElementById('p2data').hidden = true;
            document.getElementById('p2div').hidden = true;
            //updateCopies(p1.board, p2.board);
            setTimeout(function() {
            document.getElementById('p2div').hidden = true;
            document.getElementById('p1div').hidden = true;
            document.getElementById('p2Board').hidden = true;
            document.getElementById('p1copy').hidden = true;
            prettyPrint(p1,"p1BView");
            prettyPrint(copy2, "p1CView");
            document.getElementById('game').hidden = false; 
            document.getElementById('game-Over').hidden = true;
	        document.getElementById('score-board').hidden = false;
	        document.getElementById('player1-score').hidden = false;
	        document.getElementById('player2-score').hidden = false;
            p2.turn = false;
            p1.turn = true;}, 3500);
        }
    }
    
    if(playMode != "vsMachine")
    {
    console.log("setting p2")
    document.getElementById('p1div').hidden = true;
    if(p2Ships == 0)
    {
        p2S1.setShip2(p2);
        pause = true;
    }
    if(this.totalShips >= 2 && p2Ships == 1 && pause == false)
    {
        p2S2.setShip2(p2);
        pause = true;
    }
    if(this.totalShips >= 3 && p2Ships == 2 && pause == false)
    {
        p2S3.setShip2(p2);
        pause = true;
    }
    if(this.totalShips >= 4 && p2Ships == 3 && pause == false)
    {
        p2S4.setShip2(p2);
        pause = true;
    }
    if(this.totalShips == 5 && p2Ships == 4 && pause == false)
    {
        p2S5.setShip2(p2);
        pause = true;
    }
    if(validPlacements != true)
    {
        alert("You have an invalid place ship");
    }
    else if(validPlacements && p2Ships == totalShips)
    {
        document.getElementById('p2Ships').hidden = true;
        document.getElementById('p2data').hidden = true;
        document.getElementById('p2div').hidden = false;
        prettyPrint(p2,"p2div");
        //updateCopies(p1.board, p2.board);
        setTimeout(function() {
        document.getElementById('p2div').hidden = true;
        document.getElementById('p1div').hidden = true;
        document.getElementById('p2Board').hidden = true;
        document.getElementById('p1copy').hidden = true;
        prettyPrint(p1,"p1BView");
        prettyPrint(copy2, "p1CView");
        document.getElementById('game').hidden = false; 
        document.getElementById('game-Over').hidden = true;
        document.getElementById('score-board').hidden = false;
        document.getElementById('player1-score').hidden = false;
        document.getElementById('player2-score').hidden = false;
        p2.turn = false;
        p1.turn = true;}, 3500);
    } 
/*document.getElementById('p2data').hidden = false;
document.getElementById('p2div').hidden = false;
document.getElementById('p2name').hidden = false; */

//p1.turn = true;
    setTimeout(function(){
        if(playMode == 'vsMan')
        {
        document.getElementById('pturn').innerHTML = "Player 1 turn";
        }
        else
        {
            document.getElementById('pturn').innerHTML = "AI's turn";
        }
    },3500);
    }
 
}

/**
 * Sets the AI ships by random placement
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */ 
function setAIShips(p2)
{
    p2.initboard();
    console.log("setting AI ships");
    var chars = "HV";
    while(p2Ships != this.totalShips)
    {
        if(p2Ships == 0)
        {
            let x = (Math.ceil(9 * Math.random()));
            let y = (Math.ceil(9 * Math.random())); 
            let o = chars.charAt(Math.floor(2*Math.random()));
            p2S1.setX(x);
            p2S1.setY(y);
            p2S1.setOrientation(o);
            p2S1.setShip2(p2);
        }
        if(this.totalShips >= 2 && p2Ships == 1)
        {
            validPlacements = false;
            while(validPlacements == false)
            {
                let x = (Math.ceil(9 * Math.random()));
                let y = (Math.ceil(9 * Math.random())); 
                let o = chars.charAt(Math.floor(2*Math.random()));
                p2S2.setX(x);
                p2S2.setY(y);
                p2S2.setOrientation(o);
                p2S2.setShip2(p2);
            }
        }
        if(this.totalShips >= 3 && p2Ships == 2)
        {
            validPlacements = false;
            while(validPlacements == false)
            {
                let x = (Math.ceil(9 * Math.random()));
                let y = (Math.ceil(9 * Math.random())); 
                let o = chars.charAt(Math.floor(2*Math.random()));
                p2S3.setX(x);
                p2S3.setY(y);
                p2S3.setOrientation(o);
                p2S3.setShip2(p2);
            }
        }
        if(this.totalShips >= 4 && p2Ships == 3)
        {
            validPlacements = false;
            while(validPlacements == false)
            {
                let x = (Math.ceil(9 * Math.random()));
                let y = (Math.ceil(9 * Math.random())); 
                let o = chars.charAt(Math.floor(2*Math.random()));
                p2S4.setX(x);
                p2S4.setY(y);
                p2S4.setOrientation(o);
                p2S4.setShip2(p2);
            }
        }
        if(this.totalShips == 5 && p2Ships == 4)
        {
            validPlacements = false;
            while(validPlacements == false)
            {
                let x = (Math.ceil(9 * Math.random()));
                let y = (Math.ceil(9 * Math.random())); 
                let o = chars.charAt(Math.floor(2*Math.random()));
                p2S5.setX(x);
                p2S5.setY(y);
                p2S5.setOrientation(o);
                p2S5.setShip2(p2);
            }
        }
    }
    document.getElementById('p2div').hidden = true;
}

/**
 * get the hit coordinates and set for each player
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None
 */
function getHit(){
    if(p1.turn){
        p1.setHitX(document.getElementById('hitX').value);
        p1.setHitY(document.getElementById('hitY').value);
    }
    else{
        p2.setHitX(document.getElementById('hitX').value);
        p2.setHitY(document.getElementById('hitY').value);
        
    }
    
}

/**
 * Calculates whether or not a player has won and now it is game over
 * @pre There Exists boards with markings
 * @post Figures out if a players ships have all been destroyed which means game over
 * @param p1 player 1's board
 * @param p2 player 2's board 
 * @throws None
 * @return true if all of a player's ships has been destroyed and false otherwise
 */
function gameOver(p1,p2)
{
    if(p1.shipsDestroyed())
    {
        return(true); 
    }
    else if(p2.shipsDestroyed(1))
    {
        return(true); 
    }
    else 
    {
        return(false); 
    }
}

function checkSunk(x,y) {
	//if()
}

/**
 * control what happens for after we hit the ship
 * @pre None
 * @post None
 * @param None
 * @throws None
 * @returns None
 */
function hitShip(){
	//console.log("Player 1: " + score1 + "\nPlayer 2: "+ score2);
    updateCopies(p1.board, p2.board);

        if(p1.turn && validShot){
            p1.setHitX(document.getElementById('hitX').value);
            p1.setHitY(document.getElementById('hitY').value);
            xchar = converttoLetter(p1.hitX);
            
            if(p2.checkBoard(p1.hitX,p1.hitY)){
                alert("Ship hit at [" + xchar + ", " + p1.hitY + "]");
                p2.shipHit(p1.hitX,p1.hitY);
                hitScore1 += 1;
            
            }else{
                
                p2.shipHit(p1.hitX,p1.hitY);
				if(validShot)
				{
                alert("Miss at [" + xchar + ", " + p1.hitY + "]\nBetter luck next time!");
				}
            }
            updateCopies(p1.board, p2.board);
            scoreUpdate(); 
            if(validShot)
            {
                p1.turn = false;
                p2.turn = true;
                if(playMode == 'vsMan')
                {
                    document.getElementById('pturn').innerHTML = "Player 2 turn";
                }
                else{
                    document.getElementById('pturn').innerHTML = "AI's turn";
                }
            //updateCopies(p1.board, p2.board);

            // document.getElementById('p1div').hidden = true; // hides the table
            if(gameOver(p1,p2) == true)
            {
                document.getElementById('p1Board').hidden = true;
                document.getElementById('p2copy').hidden = true;
                document.getElementById('p2Board').hidden = true;
                document.getElementById('p1copy').hidden = true;
                document.getElementById('game-Over').hidden = false;
                document.getElementById('attack').hidden = true;
                document.getElementById('p1win').hidden = false;
                document.getElementById('p2win').hidden = true;
                document.getElementById('aiwin').hidden = true;
                prettyPrint(p1,"p1FB");
                prettyPrint(p2,"p2FB");

            }
            else{
            setTimeout(function() {
            if(difficulty == "Easy")
                {
                    setTimeout(function(){easyMode();},3000);
                    console.log('AI Shooting');
                }
            else if(difficulty == "Medium")
                {
                    setTimeout(function(){mediumMode();},3000);
                    console.log('AI Shooting');
                }
            else if(difficulty == "Hard")
                {
                    setTimeout(function(){hardMode();},3000);
                    console.log('AI Shooting');
                }
                if(playMode == 'vsMachine')
                {
                    document.getElementById('p1Board').hidden = true;
                    document.getElementById('p2copy').hidden = true;  
                }
                else
                {
                    document.getElementById('p1Board').hidden = true;
                    document.getElementById('p2copy').hidden = true;
                    document.getElementById('p2Board').hidden = false;
                    document.getElementById('p1copy').hidden = false;
                    prettyPrint(p2,"p2BView");
                    prettyPrint(copy1, "p2CView");
                }
            }, 5000);

        }
        
        }
		validShot = true;
         

        }else if(!p1.turn && validShot){
            if(playMode != "vsMachine"){
                p2.setHitX(document.getElementById('hitX').value);
                p2.setHitY(document.getElementById('hitY').value);
                xchar = converttoLetter(p2.hitX);
                console.log(p2.hitX,p2.hitY);
                if(p1.checkBoard(p2.hitX,p2.hitY)){
                    alert("Ship hit at [" + xchar + ", " + p2.hitY + "]");
                    p1.shipHit(p2.hitX,p2.hitY);
                    hitScore2 += 1;

                }else{
                    p1.shipHit(p2.hitX,p2.hitY);
					if(validShot)
					{
                    alert("Miss at [" + xchar + ", " + p2.hitY + "]\nBetter luck next time!");
					}
                }
                updateCopies(p1.board, p2.board);
                scoreUpdate(); 
                if(validShot)
                {
                p1.turn = true;
                p2.turn = false;
                document.getElementById('pturn').innerHTML = "Player 1 turn";
                //document.getElementById('p1div').hidden = false; // hides the table
                if(gameOver(p1,p2) == true)
                { 
                    document.getElementById('p1Board').hidden = true;
                    document.getElementById('p2copy').hidden = true;
                    document.getElementById('p2Board').hidden = true;
                    document.getElementById('p1copy').hidden = true;
                    document.getElementById('game-Over').hidden = false;
                    document.getElementById('attack').hidden = true;
                    document.getElementById('p1win').hidden = true;
                    if(playMode == 'vsMan')
                    {
                        document.getElementById('p2win').hidden = false;
                    }
                    prettyPrint(p1,"p1FB");
                    prettyPrint(p2,"p2FB");
                }
                else{
                    setTimeout(function() {
                        document.getElementById('p1Board').hidden = false;
                        document.getElementById('p2copy').hidden = false;
                        document.getElementById('p2Board').hidden = true;
                        document.getElementById('p1copy').hidden = true;
                        prettyPrint(p1,"p1BView");
                        prettyPrint(copy2, "p1CView");
                    }, 5000);
                }
            }
            validShot = true;   
            }
        }

        updateCopies(p1.board, p2.board);
        document.getElementById('hitX').value = "";
        document.getElementById('hitY').value = "";
}

/**
 * Defines how the easy AI is to shoot player one's board
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function easyMode() {
     let x = Math.ceil(Math.random() * 9); //randomly get number 0-9
     let y = Math.ceil(Math.random() * 9);
        p2.setHitX(x);
        p2.setHitY(y);
        xchar = converttoLetter(x);
        if(p1.checkBoard(p2.hitX,p2.hitY)){
            alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
            p1.shipHit(p2.hitX,p2.hitY);
            //copy1.shipHit(p2.hitX,p2.hitY);
        }
        else
        {
            //p1.shipMiss(p2.hitX, p2.hitY);
            p1.shipHit(p2.hitX,p2.hitY);
            alert("AI Missed at [" + xchar + ", " + p2.hitY + "]");
        }
        if(validShot)
        {
            p1.turn = true;
            p2.turn = false;
            document.getElementById('pturn').innerHTML = "Player 1 turn";
            //document.getElementById('p1div').hidden = false; // hides the table
            if(gameOver(p1,p2) == true)
            { 
                document.getElementById('p1Board').hidden = true;
                document.getElementById('p2copy').hidden = true;
                document.getElementById('p2Board').hidden = true;
                document.getElementById('p1copy').hidden = true;
                document.getElementById('game-Over').hidden = false;
                document.getElementById('attack').hidden = true;
                document.getElementById('p1win').hidden = true;
                document.getElementById('p2win').hidden = true;
                document.getElementById('aiwin').hidden = false;
                prettyPrint(p1,"p1FB");
                prettyPrint(p2,"p2FB");
            }
            else{
                setTimeout(function() {
                    document.getElementById('p1Board').hidden = false;
                    document.getElementById('p2copy').hidden = false;
                    document.getElementById('p2Board').hidden = true;
                    document.getElementById('p1copy').hidden = true;
                    prettyPrint(p1,"p1BView");
                    prettyPrint(copy2, "p1CView");
                }, 5000);
            }
        }
    p2.turn = false;
    p1.turn = true;
}

var lastx = [];
var lasty = [];

/**
 * Defines how the medium AI is to shoot player one's board
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function mediumMode() {
    console.log(lastx);
    if(lastx.length != 0)
    {
        console.log(lastx + "for orthogonal");
        orthogonal(lastx[0],lasty[0]);
        console.log(firedX);
        console.log(firedY);
    }
    else
    {
        let mx = Math.ceil(Math.random() * 9); //randomly get number 0-9
        let my = Math.ceil(Math.random() * 9); 

       if(firedX.length > 0){
            console.log("more fire!");
            for (let i = 0; i < firedX.length; i++){
                console.log("loop fire....");
                if(mx == firedX[i] && my == firedY[i]){
                    console.log("used (" + mx + ", " + my + ")");
                    mx = Math.ceil(Math.random() * 9); //randomly get number 0-9
                    my = Math.ceil(Math.random() * 9); 
                }
            }
        }
        
        p2.setHitX(mx);
        p2.setHitY(my);
        firedX.push(mx);
        firedY.push(my);
        console.log(firedX);
        console.log(firedY);

        xchar = converttoLetter(mx);
        if(p1.checkBoard(p2.hitX,p2.hitY)){
            lastx.push(mx);
            lasty.push(my);
            alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
            p1.shipHit(p2.hitX,p2.hitY);
            //copy1.shipHit(p2.hitX,p2.hitY);
        }
        else
        {
            //p1.shipMiss(p2.hitX, p2.hitY);
            p1.shipHit(p2.hitX,p2.hitY);
            alert("AI missed at [" + xchar + ", " + p2.hitY + "]");
            }
    }
    if(validShot)
    {
        p1.turn = true;
        p2.turn = false;
        document.getElementById('pturn').innerHTML = "Player 1 turn";
        //document.getElementById('p1div').hidden = false; // hides the table
        if(gameOver(p1,p2) == true)
        { 
            document.getElementById('p1Board').hidden = true;
            document.getElementById('p2copy').hidden = true;
            document.getElementById('p2Board').hidden = true;
            document.getElementById('p1copy').hidden = true;
            document.getElementById('game-Over').hidden = false;
            document.getElementById('attack').hidden = true;
            document.getElementById('p1win').hidden = true;
            document.getElementById('p2win').hidden = false;
            prettyPrint(p1,"p1FB");
            prettyPrint(p2,"p2FB");
        }
        else{
            setTimeout(function() {
                document.getElementById('p1Board').hidden = false;
                document.getElementById('p2copy').hidden = false;
                document.getElementById('p2Board').hidden = true;
                document.getElementById('p1copy').hidden = true;
                prettyPrint(p1,"p1BView");
                prettyPrint(copy2, "p1CView");
            }, 2000);
        }
    }
    p2.turn = false;
    p1.turn = true;
}


/**
 * Defines how the hard AI is to shoot player one's board
 * @pre None
 * @post None
 * @param None 
 * @throws None
 * @return None
 */
function hardMode() {
    var hx = 0;
    var hy = 0;
    for (let i = 1; i < 10; i++){
        for (let j = 1; j < 10; j++){
            if(p1.board[i][j] == 'S'){
                console.log(hx);
                console.log(hy);
                hx = j;
                hy = i;
                break;
            }
        }
    }
    console.log(hx + "+" + hy);
       p2.setHitX(hx);
       p2.setHitY(hy);
       xchar = converttoLetter(hx);
       if(p1.checkBoard(p2.hitX,p2.hitY)){
           alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
           p1.shipHit(p2.hitX,p2.hitY);
           //copy1.shipHit(p2.hitX,p2.hitY);
       }
       else
       {
           //p1.shipMiss(p2.hitX, p2.hitY);
           p1.shipHit(p2.hitX,p2.hitY);
           alert("AI Misses at [" + xchar + ", " + p2.hitY + "]");
       }
       if(validShot)
       {
           p1.turn = true;
           p2.turn = false;
           document.getElementById('pturn').innerHTML = "Player 1 turn";
           //document.getElementById('p1div').hidden = false; // hides the table
           if(gameOver(p1,p2) == true)
           { 
               document.getElementById('p1Board').hidden = true;
               document.getElementById('p2copy').hidden = true;
               document.getElementById('p2Board').hidden = true;
               document.getElementById('p1copy').hidden = true;
               document.getElementById('game-Over').hidden = false;
               document.getElementById('attack').hidden = true;
               document.getElementById('p1win').hidden = true;
               document.getElementById('p2win').hidden = true;
               document.getElementById('aiwin').hidden = false;
               prettyPrint(p1,"p1FB");
               prettyPrint(p2,"p2FB");
           }
           else{
               setTimeout(function() {
                   document.getElementById('p1Board').hidden = false;
                   document.getElementById('p2copy').hidden = false;
                   document.getElementById('p2Board').hidden = true;
                   document.getElementById('p1copy').hidden = true;
                   prettyPrint(p1,"p1BView");
                   prettyPrint(copy2, "p1CView");
               }, 5000);
           }
       }
    p1.turn = true;
    p2.turn = false;
}

var right = false;
var left = false;
var up = false;
var down = false;

/**
 * Defines how the medium AI is to shoot orthogonally if there is a hit
 * @pre None
 * @post None
 * @param x last x coordinate that was a hit
 * @param y last y coordinate that was a hit 
 * @throws None
 * @return None
 */
function orthogonal(x,y)
{
    if (right == false )
    {
        let x = lastx[0] + 1;
        let y = lasty[0];
        if(lastx[0] != 9 &&  p1.board[y][x] != boom)
        {
            p2.setHitX(x);
            p2.setHitY(y);
            xchar = converttoLetter(x);
            if(p1.checkBoard(p2.hitX,p2.hitY)){
                    lastx.push(x);
                    lasty.push(y);
                    alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
                    p1.shipHit(p2.hitX,p2.hitY);
                    //copy1.shipHit(p2.hitX,p2.hitY);
            }
            else
            {
                //p1.shipMiss(p2.hitX, p2.hitY);
                p1.shipHit(p2.hitX,p2.hitY);
                alert("AI missed at [" + xchar + ", " + p2.hitY + "]");
            }
            right = true;
            firedX.push(x);
            firedY.push(y);
        }
        else if (p1.board[y][x] == boom || p1.board[y][x] == '0' || lastx[0] == 9)
        {
            right = true;
            mediumMode();
        }
    }
    else if (left == false)
    {
        let x = lastx[0] - 1;
        let y = lasty[0];
        if(lastx[0] != 1 &&  p1.board[y][x] != boom)
        {
            p2.setHitX(x);
            p2.setHitY(y);
            xchar = converttoLetter(x);
            if(p1.checkBoard(p2.hitX,p2.hitY)){
                lastx.push(x);
                lasty.push(y);
                alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
                p1.shipHit(p2.hitX,p2.hitY);
                //copy1.shipHit(p2.hitX,p2.hitY);
            }
            else
            {
                //p1.shipMiss(p2.hitX, p2.hitY);
                p1.shipHit(p2.hitX,p2.hitY);
                alert("AI missed at [" + xchar + ", " + p2.hitY + "]");
            }
            left = true;
            firedX.push(x);
            firedY.push(y);
        }
        else if (p1.board[y][x] == boom || p1.board[y][x] == '0' || lastx[0] == 1)
        {
            left = true
            mediumMode();
        }
    }
    else if (down == false)
    {
        let x = lastx[0];
        let y = lasty[0] + 1;
        if(lasty[0] != 9 &&  p1.board[y][x] != boom)
        {
            p2.setHitX(x);
            p2.setHitY(y);
            xchar = converttoLetter(x);
            if(p1.checkBoard(p2.hitX,p2.hitY)){
                lastx.push(x);
                lasty.push(y);
                alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
                p1.shipHit(p2.hitX,p2.hitY);
                //copy1.shipHit(p2.hitX,p2.hitY);
            }
            else
            {
                //p1.shipMiss(p2.hitX, p2.hitY);
                p1.shipHit(p2.hitX,p2.hitY);
                alert("AI missed at [" + xchar + ", " + p2.hitY + "]");
            }
            down = true;
            firedX.push(x);
            firedY.push(y);
        }
        else if (p1.board[y][x] == boom || p1.board[y][x] == '0' || lasty[0] == 9 )
        {
            down = true;
            mediumMode();   
        }
    }
    else if (up == false)
    {
        let x = lastx[0];
        let y = lasty[0] - 1;
        if(lasty[0] != 1 &&  p1.board[y][x] != boom)
        {
            p2.setHitX(x);
            p2.setHitY(y);
            xchar = converttoLetter(x);
            if(p1.checkBoard(p2.hitX,p2.hitY)){
                lastx.push(x);
                lasty.push(y);
                alert("AI hit a ship at [" + xchar + ", " + p2.hitY + "]");
                p1.shipHit(p2.hitX,p2.hitY);
                //copy1.shipHit(p2.hitX,p2.hitY);
            }
            else
            {
                //p1.shipMiss(p2.hitX, p2.hitY);
                p1.shipHit(p2.hitX,p2.hitY);
                alert("AI missed at [" + xchar + ", " + p2.hitY + "]");
            }
            up = true;
            firedX.push(x);
            firedY.push(y);
        }
        else if (p1.board[y][x] == boom || p1.board[y][x] == '0' || lasty[0] == 1)
        {
            up = true;
            mediumMode(); 
        }
    }
    else if ( right && left && up && down)
    {
        right = false;
        left = false;
        up = false;
        down = false;
        console.log(lastx);
        lastx.shift();
        lasty.shift();
        console.log(lastx);
        console.log('reset');
        mediumMode();
    }
}