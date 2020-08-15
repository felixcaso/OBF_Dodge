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
        //textStyle(BOLD)
        //textFont(BODONI);
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
    //fullscreen(true);


    globalWinHeight =  windowHeight;
    globalWinWidth =  windowHeight;
    leftString = windowWidth/4;
    rightString = 3/4*windowWidth;
    stringHorSpan = windowWidth /2;
    stringLines = [leftString,leftString+1/2*windowWidth*1/3,leftString+1/2*windowWidth*2/3,rightString];

    centerOf_UIitems = windowWidth-windowWidth/5+58;
    widthUI = 140;
    leftOf_UIitems = centerOf_UIitems-widthUI/2;

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
    //gameButton.style("font-family", "Bodoni");
    gameButton.style("font-size", "18px");
    gameButton.style('text-align', 'center');

    //introP2 = createP('FIDDLER HERO!');
    //introP2.position(windowWidth-windowWidth/5,150+80);
    //introP2.style('font-size', '14px');
    //introP2.style('display', 'table');
    //introP2.style('margin', '0 auto');
    //introP2.style('margin-top', '1%');

    inp = createInput('').attribute('placeholder', '@IGName');
    inp.position(leftOf_UIitems,130+85);
    inp.size(widthButton-9,40);
    inp.style('font-size', '18px');
    //inp.style("font-family", "Bodoni");
    inp.style('text-align', 'center');


    //inp.style('width', '50px');
    //inp.style('display', 'table');
    //inp.style('margin', '0 auto');
    //inp.style('margin-top', '5%');

   //notes = new Group();

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
        line(stringLines[1],0,stringLines[1],windowHeight);
        line(stringLines[2],0,stringLines[2],windowHeight);
        fill(255);
        strokeWeight(10);
        line(leftString,player.sprite.position.y-(player.sprite.height/2)
            ,rightString,player.sprite.position.y-(player.sprite.height/2));

        //Vertical Note Movement
        // for(var i=notes.length-1; i>=0; i--) {
        //     notes[i].collide(player.playerSprite,playNote);
        //     if (notes[i].position.y > player.playerSprite.position.y - (player.playerSprite.height/2)) {
        //         //notes.splice(i, 1);
        //         notes[i].remove();
        //     }
        // }

        //trying to have more chance for collision hence - 40
        if(gNote.sprite.position.y - 40 > player.sprite.position.y ){//windowHeight-10
            gNote.sprite.remove();
            //userNote = false;
        }
        //increased time from 40 to 50 to allow for more chance for collision
        if(userNote && frameCount > timeStamp + 50){
            userNote = false;
        }

        gNote.sprite.collide(player.sprite,playNote);
        drawSprites();

        if(frameCount<gameStartTime + 300) {
            if (windowWidth < 600) {
                fill(255)
                textSize(20);
                textAlign(CENTER, CENTER);
                text('Click to move the violin', windowWidth/2, windowHeight / 3);
            } else {
                fill(255)
                textSize(37);
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

// function newNote() {
//     userNote = false;//
//     note = createSprite(random(stringLines), 0, 50, 50);
//     note.setDefaultCollider();
//     note.setVelocity(0, 15);
//     note.scale = .3;
//     note.debug = true;
//     note.addImage(random(noteImg));
//     //notes.add(note);
// }

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
    gNote.sprite.remove();
}
