//Game variables
var gameStarted = false;
var gameButton;
var score;
var player; //Player object
var notes; //Notes Group

//Borders to falling line with backround(180px div)
var leftString = 330;
var rightString = 1050;
var stringLines = [leftString,570,810,rightString];

//Images Variables
var backgroundImg;
var noteImg = [];
var playerImg;

// //Fonts
var OPEN_SANS_LIGHT;
var PLAY_FAIR_DISPLAY_BOLD;

//Preloading Images
function preload(){
    //Images
    for(var i=0; i<3;i++){
        noteImg[i] = loadImage('Images/musicNote'+i+'.png');
    }
    backgroundImg = loadImage('Images/bg2.jpg');
    playerImg = loadImage('Images/player.png');
    //cleftImg = loadImage('Images/clef.png');

    //Fonts
    OPEN_SANS_LIGHT = loadFont('Fonts/OpenSans-Light.ttf');
    PLAY_FAIR_DISPLAY_BOLD = loadFont('Fonts/PlayfairDisplay-Bold.ttf');
}

function setup() {
    //Create Canvas
    var col = color(235,81,15);
    createCanvas(windowWidth,windowHeight);
    gameButton = createButton('Start Game');
    gameButton.mouseClicked(startGame);
    gameButton.size(120,75);
    gameButton.position(1235,130);
    gameButton.style('background-color',col);
    gameButton.style("font-family", "Bodoni");
    gameButton.style("font-size", "14px");

    notes = new Group();

}

function draw() {
    background(backgroundImg);
    if(gameStarted){
        setText();
        fill(0);
        strokeWeight(10);
        line(570,0,570,windowHeight);
        line(810,0,810,windowHeight);
        if(frameCount % 60 == 0){
            score++;
        }

        //Vertival Note Movement
        for(var i=0; i<notes.length; i++) {
            var s = notes[i];
            if (s.position.y > height + 10) {
                s.position.y = 0
                s.position.x = random(stringLines);
                s.setVelocity(0, 5);
            }
        }

        drawSprites();
    }

}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        player.playerSprite.position.x -= 240;
    } else if (keyCode === RIGHT_ARROW) {
        player.playerSprite.position.x += 240;
    }
    player.playerSprite.position.x =constrain(player.playerSprite.position.x,leftString,rightString);
}

function newNote() {
    var note = createSprite(random(stringLines), 0, 50, 50);
    note.setVelocity(0, 5);
    note.scale = .3;
    note.debug = true;
    note.addImage(random(noteImg));
    notes.add(note);

}

function startGame(){
    if(!gameStarted){
        gameStarted = true;
        score = 0;
        player = new Player(random(stringLines),windowHeight - 100,10,10,playerImg);
        newNote();
    }
}

class Player {
    //Player constructor to creater player Sprite
    constructor(xPos, yPos, w, h, img) {
        this.playerSprite = createSprite(xPos, yPos, w, h);
        this.playerSprite.scale = .1;
        this.playerSprite.debug = true;
        this.playerSprite.addImage('player', img);
    }

}

function setText(){
    //Instructions
    // strokeWeight(0);
    // textSize(16);
    // textStyle(BOLD);
    // textFont(PLAY_FAIR_DISPLAY_BOLD);
    //
    // //fill(235,81,15); //OBF color (red-oraange)
    // fill(0);
    // text("OBF-Dodge The Trebel-Clef ", 830,15);
    // text('Last As Long As You Can!',830,40);

    // Iymanni's Logo
    fill(0);
    ellipse(1300,55,110);
    fill(255);
    textSize(50)
    textStyle(NORMAL);
    text("iah",1265,70);

    //Display Score
    textSize(50);
    textAlign(LEFT,TOP);
    fill(235,81,15);
    text('Score: '+score,10,35);
}