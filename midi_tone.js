//this variable keeps track of the letter key that is pressed by the user
// var noteVal = 'z';

//this gets triggered when a key is pressed in the input box
// function myFunction(event) {
//     noteVal = event.key;
// }

//cw is some kind of timing offset - not really sure how it functions
var CW = CW || {};

var CW_violin = CW_violin || {};


CW.tempoOffset = 0;    //a property to manage the global changes to tempo

CW_violin.tempoOffset = 0;

//the synthesizer for the violin - a little different sound than the piano
var violinSynth;

//the violin part
var violinPart;

//this is the boolean that keeps track of whether the right note was pressed
var userNote = false;

//this is the string that shows the name of the violin note
var noteName = '';

//this keeps track of the ticks of the previous note
var oldNoteTicks = 0;

function fetchMidi(myURL) {
    //console.log(myURL)
    Midi.fromUrl(myURL).then(midi => {
        const useableMidiObject = parseMidi(midi)
        makeSong(useableMidiObject)
    })
}

//************** parse data from midi file or url into useable midi object ********************
function parseMidi(midi) {
    if (midi.header) {
        const midiJSON = JSON.stringify(midi, undefined, null)
        const parsedMidiObject = JSON.parse(midiJSON)
        return parsedMidiObject
    } else {
        alert("Something went wrong when parsing your midi file")
        location.reload();
    }
}

//************** Put midi data into Tone.Parts ********************

function makeSong(midi) {
    Tone.Transport.PPQ = midi.header.ppq
    const numofVoices = midi.tracks.length
    const synths = []
    //************** Tell Transport about Time Signature changes  ********************
    for (let i = 0; i < midi.header.timeSignatures.length; i++) {
        Tone.Transport.schedule(function (time) {
            Tone.Transport.timeSignature = midi.header.timeSignatures[i].timeSignature;

            //console.log(midi.header.timeSignatures[i].timeSignature, Tone.Transport.timeSignature,Tone.Transport.position)
        }, midi.header.timeSignatures[i].ticks + "i");
    }

    //************** Tell Transport about bpm changes  ********************
    for (let i = 0; i < midi.header.tempos.length; i++) {
        Tone.Transport.schedule(function (time) {
            Tone.Transport.bpm.value = midi.header.tempos[i].bpm + CW.tempoOffset;
        }, midi.header.tempos[i].ticks + "i");
    }

    //************ Change time from seconds to ticks in each part  *************
    for (let i = 0; i < numofVoices; i++) {
        midi.tracks[i].notes.forEach(note => {
            note.time = note.ticks + "i"

        })
    }

    violinJSON.tracks[0].notes.forEach(note => {
        var earlyTime = (Number(note.ticks) - 300) +'i'
        Tone.Transport.schedule(function (time) {
            //gNote = new Note();
            noteGrid1.highlightNote(note.name);
        },earlyTime);
    })

    violinJSON.tracks[0].notes.forEach(note => {
        var lateTime = (Number(note.ticks) + 50) +'i'
        Tone.Transport.schedule(function (time) {
            //gNote = new Note();
            noteGrid1.clearGrid();
        },lateTime);
    })

    //************** Create Synths and Parts, one for each track  ********************
    for (let i = 0; i < numofVoices; i++) {
        synths[i] = new Tone.PolySynth().toMaster()
        violinSynth = new Tone.FMSynth().toMaster()


        var pianoPart = new Tone.Part(function (time, value) {
            //lowered velocity

            pianoSamples.triggerAttackRelease(value.name, value.duration, time, value.velocity * 0.15)

            //synths[i].triggerAttackRelease(value.name, value.duration, time, value.velocity * 0.15)
        }, midi.tracks[i].notes).start(0)

        //this loads the violinJSON into transport as another part
        violinPart = new Tone.Part(function (time, value) {
            //raised velocity
            //console.log(time)
            if (userNote) {
                violinSamples.triggerAttackRelease(value.name, value.duration, time, value.velocity*0.30)
                userNote = false;
                //violinSynth.triggerAttackRelease(value.name, value.duration, time, value.velocity*0.30)
            }

        }, violinJSON.tracks[0].notes).start(0)
    }
}



//************** Set up position & BPM indicators  ********************

//Tone.Transport.scheduleRepeat(function (time) {
    setInterval(function() {
            //showPosition()

            violinJSON.tracks[0].notes.forEach(note => {
                //in general, notes seem to be about 400 ticks apart
                //for some reason, the ticks when the schedule repeat function is called
                //are not nice round numbers or multiples of 10
                //a tolerance of 50 seems to work for finding violin notes that
                //start at about the same ticks as where the song is currently
                //playing the piano notes
                if (Math.abs((Tone.Transport.ticks + 450) - note.ticks) < 50) {
                    // document.getElementById("upcomingnotes").textContent = note.name

                    //create a new graphical note in the game
                    if (note.ticks > oldNoteTicks + 60) {
                        //newNote();
                        //gNote = new Note();
                        //oldNoteTicks = note.ticks;
                    }
                }
                if (Tone.Transport.ticks >= 92700) {
                    //if(Tone.Transport.ticks>=10700){
                    gameOver()
                    Tone.Transport.stop()
                    //alert('game over')
                }


            })
        },50
    )


//}, "16n")


//this is not being called in obfdodge - but left in for potential future use

// function showPosition() {
//     //need to coordinate this with latencyHint in setupPlayer if I want accuracy
//     var myPos = Tone.Transport.position
//     var posArray = myPos.split(/\D+/); // split based on non-digits
//     var myBar = Number(posArray[0]) + 1   //first element, converted to number, then increased
//     var myBeat = Number(posArray[1]) + 1
// }

// function showNote() {
//     document.getElementById("violinContent").textContent = Tone.Transport.ticks
// }


//************** Set up buttons  ********************
//******* Everything below here is cosmetic  ********

function changeTempo(dir) {
    switch (dir) {
        case 'up' || 'ArrowUp' || 38:
            Tone.Transport.bpm.value = Tone.Transport.bpm.value + 15;
            CW.tempoOffset = CW.tempoOffset + 15;
            break;

        case 'dn' || 'ArrowDown' || 40:
            Tone.Transport.bpm.value = Tone.Transport.bpm.value - 15;
            CW.tempoOffset = CW.tempoOffset - 15;
            break;

        case 'reset':
            if (Tone.Transport.state === "started") {
                const baseTempo = Tone.Transport.bpm.value - CW.tempoOffset
                Tone.Transport.bpm.value = baseTempo
            }
            CW.tempoOffset = 0;
            break;
    }
}

function assignKeys(event) {
    var key = event.key || event.keyCode;

    if (key === 'ArrowUp' || key === 38) {
        event.preventDefault()
        changeTempo('up')
    }

    if (key === 'ArrowDown' || key === 40) {
        event.preventDefault()
        changeTempo('dn')
    }
}

//this loads the piano json into the tone.transport
makeSong(pianoJSON)


