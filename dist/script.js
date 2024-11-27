/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


// Массив доступных стилей
var styles = [{
  name: "Style1",
  file: "styles/style1.css"
}, {
  name: "Style2",
  file: "styles/style2.css"
}, {
  name: "Style3",
  file: "styles/style3.css"
}];
var currentStyle = styles[0].file;
function switchStyle(style) {
  var existingLink = document.querySelector('link[rel="stylesheet"]');
  if (existingLink) {
    existingLink.remove();
  }
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = style.file;
  document.head.appendChild(link);
  currentStyle = style.file;
}
function createStyleLinks() {
  var styleLinks = document.getElementById("style-links");
  if (styleLinks) {
    styles.forEach(function (style) {
      var link = document.createElement("a");
      link.href = "#";
      link.textContent = style.name;
      link.addEventListener("click", function (event) {
        event.preventDefault();
        switchStyle(style);
      });
      var listItem = document.createElement("li");
      listItem.appendChild(link);
      styleLinks.appendChild(listItem);
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  createStyleLinks();
  switchStyle(styles[0]);
});
/******/ })()
;