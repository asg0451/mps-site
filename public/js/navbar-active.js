'use strict';

$(document).ready(function() {
    switch(pageName) { // jshint ignore:line
    case 'home':
        $('#navbar-home-link').addClass('active');
        break;
    case 'contact':
        $('#navbar-contact-link').addClass('active');
        break;
    case 'about':
        $('#navbar-about-link').addClass('active');
        break;
    case 'vids':
        $('#navbar-vids-link').addClass('active');
        break;

    }
});

var removeActiveOnDropdown = function () {
    $('a#dropdownMaps').removeClass('active');
};
