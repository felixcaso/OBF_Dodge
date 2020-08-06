//Game variables
var startGame = true;
var score;
var noteCounter=1;
var notes; //Note Sprite Group
var player; //Player Object
var enemy; //Enemy Object/
var monoSynth;//Synth object
var music; //  backgound music Object
var musicButton;

//Borders to falling line with backGround
var leftWall = 330;
var rightWall = 1050;
var dropLines = [330,510,690,870,1050];

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

    //Background music
    music = loadSound('jeopardy.mp3');

    //Fonts
    OPEN_SANS_LIGHT = loadFont('Fonts/OpenSans-Light.ttf');
    PLAY_FAIR_DISPLAY_BOLD = loadFont('Fonts/PlayfairDisplay-Bold.ttf');
}

function setup() {
    // var btnCol = color(235,81,15,60);

    //Create Canvas
    createCanvas(windowWidth,windowHeight);
    // musicButton = createButton('Play Background Music');
    // musicButton.mouseClicked(playMusic);
    // musicButton.size(120,75);
    // musicButton.position(1235,130);
    // musicButton.style('background-color',btnCol);
    // musicButton.style("font-family", "Bodoni");
    // musicButton.style("font-size", "14px");
    //cursor('NONE');



    
    //Group of Dropping note
    notes = new Group();
    //inital note
    newNote(noteCounter);
    // Enemy Sprite
    newEnemy();
    
    //Creating Player sprite 
    player = new Player(690,windowHeight-100,10,10,playerImg);
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

        fill(0);
        strokeWeight(10);
        line(330,0,330,windowHeight);
        line(510,0,510,windowHeight);
        line(690,0,690,windowHeight);
        line(870,0,870,windowHeight);
        line(1050,0,1050,windowHeight);

        setText(); // Settiing Iymanni's Logo && Instructions && Score

        //Increase score every 60s and drop new note
        if(frameCount % 20 == 0){
            score++;
            noteCounter++;
            newNote(noteCounter);
        }

        //Sprite  movement
        for(var i=0; i<notes.length; i++) {
            var s = notes[i];
            //s.collide(player,lose);
            if(s.position.y> height+10) {
                s.changeImage('enemy')
                s.position.y = random(-200,-100);
                s.scale = random(.2,.5);
                s.position.x = random(dropLines);
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
        score = 0;
    }
    else if(keyCode === LEFT_ARROW){
        Player.playerSprite.position.x =  Player.playerSprite.position.x - 180;
    }
    else if(keyCode === RIGHT_ARROW){
        Player.playerSprite.position.x =  Player.playerSprite.position.x + 180;
    }

}

function lose(){
    //Losing display
    background(235,81,15);
    music.stop();
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
    if(n<4){
        var note = createSprite(random(dropLines),random(-300,-100),70,70);
        note.scale = random(.2,.3);
        note.setVelocity(0,random(3,10));
        note.debug = true;
        note.setDefaultCollider();
        note.addImage('note'+n,random(noteImg));
        notes.add(note);
    }

}

function newEnemy(){
    enemy = createSprite(random(dropLines),random(-300,-100),20,30);
    enemy.scale = random(.2,.4);
    enemy.setVelocity(0,random(3,10));
    enemy.debug=true;
    enemy.addImage('enemy',cleftImg);
    notes.add(enemy);
}

class Player{
    //Player constructor to creater player Sprite
    constructor(xPos,yPos,w,h,img){
        this.playerSprite = createSprite(xPos,yPos,w,h);
        this.playerSprite.scale = .1; 
        this.playerSprite.debug = true;
        this.playerSprite.addImage('player',img);
        this.playerSprite.setCollider ('rectangle',this.playerSprite.position.x/2,this.playerSprite.position.y/2,1000,2500);

        this.playerSprite.position.x = xPos;
    }    
    move(){
        if(keyCode === LEFT_ARROW){
            this.playerSprite.position.x =  this.playerSprite.position.x - 180;
        }
        if(keyCode === RIGHT_ARROW){
            this.playerSprite.position.x =  this.playerSprite.position.x + 180;
        }

        this.playerSprite.position.x = constrain(this.playerSprite.position.x,leftWall,rightWall);
        //this.playerSprite.collide(enemy,lose);

    }
}


