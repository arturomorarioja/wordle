"use strict";

/**
 * ARTURO'S WORDLE
 * Web implementation of the Wordle game
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0 January 2022
 */
$(async function() {

    const file = 'data/words.json';
    const words = await loadWords(file);
    const gameInfo = {
        'secretWord': '',
        'numRow': 1,
        'numLetter': 1
    }

    initialise(gameInfo, words);

    $('.key').on('tap', function() {
        processKey($(this).attr('id'), words, gameInfo);
    });
    $('.key').on('click', function() {
        processKey($(this).attr('id'), words, gameInfo);
    });
    $(document).on('keydown', function(e) {
        let key = e.key.toUpperCase();
        if (key === 'BACKSPACE') {
            key = 'BACK';
        }
        
        const validKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ENTER', 'BACK'];

        if (validKeys.includes(key)) {
            processKey(key, words, gameInfo);
        } 
    });

    // 'Play again' clicked
    $('#modalInfo > button').on('click', function(e) {
        e.preventDefault();

        initialise(gameInfo, words);

        $('#modalInfo').fadeOut(1000);
        $('#word').hide();
    });
});

async function initialise(info, words) {
    info.secretWord = await getWord(words);
    // console.log('Word: ' + info.secretWord);

    $('.word > .letter').text(' ').removeClass('correct').removeClass('existing').removeClass('nonexisting');
    $('.row > .key').removeClass('correct').removeClass('existing').removeClass('nonexisting');

    info.numRow = 1;
    info.numLetter = 1;
}

function processKey(key, words, info) {
    const numLetter = readKey(key, info);

    // Enter pressed. Whole word processed
    if (numLetter === 0) {  
        let word = '';
        $(`#word${info.numRow} > .letter`).each(function(idx, element) {
            word += element.innerText;
        });
        if (wordExists(word, words)) {
            let letter;
            let correctLetters = 0;
            let correctPositions = [];
            let workingWord = info.secretWord;
            // Only correct letters are checked at first
            for (let index = 0; index < word.length; index++) {
                letter = word.substr(index, 1);
                let tableLetter = $(`#word${info.numRow} > div:nth-of-type(${index + 1})`);
                let keyboardLetter = $(`#${letter}`);
                if (info.secretWord.substr(index, 1) === letter) {
                    tableLetter.addClass('correct');
                    keyboardLetter.addClass('correct');
                    correctLetters++;
                    // The letter is excluded from future checks
                    correctPositions.push(index);
                    workingWord = workingWord.substr(0, index) + '=' + workingWord.substr(index + 1);
                }
            }
            // Once correct letters are sorted out, the rest is checked.
            // This way repeated letters are not marked as existing
            // (e.g, if the secret word is PORCH and the user enters LOOSE,
            // the second O will not be interpreted as existing)
            for (let index = 0; index < word.length; index++) {                    
                if (!correctPositions.includes(index)) {
                    letter = word.substr(index, 1);

                    let tableLetter = $(`#word${info.numRow} > div:nth-of-type(${index + 1})`);
                    let keyboardLetter = $(`#${letter}`);
                    let letterPosition = workingWord.indexOf(letter);
                    if (letterPosition > -1) {                            
                        tableLetter.addClass('existing');
                        if (!keyboardLetter.hasClass('correct')) {
                            keyboardLetter.addClass('existing');
                        }
                        workingWord = workingWord.substr(0, letterPosition) + '=' + workingWord.substr(letterPosition + 1);
                    } else {
                        tableLetter.addClass('nonexisting');
                        keyboardLetter.addClass('nonexisting');
                    }
                }
            }

            // The word is correct
            if (correctLetters === 5) {
                $('#message').text('You got it!');
                $('#modalInfo').fadeIn(1000);
            } else {
                if (info.numRow === 6) {
                    $('#message').text('Bad luck');
                    $('#word').text(`The word was ${info.secretWord}`).show();                        
                    $('#modalInfo').fadeIn(1000);
                } else {
                    info.numRow++;
                    info.numLetter = 1;
                }
            }
        } else {
            $('#msgWordNotExists').fadeIn(1000).fadeOut(2000);
            $(`#word${info.numRow} > .letter`).addClass('invalid');
            info.numLetter = 1;
        }            
    }
}

function readKey(key, info) {
    switch(key) {
        case 'BACK':
            if (!$('#modalInfo').is(':visible')) {
                if (info.numLetter > 1) {
                    info.numLetter--;
                }
                $(`#word${info.numRow} > div:nth-of-type(${info.numLetter})`).text(' ');                    
            }
            return info.numLetter;
            break;
        case 'ENTER':
            if (info.numLetter > 5) {
                return 0;                
            } else {
                return info.numLetter;
            }
            break;
        default:
            const cell = $(`#word${info.numRow} > div:nth-of-type(${info.numLetter})`)
            cell.text(key);
            cell.removeClass('invalid');
            if (info.numLetter > 5) {
                return info.numLetter;
            } else {
                return ++info.numLetter;
            }
            break;
    }
}