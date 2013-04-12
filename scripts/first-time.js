// First Time Visit Processing
// copyright 10th January 2006, Stephen Chapman
// permission to use this Javascript on your web page is granted
// provided that all of the below code in this script (including this
// comment) is used without any alteration

function rC(nam) { var tC = document.cookie.split('; '); for (var i = tC.length - 1; i >= 0; i--) { var x = tC[i].split('='); if (nam == x[0]) return unescape(x[1]); } return '~'; } function wC(nam, val) { document.cookie = nam + '=' + escape(val); } function lC(nam, pg) { var val = rC(nam); if (val.indexOf('~' + pg + '~') != -1) return false; val += pg + '~'; wC(nam, val); return true; } function firstTime(cN) { return lC('pWrD4jBo', cN); } function thisPage() { var page = location.href.substring(location.href.lastIndexOf('\/') + 1); pos = page.indexOf('.'); if (pos > -1) { page = page.substr(0, pos); } return page; }

// example code to call it - you may modify this as required'
$(document).ready(
function start() {
    if (firstTime(thisPage())) {
        window.tourStages = true;
        

    } else {
        
    }
    // other code to run every time once page is loaded goes here
}

)
;
onload = start;