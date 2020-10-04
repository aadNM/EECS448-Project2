var validPlacements;
var validCoords;
var validShot = true;
var p1Ships = 0;
var p2Ships = 0;
function playersSet(){
    var playVS = document.getElementsByName("manVSmachine");

    for(i = 0; i < playVS.length; i++){
        if (playVS[i].checked){
            playMode = playVS[i].value;
        }
    }
    console.log(playMode);
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
function modeSet(){
    var mode = document.getElementsByName("PlayLevel");
    for(i = 0; i < mode.length; i++){
        if (mode[i].checked){
            difficulty = mode[i].value;
        }
    }
    console.log(difficulty);
    document.getElementById("Mode").hidden = true;
    document.getElementById('shipInput').hidden = false;
    if(playMode == "Easy")
    {
        //Assign AI to easy mode or call easy mode function
    }
    else if(playMode == "Medium")
    {
        //Assign AI to medium mode or call medium mode function
    }
    else if (playMode == "Hard")
    {
        //Assign AI to hard mode or call hard mode function
    }

}
function updateCopies(board1, board2){
    for (let i = 1; i < 10; i++){
        for (let j = 1; j < 10; j++){
            if(board1[i][j] == 'S'){
                console.log("stupid");
                copy1.board[i][j] == '~';
            }
            else{
                console.log("stupid2");
                copy1.board[i][j] = board1[i][j];
            }

            if(board2[i][j] == 'S'){
                console.log("stupid3");
                copy2.board[i][j] == '~';
            }
            else{
                console.log("stupid4");
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
        this.totalShips;
        this.turn;
        this.hitX;
        this.hitY;
        this.validNum;
        this.gotShips;
        this.message;
        
    }
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
 * @param {Number} - x - X coordinate 
 * @param {Number} - y - Y coordinate 
 * @param {Number} - t - type  
 */
checkCoord(x,y,t,l,o)
{
    console.log("Checking coords");
    console.log( x + "xval" + y + "yval" + t + "tval" + l + "lval" + o + "oval");
    for (let i = 0; i < l; i++) 
    {
        if(o.toUpperCase() == 'H')
        {
            if((x+l) > 10)
            {
                console.log("Out of bounds (horizontally)")
                return false;
            }
            else if (this.board[y][x+i] != '~')
            {
                console.log("Can't place on another ship");
                return false;
            }
        }
        else
        {
            if((y+l) > 10)
            {
                console.log("Out of bounds (vertically)")
                return false;
            }
            else if (this.board[y+i][x] != '~')
            {
                console.log("Can't place on another ship");
                return false;
            }
        }
        return true;
    }
}

/**
 * sets the hit x coordinate 
 * @param {Number} - x - The X coordinate to hit  
 */
    setHitX(x){
            this.hitX = parseInt(x);
    }
 
/**
* sets the hit  y coordinate  
* @param {Number} - x - The Y coordinate to hit  
*/
    setHitY(y){
            this.hitY = parseInt(y);
    }
 
/**
 * adds ship to the grid 
 * @param {Number} x - x coordinate of the borad
 * @param {Number} y - y coordinate of the board
 * @param {Number} t - type of the ship
 */
    addShip(x,y,t, length, or){
        console.log(or);
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
            validPlacements = true;
        }
        console.log("Hi:"+validPlacements );
    }
 
/**
 * checks the board for placed ships 
 * @param {Number} - x - The X coordinate of the board
 * @param {Number} - y - The Y coordinate of the board 
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
 * @param {Number}-  x - X coordinate of the board
 * @param {Number}- y - Y coordinate of the board  
 */
    shipHit(x,y){
       if(this.board[y][x] == 'X')
        {
            validShot = false;
            alert("Index has already been fired at."); 
        }else if (this.board[y][x] == '~'){
            this.board[y][x] = '0';
            validShot = true;
        }else if (this.board[y][x] == 'S') {
            this.board[y][x] = 'X';
            validShot = true;
            //alert("HIT AT " + x + " " + y); 
        }
    }
 
    /**
 * if the ship is missed change the grid position to 6 
 * @param {Number}-  x - X coordinate of the board
 * @param {Number}- y - Y coordinate of the board  
 */
   /* shipMiss(x,y)
    {
        if(this.board[x][y] == 6 || this.board[x][y] == 7)
        {
            alert("Index has already been fired at");
        }
        else{
            this.board[x][y] = 6; 
           
        }

    }*/

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
 * @param {Number} - x - the X coordinate of the ship   
 */
    setX(x){
        // if()
        this.xCoord = parseInt(x);
       
    }
    /**
 * Sets the Y coordinate of the ship 
 * @param {Number} - y - the Y coordinate of the ship  
 */
    setY(y){
        
        this.yCoord = parseInt(y);
    }
 
/**
 * Sets the ship size and type 
 * @param {Number} -  s - the given of the ship  
 */
    setShipSize(s){
        this.size = parseInt(s);
        this.type = parseInt(s);
    }
/**
 * Sets the orientation of the ship 
 * @param {String} - o - the orientation of the given ship (V/H) 
 */
    setOrientation(o){
        this.orien = o.toUpperCase();
    }
/**
 * Sets the ship to the player
 * @param {Object} - player - the player object the instance of the board class  
 */
    setShip1(player){
        console.log('check');
        console.log(this.orien)
        if (player.checkCoord(this.xCoord, this.yCoord,'S,',this.size, this.orien))
        {
            player.addShip(this.xCoord,this.yCoord,'S', this.size, this.orien);
            p1Ships ++;
            displayShipInputs();
        }  
        else
        {
            validPlacements = false;
        }
    }

    setShip2(player){
        console.log('check');
        console.log(this.orien)
        if (player.checkCoord(this.xCoord, this.yCoord,'S,',this.size, this.orien))
        {
            player.addShip(this.xCoord,this.yCoord,'S', this.size, this.orien);
            p2Ships ++;
            displayShipInputs();
        }  
        else
        {
            validPlacements = false;
        }
    }
}


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
    console.log(p1.turn);
}
 
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
 * @param {Object}  - player - player object is the instance of board class 
 * @param {Number} - t - the type of the ship 
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
 

document.getElementById('Mode').hidden = true;
document.getElementById('shipInput').hidden = true;
document.getElementById('game').hidden = true;
//document.getElementById('game-Over').hidden = true;
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

function convertLetter(letter){
    let num = 0;
    if( letter.toUpperCase() == 'A')
    {
      num = 1;
    }
    else if( letter.toUpperCase() == 'B')
    {
      num = 2;
    }
    else if( letter.toUpperCase() == 'C')
    {
      num = 3;
    }
    else if( letter.toUpperCase() == 'D')
    {
      num = 4;
    }
    else if( letter.toUpperCase() == 'E')
    {
      num = 5;
    }
    else if( letter.toUpperCase() == 'F')
    {
      num = 6;
    }
    else if( letter.toUpperCase() == 'G')
    {
      num = 7;
    }
    else if( letter.toUpperCase() == 'H')
    {
      num = 8;
    }
    else if( letter.toUpperCase() == 'I')
    {
      num = 9;
    }
    else{
      num = 0;
    }
    return (num);
}
/**
 * The function sets the different variables available to the board class after taking inputs for player 1
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
 * 
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
/**
 * sets ship for player 1 
 */
function setShipsP1(){
    console.log("setting p1");
    
    if(p1Ships == 0)
    {
        p1S1.setShip1(p1);
    }
    if(this.totalShips >= 2 && p1Ships == 1)
    {
        p1S2.setShip1(p1);
    }
    if(this.totalShips >= 3 && p1Ships == 2)
    {
        p1S3.setShip1(p1);
    }
    if(this.totalShips >= 4 && p1Ships == 3)
    {
        p1S4.setShip1(p1);
    }
    if(this.totalShips == 5 && p1Ships == 4)
    {
        p1S5.setShip1(p1);
    }
 
    if(validPlacements && p1Ships == totalShips)
    {
        console.log(validPlacements);
        document.getElementById('p1Ships').hidden = true;
        document.getElementById('p1data').hidden = true;
        document.getElementById('p1div').hidden = false;
        prettyPrint(p1,"p1div");
        setTimeout(function() { 
        p1.turn = false;
        p2.turn = true;
        document.getElementById('p1div').hidden = true; 
        displayShipInputs();}, 3000);
    }
    else
    {
        alert("You have an invalid placed ship");
    }
}

/**
 * sets the ship for player 2 
 */
function setShipsP2(){
    
    console.log("setting p2")
    document.getElementById('p1div').hidden = true;
    if(p2Ships == 0)
    {
        p2S1.setShip2(p2);
    }
    if(this.totalShips >= 2 && p2Ships == 1)
    {
        p2S2.setShip2(p2);
    }
    if(this.totalShips >= 3 && p2Ships == 2)
    {
        p2S3.setShip2(p2);
    }
    if(this.totalShips >= 4 && p2Ships == 3)
    {
        p2S4.setShip2(p2);
    }
    if(this.totalShips == 5 && p2Ships == 4)
    {
        p2S5.setShip2(p2);
    }
 
    if(this.validPlacements && p2Ships == totalShips)
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
        console.log("Print");
        document.getElementById('game').hidden = false; 
        document.getElementById('game-Over').hidden = true;
        p2.turn = false;
        p1.turn = true;}, 3000);
    }
/*document.getElementById('p2data').hidden = false;
document.getElementById('p2div').hidden = false;
document.getElementById('p2name').hidden = false; */

p1.turn = true;

document.getElementById('pturn').innerHTML = "Player 1 turn";
 
}
 
/**
 * get the hit coordinates and set for each player
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

/**
 * control what happens for after we hit the ship
 */
function hitShip(){
    updateCopies(p1.board, p2.board);

        if(p1.turn && validShot){
            p1.setHitX(document.getElementById('hitX').value);
            p1.setHitY(document.getElementById('hitY').value);
            console.log(p1.hitX);
            // document.getElementById('p1div').hidden = false; // shows the table
            //alert(p1.hitX,p1.hitY);
            if(p2.checkBoard(p1.hitX,p1.hitY)){
                alert("Ship hit at [" + p1.hitX + ", " + p1.hitY + "]");
                p2.shipHit(p1.hitX,p1.hitY);
                //copy2.shipHit(p1.hitX,p1.hitY)
            }else{
                //p2.shipMiss(p1.hitX, p1.hitY);
                 p2.shipHit(p1.hitX,p1.hitY);
                 if(validShot)
                 {
                    alert("Miss at [" + p1.hitX + ", " + p1.hitY + "]\nBetter luck next chance!");
                 }
                 else
                 {
                     alert("Try again");
                 }
            }
            if(validShot)
            {
                p1.turn = false;
                p2.turn = true;
                document.getElementById('pturn').innerHTML = "Player 2 turn";
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
                prettyPrint(p1,"p1FB");
                prettyPrint(p2,"p2FB");

            }
            else{
            setTimeout(function() {
                document.getElementById('p1Board').hidden = true;
                document.getElementById('p2copy').hidden = true;
                document.getElementById('p2Board').hidden = false;
                document.getElementById('p1copy').hidden = false;
                prettyPrint(p2,"p2BView");
                prettyPrint(copy1, "p2CView");
            }, 3000);
        }
        validShot = true;
        }

            

        }else if(!p1.turn && validShot){
            if(playMode != "vsMachine"){
                p2.setHitX(document.getElementById('hitX').value);
                p2.setHitY(document.getElementById('hitY').value);
                console.log(p2.hitX,p2.hitY);
                if(p1.checkBoard(p2.hitX,p2.hitY)){
                    alert("Ship hit at [" + p2.hitX + ", " + p2.hitY + "]");
                    p1.shipHit(p2.hitX,p2.hitY);
                    //copy1.shipHit(p2.hitX,p2.hitY);
                }else{
                    //p1.shipMiss(p2.hitX, p2.hitY);
                     p1.shipHit(p2.hitX,p2.hitY);
                    alert("Miss at [" + p2.hitX + ", " + p2.hitY + "]\nBetter luck next chance!");
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
                    }, 3000);
                }
            }
            validShot = true;   
            }
        }

        updateCopies(p1.board, p2.board);
        document.getElementById('hitX').value = "";
        document.getElementById('hitY').value = "";
}


//document.addEventListener("DOMContentLoaded", () => {
  //  document.getElementById("game-play").hidden = true;
//});