(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function init(){var e=parseHash();setPageIndex(e>=0?e:0),initListeners(),setupInnerPaging(),setTimeout(setReady)}function parseHash(){var e=location.hash,t=e.match(/^#?p([1-9][0-9]*)/);return t?parseInt(t[1]):-1}function initListeners(){window.addEventListener("hashchange",function(){var e=parseHash();e>=0&&setPageIndex(e)});for(var e=document.querySelectorAll("article"),t=0;t<e.length;t++)!function(t){var n=e[t];n.addEventListener("click",function(){incrementInnerPage(n)})}(t)}function setReady(){for(var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=0;t<pages.length;t++){pages[t].setAttribute("data-ready",e)}}function setPageIndex(e){e=Math.max(e,0),e=Math.min(e,pages.length-1);for(var t=0;t<pages.length;t++){var n=pages[t];t===e?n.setAttribute(ATTR_STATE,"current"):t<e?n.setAttribute(ATTR_STATE,"past"):t>e&&n.setAttribute(ATTR_STATE,"future")}currentIndex=e,location.hash="#p"+e}function setupInnerPaging(){for(var e=document.querySelectorAll("article"),t=0;t<e.length;t++)applyInnerPaging(e[t])}function applyInnerPaging(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=e.querySelectorAll("*"),a=filterBlocks(n);t>=a.length&&(t=0),a.forEach(function(e,n){e.style.display=n<t?"none":""});for(var r=0;e.scrollHeight>e.offsetHeight;)a[a.length-(r+1)].style.display="none",r++;e.setAttribute("data-range-start",t),e.setAttribute("data-range-end",a.length-r)}function incrementInnerPage(e){applyInnerPaging(e,parseInt(e.getAttribute("data-range-end"))||0)}function filterBlocks(e){for(var t=[],n=0;n<e.length;n++){var a=e[n],r=/^h[1-9][0-9]*$/i.test(a.tagName),i=a.children.length;r||i||t.push(a)}return t}var ATTR_STATE="data-state",pages=document.querySelectorAll("section,article"),currentIndex=void 0;window.addEventListener("keydown",function(e){switch(e.which){case 37:case 38:setPageIndex(currentIndex-1);break;case 39:case 40:setPageIndex(currentIndex+1)}}),init();

},{}]},{},[1]);
