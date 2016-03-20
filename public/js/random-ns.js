'use strict';

function playSayin(n) {
    var aud = document.getElementById('sayin-'+n);
    aud.play();
}

function playRandSayin() {
    playSayin(Math.floor(Math.random()*4 + 1));
}
