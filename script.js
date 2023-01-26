"use strict";
const colorsRange = document.querySelector(".colors-range");
const colorsRangePicker = document.querySelector(".colors-picker");
const opacityRange = document.querySelector(".opacity-range");
const opacityRangePicker = document.querySelector(".opacity-picker");
const colorRange = document.querySelector(".color-range");
const colorRangePicker = document.querySelector(".color-range-picker");
let red = document.querySelector(" .r1");
let green = document.querySelector(" .g1");
let blue = document.querySelector(" .b1");
let opacity = document.querySelector(" .opacity1");
let redHex = document.querySelector(" .r2");
let greenHex = document.querySelector(" .g2");
let blueHex = document.querySelector(" .b2");
let opacityHex = document.querySelector(" .opacity2");
let type = document.querySelector(".activeValue .type");
let copy = document.querySelector(".activeValue i");
const rgba = document.querySelector(".rgba");
const txt = document.querySelector(".txt");
const value = document.querySelector(".value");
const color = document.querySelector(".color");
const icon = document.querySelector(".icon");
const colorWindow = document.querySelector(".color-picker-container");
const pickers = [colorsRangePicker, opacityRangePicker, colorRangePicker];
let active,
  parentRect,
  x,
  y,
  eventType1,
  eventType2,
  eventType3,
  percentage,
  r,
  b,
  g,
  unified,
  bgColorrgba,
  bgColorrgb;
let currRed = "255";
let currGreen = "0";
let currBlue = "0";
let currA = "1";
let bg = value.textContent.replace(/\s+/g, " ").trim();

window.addEventListener("load", function (e) {
  if (
    /Android/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/i.test(navigator.userAgent)
  ) {
    eventType1 = "touchmove";
    eventType2 = "touchstart";
    eventType3 = "touchend";
    process();
  } else {
    eventType1 = "mousemove";
    eventType2 = "mousedown";
    eventType3 = "mouseup";
    process();
  }
});
icon.addEventListener("click", function (e) {
  colorWindow.classList.toggle("activeWindow");
});
function process() {
  document.addEventListener(eventType2, function (e) {
    if (eventType2 === "mousedown") {
      e.preventDefault();
    }
    if (pickers.includes(e.target)) {
      e.target.classList.add("active");
      parentRect = e.target.parentElement.getBoundingClientRect();
      active = document.querySelector(".active");
      if (e.target === colorsRangePicker) {
        e.target.classList.add("activeColor");
      }
    } else if (e.target === colorRange) {
      colorRangePicker.classList.add("active");
      active = document.querySelector(".active");
      parentRect = e.target.getBoundingClientRect();
      colorRangePicker.style.right = `${parentRect.right - (e.clientX + 7)}px`;
      colorRangePicker.style.top = `${e.clientY - (parentRect.top + 7)}px`;

      coloring(e);
    }
  });
  document.addEventListener(eventType3, function (e) {
    pickers.forEach((ele) => {
      ele.classList.remove("active");
      ele.classList.remove("activeColor");
    });
  });
  document.addEventListener(eventType1, function (e) {
    bg = value.textContent.replace(/\s+/g, " ").trim();
    bgColorrgba = `rgba(${red.textContent},${green.textContent},${blue.textContent},${opacity.textContent})`;
    bgColorrgb = `rgba(${red.textContent},${green.textContent},${blue.textContent})`;

    if (colorsRangePicker.classList.contains("activeColor")) {
      setTimeout(() => {
        currRed = red.textContent;
        currGreen = green.textContent;
        currBlue = blue.textContent;
      }, 300);
      colorsRangePicker.style.backgroundColor = bgColorrgb;
      colorRange.style.backgroundImage = `linear-gradient(to left,${bgColorrgb},white)`;
      colorRangePicker.style.backgroundColor = `${bgColorrgb}`;
      colorRangePicker.style.top = "-7px";
      colorRangePicker.style.right = "-7px";
    }

    color.style.backgroundColor = bgColorrgba;

    coloring(e);
  });
}
function coloring(e) {
  colorRangePicker.style.backgroundColor = bgColorrgb;

  let fraction = 100 / 6;
  if (eventType1 === "mousemove") {
    x = e.clientX;
    y = e.clientY;
  } else if (eventType1 === "touchmove") {
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
  }
  if (active) {
    if (
      colorsRangePicker.classList.contains("active") ||
      opacityRangePicker.classList.contains("active")
    ) {
      if (y < parentRect.top) {
        if (colorsRangePicker.classList.contains("active")) {
          red.textContent = "255";
          blue.textContent = "0";
          green.textContent = "0";
        } else if (opacityRangePicker.classList.contains("active")) {
          opacity.textContent = "1";
        }
        active.style.top = "0";
        percentage = 0;
      } else if (y > parentRect.bottom) {
        if (colorsRangePicker.classList.contains("active")) {
          red.textContent = "255";
          blue.textContent = "0";
          green.textContent = "0";
        } else if (opacityRangePicker.classList.contains("active")) {
          opacity.textContent = "0";
        }
        active.style.bottom = "0";
        percentage = 1;
      } else {
        active.style.top = `${y - parentRect.top}px`;
        percentage = (y - parentRect.top) / 200;
        if (colorsRangePicker.classList.contains("active")) {
          if (percentage > 0 && percentage < fraction / 100) {
            blue.textContent = `${Math.trunc(percentage * 6 * 255)}`;
          } else if (
            percentage >= fraction / 100 &&
            percentage < (fraction * 2) / 100
          ) {
            blue.textContent = "255";
            red.textContent = `${Math.trunc(
              (1 - (percentage - fraction / 100) * 6) * 255
            )}`;
          } else if (
            percentage >= (fraction * 2) / 100 &&
            percentage < (fraction * 3) / 100
          ) {
            red.textContent = "0";
            green.textContent = `${Math.trunc(
              (percentage - (fraction * 2) / 100) * 6 * 255
            )}`;
          } else if (
            percentage >= (fraction * 3) / 100 &&
            percentage < (fraction * 4) / 100
          ) {
            green.textContent = "255";
            blue.textContent = `${Math.trunc(
              (1 - (percentage - (fraction * 3) / 100) * 6) * 255
            )}`;
          } else if (
            percentage >= (fraction * 4) / 100 &&
            percentage < (fraction * 5) / 100
          ) {
            blue.textContent = "0";
            red.textContent = `${Math.trunc(
              (percentage - (fraction * 4) / 100) * 6 * 255
            )}`;
          } else if (
            percentage >= (fraction * 5) / 100 &&
            percentage < (fraction * 6) / 100
          ) {
            red.textContent = "255";
            green.textContent = `${Math.trunc(
              (1 - (percentage - (fraction * 5) / 100) * 6) * 255
            )}`;
          }
        } else if (opacityRangePicker.classList.contains("active")) {
          opacity.textContent = Number((1 - percentage).toFixed(2));
          currA = opacity.textContent;
        }
      }
    } else if (colorRangePicker.classList.contains("active")) {
      let percentageX = (x - parentRect.left) / 200;
      let percentageY = (y - parentRect.top) / 200;
      active.style.backgroundColor = bgColorrgb;
      r = Math.trunc(+currRed * (1 - percentageY));
      g = Math.trunc(+currGreen * (1 - percentageY));
      b = Math.trunc(+currBlue * (1 - percentageY));
      unified = Math.trunc(255 * (1 - percentageY));
      if (y < parentRect.top) {
        active.style.top = "-7px";

        if (x > parentRect.right) {
          red.textContent = `${currRed}`;
          green.textContent = `${currGreen}`;
          blue.textContent = `${currBlue}`;
        }
      } else if (y > parentRect.bottom) {
        active.style.bottom = "7px";
        red.textContent = blue.textContent = green.textContent = "0";
      } else {
        active.style.top = `${y - (parentRect.top + 7)}px`;
      }
      if (x < parentRect.left) {
        active.style.right = "193px";
        if (y < parentRect.top) {
          red.textContent = blue.textContent = green.textContent = "255";
        } else if (y > parentRect.bottom) {
          red.textContent = blue.textContent = green.textContent = "0";
        } else {
          red.textContent = green.textContent = blue.textContent = `${unified}`;
        }
      } else if (x > parentRect.right) {
        active.style.right = "-7px";
        if (y < parentRect.top) {
          red.textContent = `${currRed}`;
          green.textContent = `${currGreen}`;
          blue.textContent = `${currBlue}`;
        } else if (y > parentRect.bottom) {
          red.textContent = blue.textContent = green.textContent = "0";
        } else {
          red.textContent = `${r}`;
          green.textContent = `${g}`;
          blue.textContent = `${b}`;
        }
      } else {
        active.style.right = `${parentRect.right - (x + 7)}px`;
        if (y < parentRect.bottom && y > parentRect.top) {
          red.textContent = `${Math.trunc(
            (unified - r) * (1 - percentageX) + r
          )}`;
          green.textContent = `${Math.trunc(
            (unified - g) * (1 - percentageX) + g
          )}`;
          blue.textContent = `${Math.trunc(
            (unified - b) * (1 - percentageX) + b
          )}`;
        }
      }
    }
  } else {
    e.preventDefault();
  }
}

document.addEventListener("mousedown", function (e) {
  if (e.target === type) {
    type.classList.add("clicked");
  }
});
type.addEventListener("mouseup", function (e) {
  setTimeout(() => {
    document.querySelector(".type").classList.remove("clicked");
  }, 300);
});
copy.addEventListener("mousedown", function (e) {
  copy.classList.add("clicked");
  if (
    /Android/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/i.test(navigator.userAgent)
  ) {
    navigator.clipboard.writeText(txt.textContent);
  } else {
    navigator.clipboard.writeText(bg);
  }
});
copy.addEventListener("mouseup", function (e) {
  setTimeout(() => {
    copy.classList.remove("clicked");
  }, 500);
});
