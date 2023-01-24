'use strict';

/**
 * Turns a JSON file into an array
 * @param {*} jsonFile - A JSON file with words
 * @returns An array with the content of the JSON file
 */
async function loadWords(jsonFile) {
    let words = [];
    await $.getJSON(jsonFile, function(data) {
        $.each(data.words, function(key, word) {
            words.push(word.toUpperCase());
        });
    });
    return words;
}

/**
 * Chooses a random word from a word array
 * @param {*} words - The array with words
 * @returns A random word from the array
 */
async function getWord(words) {
    return words[Math.floor(Math.random() * words.length)];
}

/**
 * Checks whether a word exists in an array of words
 * @param {*} word - The word to find in the array
 * @param {*} words - The array of words
 * @returns true if the word exists in the array, false otherwise
 */
function wordExists(word, words) {
    return (words.indexOf(word) > -1);
}