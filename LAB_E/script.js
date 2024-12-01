/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/


var styles = {
  "styl1.css": "src/style/styl1.css",
  "styl2.css": "src/style/styl2.css",
  "styl3.css": "src/style/styl3.css"
};
function changeStyle(styleName) {
  console.log("Changing style to: ".concat(styleName));
  var styleElement = document.getElementById("dynamic-style");
  if (styleElement) {
    styleElement.href = styles[styleName];
    console.log("Style changed to: ".concat(styleElement.href));
  } else {
    console.error("Style element not found");
  }
}
// Attach the function to the global window object
window.changeStyle = changeStyle;
/******/ })()
;