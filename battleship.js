//var canvas = document.getElementById("canvas");
//var c = canvas.getContext("2d");

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
        
    }
    initboard(){
        this.hitX = -1;
        this.hitY = -1;
        this.turn = false;
        this.height = 9;
        this.width = 9;
        this.board = [];
        for (let i=0;i<9;i++){
			this.board[i] = [];
			for (let j = 0;j<9;j++){
                this.board[i][j] = 0; // 0 represents water
                console.log("Board initialized");
			}
		}
    }

    /**
 * checks if the input coordinates are within the range 
 * @param {Number} - x - X coordinate 
 * @param {Number} - y - Y coordinate 
 * @param {Number} - t - type  
 */
    checkCoord(x,y=0,t=0){
        if(t==0){
            console.log("Checking only 1 coord");
            if(!(x < this.height && x < this.width)){
                return false;
            }
        }else{
            console.log("Checking 2 coords");
        // Check within board, return false if not
            if(!((x < this.height && x < this.width) && (y < this.height && y < this.width))){
                console.log("NOT WITHIN THE BOARD");
                return false;
            }
            // If its within the board, ship exists? return false if 1 
            if(this.board[x][y] == 1 ){
                console.log("SHIP EXISTS");
                return false;
            }
        }
        return true;
    }

/**
 * sets the hit x coordinate 
 * @param {Number} - x - The X coordinate to hit  
 */
    setHitX(x){
        if(this.checkCoord(x)){
            this.hitX = parseInt(x);
        }
        else{
            return false;
        }
        
    }

/**
* sets the hit  y coordinate  
* @param {Number} - x - The Y coordinate to hit  
*/
    setHitY(y){
        if(this.checkCoord(y)){
            this.hitY = parseInt(y);
        }
        else{
            return false;
        }
            
    }

/**
 * adds ship to the grid 
 * @param {Number} x - x coordinate of the borad
 * @param {Number} y - y coordinate of the board
 * @param {Number} t - type of the ship
 */
    addShip(x,y,t){
        console.log("ADDING SHIP");
        if(this.checkCoord(x,y,1)){
            this.board[x][y] = t;
            console.log("done");
        }
    }

/**
 * checks the board for placed ships 
 * @param {Number} - x - The X coordinate of the board
 * @param {Number} - y - The Y coordinate of the board 
 */
    checkBoard(x,y){
        if(this.board[x][y] == 1 || this.board[x][y] == 2 || this.board[x][y] == 3 || this.board[x][y] == 4 || this.board[x][y] == 5){
            return true;
        }else{
            return false;
        }
    }

/**
 * if the ship is hit change the grid position to 9 
 * @param {Number}-  x - X coordinate of the board
 * @param {Number}- y - Y coordinate of the board  
 */
    shipHit(x,y){
        if(this.board[x][y] == 6 || this.board[x][y] == 7)
        {
            alert("Index has already been fired at"); 
        }
        else 
        {
            this.board[x][y] = 7; 
            alert("HIT AT " + x + " " + y); 
        }

    }

    /**
 * if the ship is missed change the grid position to 6 
 * @param {Number}-  x - X coordinate of the board
 * @param {Number}- y - Y coordinate of the board  
 */
    shipMiss(x,y)
    {
        if(this.board[x][y] == 6 || this.board[x][y] == 7)
        {
            alert("Index has already been fired at");
        }
        else{
            this.board[x][y] = 6; 
            alert("MISS AT " + x + " " + y);
        }

    }

    shipIsDestroyed(shipType)
    {
        let destroyed = false; 
        for(let i = 0; i < 9; i++)
        {
            for(let j = 0; j < 9; j++)
            {
                if(this.board[i][j] == shipType) //checks every indicie to see if the ship is still there
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
    setShip(player){
        if (this.size == 1){
            player.addShip(this.xCoord,this.yCoord,this.type);
        }
        else {
            if(this.orien == "H"){
                    for(let i = 0; i < this.size; i++)
                {
                    player.addShip(this.xCoord,this.yCoord+i,this.type);
                }
            }
            else if (this.orien == "V"){
                for(let i = 0; i < this.size; i++)
                {
                    player.addShip(this.xCoord + i,this.yCoord,this.type);
                }
            }
        
        }
        
    }

}

let p1 = new Board();
let p2 = new Board();

p1.initboard();
p2.initboard();

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


/**
 * Print function 
 * @param {Object}  - player - player object is the instance of board class 
 * @param {Number} - t - the type of the ship 
 */
function prettyPrint(player,t){
    console.log("Pretty printing");
    printThis = ""
    for(var i = 0; i < player.height; i++){
        printThis += " X" + i + " : ";
        for(var j = 0; j < player.width; j++){
            printThis += "&nbsp" + player.board[i][j] + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";   
        }
        printThis += "<br>";
    }
    printThis += "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
    for(var i = 0; i < player.width; i++){
        printThis += " Y" + i + "&nbsp&nbsp&nbsp"
    }
    document.getElementById(t).innerHTML = printThis;
}

prettyPrint(p1,"p1div");
prettyPrint(p2,"p2div");


/**
 * The function sets the different variables available to the board class after taking inputs for player 1
 */
function formUpdate(){
    p1S1.setX(document.getElementById('S1X').value);
    document.getElementById('S1X').disabled = true;
    p1S1.setY(document.getElementById('S1Y').value);
    p1S1.setOrientation(document.getElementById('S1Orien').value);
    
    p1S2.setX(document.getElementById('S2X').value);
    p1S2.setY(document.getElementById('S2Y').value);
    p1S2.setOrientation(document.getElementById('S2Orien').value);

    p1S3.setX(document.getElementById('S3X').value);
    p1S3.setY(document.getElementById('S3Y').value);
    p1S3.setOrientation(document.getElementById('S3Orien').value);

    p1S4.setX(document.getElementById('S4X').value);
    p1S4.setY(document.getElementById('S4Y').value);
    p1S4.setOrientation(document.getElementById('S4Orien').value);

    p1S5.setX(document.getElementById('S5X').value);
    p1S5.setY(document.getElementById('S5Y').value);
    p1S5.setOrientation(document.getElementById('S5Orien').value);

}

/**
 * The function sets the different variables available to the board class after taking inputs for player 2
 * 
 */

function formUpdate1(){
    p2S1.setX(document.getElementById('2S1X').value);
    p2S1.setY(document.getElementById('2S1Y').value);
    p2S1.setOrientation(document.getElementById('2S1Orien').value);
    
    p2S2.setX(document.getElementById('2S2X').value);
    p2S2.setY(document.getElementById('2S2Y').value);
    p2S2.setOrientation(document.getElementById('2S2Orien').value);

    p2S3.setX(document.getElementById('2S3X').value);
    p2S3.setY(document.getElementById('2S3Y').value);
    p2S3.setOrientation(document.getElementById('2S3Orien').value);

    p2S4.setX(document.getElementById('2S4X').value);
    p2S4.setY(document.getElementById('2S4Y').value);
    p2S4.setOrientation(document.getElementById('2S4Orien').value);

    p2S5.setX(document.getElementById('2S5X').value);
    p2S5.setY(document.getElementById('2S5Y').value);
    p2S5.setOrientation(document.getElementById('2S5Orien').value);

}

/**
 * sets ship for player 1 
 */
function setShipsP1(){

    console.log("setting p1");
    
    p1S1.setShip(p1);
    p1S2.setShip(p1);
    p1S3.setShip(p1);
    p1S4.setShip(p1);
    p1S5.setShip(p1);
    
    prettyPrint(p1,"p1div");
    document.getElementById('p1data').hidden = true;
    document.getElementById('p1div').hidden = true;
    document.getElementById('p1name').hidden = true; 
    
}
/**
 * sets the ship for player 2 
 */
function setShipsP2(){
    
    console.log("setting p2")
    
    p2S1.setShip(p2);
    p2S2.setShip(p2);
    p2S3.setShip(p2);
    p2S4.setShip(p2);
    p2S5.setShip(p2);
    

prettyPrint(p2,"p2div");
document.getElementById('p2data').hidden = true;
document.getElementById('p2div').hidden = true;
document.getElementById('p2name').hidden = true; 

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
    if(p1.shipIsDestroyed(1) && p1.shipIsDestroyed(2) && p1.shipIsDestroyed(3) && p1.shipIsDestroyed(4) && p1.shipIsDestroyed(5))
    {
        return(true); 
    }
    else if(p2.shipIsDestroyed(1) && p2.shipIsDestroyed(2) && p2.shipIsDestroyed(3) && p2.shipIsDestroyed(4) && p2.shipIsDestroyed(5))
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
        if(p1.turn){
            // document.getElementById('p1div').hidden = false; // shows the table
            console.log(p1.hitX,p1.hitY);
            if(p2.checkBoard(p1.hitX,p1.hitY)){
                console.log("Ship hit");
                p2.shipHit(p1.hitX,p1.hitY);
            }else{
                p2.shipMiss(p1.hitX, p1.hitY);
                console.log("Better luck next chance!");
            }
            prettyPrint(p2,"p2div");
            p1.turn = false;
            p2.turn = true;

            document.getElementById('pturn').innerHTML = "Player 2 turn";
            // document.getElementById('p1div').hidden = true; // hides the table
            if(gameOver(p1,p2) == true)
            {
                alert("game over"); 
            }

        }else{
            console.log(p2.hitX,p2.hitY);
            if(p1.checkBoard(p2.hitX,p2.hitY)){
                console.log("Ship hit");
                p1.shipHit(p2.hitX,p2.hitY);
            }else{
                p1.shipMiss(p2.hitX, p2.hitY);
                console.log("Better luck next chance!");
            }
            prettyPrint(p1,"p1div");
            p1.turn = true;
            p2.turn = false;

            document.getElementById('pturn').innerHTML = "Player 1 turn";
            document.getElementById('p1div').hidden = true; // hides the table
            if(gameOver(p1,p2) == true)
            {
                alert("game over"); 
            }

        }
        document.getElementById('hitX').value = "";
        document.getElementById('hitY').value = "";
}