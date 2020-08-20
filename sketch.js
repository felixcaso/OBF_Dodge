//Game variables
var gameStarted = false;
var gameButton;
var score = 0;
var player; //Player object
var notes; //Notes Group
var gNote;
var counter = 0;
var timeStamp = 0; //timer placeholder
var unique_username;
var inp;
var pianoSamples;

var violinSamples;
var noteList = ['G#3','A3','A#3','B3','C4','C#4','D4',
    'D#4','E4','F4','F#4','G4','G#4','A4',
    'A#4','B4','C5','C#5','D5','D#5','E5',
    'F5','F#5','G5','G#5','A5','A#5','B5']

var socket;
var scoresFromDB;
var gotScores = false;
var globalWinHeight;
var globalWinWidth;
//Borders to falling line with backround(240px div)
//distance between strings
var leftString;
var rightString;
var stringLines;
var stringHorSpan; //distance between left most string and right most string
var col;
var fontCol;
//Images Variables
var backgroundImg;
var noteImg = [];
var noteImg_sm = [];;
var playerImg;
var gameStartTime=0;
//for mobile
var playerImg_sm;
var leftOf_UIitems;
var centerOf_UIitems;
var widthUI;
var widthUIRect;
var widthButton;

// //Fonts
var OPEN_SANS_LIGHT;
var PLAY_FAIR_DISPLAY_BOLD;
var BODONI;

var noteGrid1;

//grid
class noteGrid {
    constructor(upperLeft, stringGap, noteGap, totalWidth, height, startY){
        this.upperLeft = upperLeft;
        this.noteGap = noteGap;
        this.totalWidth = totalWidth;
        this.stringGap = stringGap;
        this.height = height;
        this.startY = startY;
        var column1 = [];
        var column2 = [];
        var column3 = [];
        var column4 = [];
        this.centerPoints = [column1,column2,column3,column4]
    }

    makeGrid(){
        for(var i = 0; i<4; i++) {
            for(var j = 0; j<7; j++){
                var fingerPlacement = {};
                fingerPlacement.x = this.upperLeft+i*this.stringGap;
                fingerPlacement.y = this.startY+((this.height-this.startY) / 6) * j;
                fingerPlacement.note = ''
                fingerPlacement.lit = false

                this.centerPoints[i][j]= fingerPlacement;
            }
        }
    }

    displayGrid() {
        let diameter = stringHorSpan/3;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                let x = this.centerPoints[i][j].x
                let y = this.centerPoints[i][j].y
                let noteName = this.centerPoints[i][j].note
                if(this.centerPoints[i][j].lit === true){
                    //fill(255,0,0)
                    fill(col)
                    ellipse(x,y,diameter,diameter)
                    fill(255)
                    textSize(18)
                    text(noteName,x,y)
                }
                else {
                    noFill()
                    stroke(0)
                    ellipse(x, y, diameter, diameter)
                    stroke(255)
                    fill(0)
                    textSize(18)
                    text(noteName,x,y)
                }
            }
        }
    }

    populateNotes(){
        var counter = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                let x = this.centerPoints[i][j].note = noteList[counter]
                counter++
            }
        }

    }

    highlightNote(noteName){
        let diameter = (this.height-this.startY) / 6;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                if (this.centerPoints[i][j].note === noteName) {
                    let x = this.centerPoints[i][j].x
                    let y = this.centerPoints[i][j].y
                    this.centerPoints[i][j].lit = true
                }
            }
        }

    }

    clearGrid(){
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 7; j++) {
                this.centerPoints[i][j].lit = false
            }
        }
    }


}



//Preloading Images
function preload(){
    //Images
    for(var i=0; i<3;i++){
        noteImg[i] = loadImage('Images/musicNote'+i+'.png');
    }
    for(var i=0; i<3;i++){
        noteImg_sm[i] = loadImage('Images/musicNote'+i+'_sm.png');
    }
    backgroundImg = loadImage('Images/bg2.jpg');
    playerImg = loadImage('Images/player.png');
    playerImg_sm = loadImage('Images/player_sm.png');

    //Fonts
    OPEN_SANS_LIGHT = loadFont('Fonts/OpenSans-Light.ttf');
    PLAY_FAIR_DISPLAY_BOLD = loadFont('Fonts/PlayfairDisplay-Bold.ttf');
    BODONI = loadFont('Fonts/BodoniFLF-Roman.ttf');

    pianoSamples = SampleLibrary.load({
        instruments: "piano"
    });

    violinSamples = SampleLibrary.load({
        instruments: "violin"
    });

    pianoSamples.toMaster();
    violinSamples.toMaster();
}

function showScores(data){

    if(windowWidth<600) {
        var textHeight = 120;
        textSize(30*0.6);
    }else{
        var textHeight = 140;
        textSize(30);
    }
        textStyle(BOLD);
        fill(255)
        text('High Scores',9,textHeight-40)
        fill(col)
        //textStyle(NORMAL)
        text('High Scores',10,textHeight-40+1)
        //textStyle(NORMAL);
        data.forEach(entry => {
            if(Object.keys(entry).length>2) {
                if(textHeight < globalWinHeight-40) {
                    if(entry.username!='') {
                        fill(255)
                        textStyle(BOLD)
                        text(entry.username + ': ' + entry.score, 9.25, textHeight)
                        fill(col)
                        //textStyle(NORMAL)
                        text(entry.username + ': ' + entry.score, 10, textHeight + 0.75)
                        if (windowWidth < 600) {
                            textHeight += 40 * 0.6;
                        } else {
                            textHeight += 40;
                        }
                    }

                }
            }
        })
}


function setup() {

    globalWinHeight =  windowHeight;
    globalWinWidth =  windowWidth;
    leftString = windowWidth/3;
    stringHorSpan = windowWidth /3;
    rightString = leftString+stringHorSpan;

    stringLines = [leftString,leftString+stringHorSpan/3,rightString-stringHorSpan/3,rightString];

    centerOf_UIitems = windowWidth-windowWidth/5+58;
    widthUI = 140;
    leftOf_UIitems = centerOf_UIitems-widthUI/2;

    noteGrid1 = new noteGrid(leftString,stringHorSpan/3,windowHeight/2/7,stringHorSpan, windowHeight-250,100)
    noteGrid1.makeGrid()
    noteGrid1.populateNotes()
    console.log(noteGrid1)
    socket = io();
    socket.on('scores_from_db',
        function(data){
            scoresFromDB = data;
            gotScores = true;
        }

    );
    //Create Canvas
    col = color(235,81,15);

    if(windowWidth<600) {
        widthButton = widthUI*0.8;
    }
    else{
        widthButton = widthUI;
    }

    fontCol = color(255);
    createCanvas(windowWidth,windowHeight);
    gameButton = createButton('Start Game');
    gameButton.mouseClicked(startGame);
    gameButton.size(widthButton,75);
    gameButton.position(leftOf_UIitems,130);
    gameButton.style('background-color',col);
    gameButton.style("font-size", "18px");
    gameButton.style('text-align', 'center');

    inp = createInput('').attribute('placeholder', '@IGName');
    inp.position(leftOf_UIitems,130+85);
    inp.size(widthButton-9,40);
    inp.style('font-size', '18px');
    inp.style('text-align', 'center');

}

// Function for sending to the socket
function register_user() {
    var data = {
        unique_username: unique_username,
    };
    socket.emit('register_user',data);
}

function register_score() {
    var data = {
        unique_username: unique_username,
        score: score,
    };
    socket.emit('register_score',data);
}

function get_scores() {
    var data = {

    };
    socket.emit('get_scores',data);
}

function checkCollision(){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 7; j++) {
            let x = noteGrid1.centerPoints[i][j].x;
            let lit = noteGrid1.centerPoints[i][j].lit;
            if(lit && Math.abs(player.sprite.position.x-x)<5) {
                playNote()
            }
        }
    }
}



function draw() {
    background(backgroundImg);
    //show logo right away
    // Iymanni's Logo

    fill(0);
    ellipse(centerOf_UIitems,65,110,110);
    fill(255);
    textSize(50)
    textStyle(NORMAL);
    textAlign(CENTER,CENTER)
    text("iah",centerOf_UIitems,65);

    noteGrid1.displayGrid();

    fill(255)

    if(windowWidth<600) {
        widthUIRect = 0.67 * widthUI;
        textSize(13.5);
    }
    else{
        widthUIRect = widthUI;
        textSize(16);
    }

    rect(leftOf_UIitems,130+65+85-8,widthUIRect,347);
    fill(0)
    textAlign(LEFT,TOP)

    text('Welcome to Fiddler Hero! Use arrow keys <- -> or click to move the fiddle ' +
        'and catch the notes. ' +
        'When you catch a note you should hear the melody ' +
        'to "Adoration" by Florence Price. Enjoy! ' +
        'If the song stops before 2 minutes, or to replay, refresh the browser.',
        leftOf_UIitems+4,130+65+92-8,widthUIRect,340);

    if(gameStarted){

        setText();
        if(gotScores) {
            showScores(scoresFromDB);
        }
        fill(0);
        strokeWeight(7);
        stroke(0)
        line(stringLines[0],0,stringLines[0],windowHeight);
        line(stringLines[1],0,stringLines[1],windowHeight);
        line(stringLines[2],0,stringLines[2],windowHeight);
        line(stringLines[3],0,stringLines[3],windowHeight);
        fill(255);
        strokeWeight(10);
        line(leftString-stringHorSpan/6,player.sprite.position.y-(player.sprite.height/2)
            ,rightString+stringHorSpan/6,player.sprite.position.y-(player.sprite.height/2));

        //trying to have more chance for collision hence - 40
        if(gNote.sprite.position.y - 40 > player.sprite.position.y ){//windowHeight-10
            gNote.sprite.remove();
            //userNote = false;
        }
        //increased time from 40 to 50 to allow for more chance for collision
        if(userNote && frameCount > timeStamp + 50){
            //userNote = false;
        }

        //gNote.sprite.collide(player.sprite,playNote);
        checkCollision();
        drawSprites();

        if(frameCount<gameStartTime + 300) {
            if (windowWidth < 600) {
                strokeWeight(1);
                fill(255)
                textSize(20);
                textAlign(CENTER, CENTER);
                text('Click to move the violin', windowWidth/2, windowHeight / 3);
            } else {
                fill(255)
                textSize(37);
                strokeWeight(1);
                textAlign(CENTER, CENTER);
                text('Click to move the violin', windowWidth/2, windowHeight / 3);
                text('or use arrow keys <-  ->', windowWidth/2, windowHeight * 0.5);

            }
        }

    }//end game started(main loop)

}//end draw()


function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        player.sprite.position.x -= stringHorSpan/3;
    } else if (keyCode === RIGHT_ARROW) {
        player.sprite.position.x += stringHorSpan/3;
    }
    if(gameStarted) {
        player.sprite.position.x = constrain(player.sprite.position.x, leftString, rightString);
    }
}

function mousePressed(){
    if(gameStarted){
        if (mouseX <= stringLines[1] - stringHorSpan / 6) {
            player.sprite.position.x = stringLines[0];
        }
        if (mouseX >= stringLines[2] - stringHorSpan / 6) {
            player.sprite.position.x = stringLines[3];
        }
        if (mouseX > stringLines[1] - stringHorSpan / 6 &&
            mouseX < stringLines[1] + stringHorSpan / 6) {
            player.sprite.position.x = stringLines[1];
        }
        if (mouseX > stringLines[2] - stringHorSpan / 6 &&
            mouseX < stringLines[2] + stringHorSpan / 6) {
            player.sprite.position.x = stringLines[2];
        }
    }

}


function startGame(){
    if(!gameStarted){
        gameStarted = true;
        gameStartTime = frameCount;
        score = 0;
        unique_username = inp.value();
        //register_user();
        get_scores();
        if(windowWidth<600) {
            player = new Player(random(stringLines), windowHeight - 100, 3, 3, playerImg_sm);
            for(var i=0; i<3;i++){
                noteImg[i] = noteImg_sm[i];
            }
        }
        else{
            player = new Player(random(stringLines), windowHeight - 100, 10, 10, playerImg);
        }
        gNote = new Note();

        //this starts the song playing
        Tone.Transport.bpm.value = Tone.Transport.bpm.value - 40;
        CW.tempoOffset = CW.tempoOffset - 40;
        Tone.Transport.start();

    }
}

function gameOver(){
    console.log('game over in sketch called')
    register_score();
}

class Player {
    //Player constructor to create player Sprite
    constructor(xPos, yPos, w, h, img) {
        this.sprite = createSprite(xPos, yPos, w, h);
        this.sprite.setDefaultCollider();
        //this.playerSprite.immovable = true;
        this.sprite.scale = .1;
        this.sprite.debug = false;
        this.sprite.addImage('playerSprite', img);
    }

}

class Note{
    constructor() {
        this.sprite = createSprite(random(stringLines), 0, 50, 50);
        this.sprite.setDefaultCollider();
        this.sprite.setVelocity(0, 18);
        this.sprite.scale = .3;
        this.sprite.debug = false;
        this.sprite.addImage('noteSprite',random(noteImg));
    }


}

function setText(){

    //Display Score
    if(windowWidth<600) {
        textSize(50*0.5);
    }
    else{
        textSize(50);
    }
    textAlign(LEFT,TOP);
    fill(255);
    textStyle(BOLD);
    //textFont(BODONI);
    text('Score: '+score,9,35);
    fill(235,81,15);
    text('Score: '+score,10,36);
}

function playNote(){
    userNote = true;
    timeStamp = frameCount;
    score++;
    //gNote.sprite.remove();
}
