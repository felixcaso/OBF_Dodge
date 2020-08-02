//Game variables
var startGame = true;
var score;
var noteCounter=1;
var notes; //Sprite Group
var player; //Player Object
var enemy; //Enemy Object

//Borders to falling line with backGround
var leftWall = 370; 
var rightWall = 1010;

//Images Variables
var bgImg;
var cleftImg;
var noteImg = [];
var playerImg;

//Fonts
var OPEN_SAN_LIGHT;
var PLAY_PAIR_DISPLAY_BOLD;

//Preloading Images
function preload(){
    //Images
    for(var i=0; i<3;i++){
        noteImg[i] = loadImage('Images/musicNote'+i+'.png');
    }  
    bgImg = loadImage('Images/bg2.jpg');
    cleftImg = loadImage('Images/clef.png')
    playerImg = loadImage('Images/player.png');

    //Fonts
    OPEN_SANS_LIGHT = loadFont('Fonts/OpenSans-Light.ttf');
    PLAY_FAIR_DISPLAY_BOLD = loadFont('Fonts/PlayfairDisplay-Bold.ttf');
}

function setup() {
    //Create Canvas
    createCanvas(windowWidth,windowHeight);
    cursor('NONE');
    
    //Group of Dropping note
    notes = new Group();

    //inital note
    newNote(noteCounter);

    // Enemy Sprite
    newEnemy();
    
    //Creating Player sprite 
    player = new Player(mouseX,windowHeight-100,10,10,playerImg);
    startGame = true;
    score = 0;
}//end setup

function setText(){
    //Instructions
    strokeWeight(0);
    textSize(16);
    textStyle(BOLD);
    textFont(PLAY_FAIR_DISPLAY_BOLD);

    //fill(235,81,15); //OBF color (red-oraange)
    fill(0);
    text("OBF-Dodge The Trebel-Clef ", 830,15);
    text('Last As Long As You Can!',830,40);
    fill(150);
    //text('('+mouseX+','+mouseY+')', 900,300);

    // Iymanni's Logo
    fill(255);
    ellipse(1300,55,110);
    fill(0);
    textSize(50)
    textStyle(NORMAL);
    text("iah",1265,70);

    //Display Score
    textSize(50);
    textAlign(LEFT,TOP);
    fill(235,81,15);
    text('Score: '+score,10,35);
}

function draw() {
    if(startGame){
        //Background
        background(bgImg);
        setText(); // Settiing Iymanni's Logo && Instructions && Score

        //Increase score every 60s and drop new note
        if(frameCount %20 == 0){
            score++;
            noteCounter++;
            newNote(noteCounter);
        }

        //Sprite  movement
        for(var i=0; i<allSprites.length; i++) {
            var s = allSprites[i];
            if(s.position.y> height+10) {
                s.position.y = random(-200,-100);
                s.scale = random(.2,.4);
                s.position.x = random(leftWall,rightWall);
                s.setVelocity(0,random(7,20));
            }
        }
        //Draw sprites
        drawSprites();
        player.move();
    }
    
}

function keyPressed(){
    if(!startGame){
        noteCounter = 1;
        newNote(noteCounter)
        newEnemy();
        startGame = true;
    }
}

function lose(){
    //Losing display
    background(235,81,15);
    startGame = false;
    notes.removeSprites();

    textSize(50);
    fill(0);
    text('Score: '+score,450,300);
    text('Press any Key to restart',450,400);

    // Iymanni's Logo
    fill(255);
    ellipse(1300,55,110);
    fill(0);
    textSize(50)
    textStyle(NORMAL);
    text("iah",1265,20);
}

function newNote(n){
    if(n<7){
        var note = createSprite(random(leftWall,rightWall),random(-300,-100),50,50);
        note.scale = random(.1,.3);
        note.setVelocity(0,random(3,10));
        note.debug = true;
        note.addImage(random(noteImg));
        notes.add(note);
    }

}

function newEnemy(){
    enemy = createSprite(random(leftWall,rightWall),random(-300,-100),10,10);
    enemy.scale = random(.1,.4);
    enemy.setVelocity(0,random(3,10));
    enemy.debug=true;
    enemy.addImage(cleftImg);
    notes.add(enemy);
}

class Player{
    //Player constructor to creater player Sprite
    constructor(xPos,yPos,w,h,img){
        this.playerSprite = createSprite(xPos,yPos,w,h);
        this.playerSprite.scale = .1; 
        this.playerSprite.debug = true;
        this.playerSprite.addImage('player',img);
        this.playerSprite.setCollider ('rectangle',mouseX/2,mouseY/2,1000,2500);
    }    
    move(){
        
        this.playerSprite.position.x = constrain(mouseX,370,1010);
        this.playerSprite.collide(enemy,lose);
//
    }
}

