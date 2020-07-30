var startGame = true;
var score;
var velocity = .7;
var noteCounter;

var leftWall = 370; 
var rightWall = 1010;

var bgImg;
var cleftImg;
var noteImg = [];
var playerImg;

var notes;
var player;
var enemy;


//Preloading Images
function preload(){
    for(var i=0; i<3;i++){
        noteImg[i] = loadImage('Images/musicNote'+i+'.png');
    }  
    bgImg = loadImage('Images/bg2.jpg');
    cleftImg = loadImage('Images/clef.png')
    playerImg = loadImage('Images/player.png');
}

function setup() {
    //Create Canvas
    createCanvas(windowWidth,windowHeight);
    //cursor('NONE');
    
    //Inital Droping note
    notes = new Group();
    
    var note = createSprite(random(leftWall,rightWall),0,10,10);
    note.scale = random(.1,.2);
    note.setVelocity(0,random(3,10));
    note.debug = true;
    note.addImage(random(noteImg));
    notes.add(note);
//    
    //Creating enemy sprite
    enemy = createSprite(random(leftWall,rightWall),0,10,10);
    enemy.scale = random(.1,.4);
    enemy.setVelocity(0,random(3,10));
    enemy.debug=true;
    enemy.addImage(cleftImg);
    notes.add(enemy);    
    
    //Creating Player sprite 
    player = new Player(mouseX,windowHeight-100,10,10,playerImg);    
        
    startGame = true;
    score = 0;
    newNoteCounter = 0;
}//end setup

function draw() {
    if(startGame){
        //background(150); 
        background(bgImg)
        textSize(50);
        textAlign(LEFT,TOP);
        fill(255,0,0);
        text('Score: '+score,10,10);

        drawSprites();
        player.move();

        if(frameCount %20 == 0){
            score++;             
        }

        for(var i=0; i<allSprites.length; i++) {
            var s = allSprites[i];        
            if(s.position.y>height+10) {            
                s.position.y = 0;
                s.scale = random(.2,.4);
                s.position.x = random(leftWall,rightWall);
                s.setVelocity(0,random(7,20));
            }
        }    
    }
    
}

function keyPressed(){
    
}

function lose(){
    background(255,0,0);    
    textSize(50);
    fill(0,255,0);
    text('Score: '+score,10,10);
    startgame = false;
    noloop();
}

function newNote(){
    var newNote = createSprite(random(leftWall,rightWall),-100,10,10);        
    newNote.scale = random(.2,.3);
    newNote.setVelocity(0,random(3,10));
    newNote.debug = true;
    newNote.addImage(random(noteImg));
    notes.add(newNote);
    
    //noteCounter++;
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

