(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var ATTR_STATE = 'data-state';

var pages = document.querySelectorAll('section,article');
var currentIndex = void 0;

function setReady() {
    var isReady = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        page.setAttribute('data-ready', isReady);
    }
}

function setPageIndex(index) {
    index = Math.max(index, 0);
    index = Math.min(index, pages.length - 1);

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (i === index) {
            page.setAttribute(ATTR_STATE, 'current');
        } else if (i < index) {
            page.setAttribute(ATTR_STATE, 'past');
        } else if (i > index) {
            page.setAttribute(ATTR_STATE, 'future');
        }
    }

    currentIndex = index;
}

window.addEventListener('keydown', function (e) {
    switch (e.which) {
        case 37:
            // left
            setPageIndex(currentIndex - 1);
            break;
        case 38:
            // up
            setPageIndex(currentIndex - 1);
            break;
        case 39:
            // right
            setPageIndex(currentIndex + 1);
            break;
        case 40:
            // down
            setPageIndex(currentIndex + 1);
            break;
    }
});

setPageIndex(0);
setReady();

},{}]},{},[1]);
