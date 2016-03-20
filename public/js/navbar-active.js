$(document).ready(function() {
    switch(pageName) {
    case 'home':
        $('#navbar-home-link').attr('class', 'active');
        break;
    case 'contact':
        $('#navbar-contact-link').attr('class', 'active');
        break;
    case 'about':
        $('#navbar-about-link').attr('class', 'active');
        break;
    }
});

var removeActiveOnDropdown = function () {
    $('a#dropdownMaps').removeClass('active');
};
