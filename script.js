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
const hexa = document.querySelector(".hexa");
const txt = document.querySelector(".txt");
let value = document.querySelector(".value .activeValue");
const color = document.querySelector(".color");
const icon = document.querySelector(".icon");
const colorWindow = document.querySelector(".color-picker-container");
const pickers = [colorsRangePicker, opacityRangePicker, colorRangePicker];
class Application {
  active;
  parentRect;
  x;
  y;
  percentage;
  r;
  b;
  g;
  unified;
  bgColorrgba = `rgba(${red.textContent},${green.textContent},${blue.textContent},${opacity.textContent})`;
  bgColorrgb = `rgb(${red.textContent},${green.textContent},${blue.textContent})`;
  currRed = "255";
  currGreen = "0";
  currBlue = "0";
  currA = "1";
  bg = value.textContent.replace(/\s+/g, " ").trim();
  constructor(
    eventType1,
    eventType2,
    eventType3,
    width,
    height,
    radius,
    containerWidth,
    containerHeight
  ) {
    this.eventType1 = eventType1;
    this.eventType2 = eventType2;
    this.eventType3 = eventType3;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    document.addEventListener(eventType2, this.eventDown.bind(this));
    document.addEventListener(eventType3, this.eventUp.bind(this));
    document.addEventListener(eventType1, this.eventMove.bind(this));
    icon.addEventListener("click", function (e) {
      colorWindow.classList.toggle("activeWindow");
    });
    document.addEventListener("mousedown", this.animating.bind(this));
    this.windowSetup();
  }
  windowSetup() {
    colorWindow.style.cssText = `width:${this.containerWidth}px;height:${this.containerHeight}px`;
    colorsRange.style.cssText =
      opacityRange.style.cssText = `height:${this.height}`;
    colorRange.style.cssText = `width:${this.width}px;height:${this.height}px`;
    document.body.style.setProperty("--rad", `-${this.radius}px`);
    colorRangePicker.style.cssText = `width:${2 * this.radius}px;height:${
      2 * this.radius
    }px;`;
    colorsRangePicker.style.cssText =
      opacityRangePicker.style.cssText = `height:${this.radius + 1}px`;
  }
  hexa() {
    redHex.textContent = (+red.textContent).toString(16);
    blueHex.textContent = (+green.textContent).toString(16);
    greenHex.textContent = (+blue.textContent).toString(16);
    opacityHex.textContent = Math.trunc(opacity.textContent * 255).toString(16);
    this.addZero();
  }
  addZero() {
    document.querySelectorAll(".hexa span").forEach((ele) => {
      if (ele.textContent.length === 1) {
        ele.textContent = "0" + ele.textContent;
      }
    });
  }
  flipType() {
    rgba.classList.toggle("activeValue");
    hexa.classList.toggle("activeValue");
    type = document.querySelector(".activeValue .type");
    copy = document.querySelector(".activeValue i");
    value = document.querySelector(".value .activeValue");
    if (type.textContent === "Hexa") {
      this.bg = value.textContent.replace(/Hexa/g, "").trim();
    } else {
      this.bg = value.textContent.replace(/\s+/g, " ").trim();
    }
  }
  enclosed(e) {
    if (e.target === type) {
      return new Promise((resolve) => {
        type.classList.add("clicked");
        this.flipType();
        resolve(type);
      });
    } else if (e.target === copy) {
      return new Promise((resolve) => {
        copy.classList.add("clicked");
        navigator.clipboard.writeText(this.bg);
        resolve(copy);
      });
    } else {
      return;
    }
  }
  animating(event) {
    const promise = this.enclosed(event);
    if (promise) {
      promise.then((res) => {
        setTimeout(() => {
          res.classList.remove("clicked");
        }, 500);
      });
    }
  }
  eventDown(e) {
    if (this.eventType2 === "mousedown") {
      e.preventDefault();
    }
    if (pickers.includes(e.target)) {
      e.target.classList.add("active");
      this.parentRect = e.target.parentElement.getBoundingClientRect();
      this.active = document.querySelector(".active");
      if (e.target === colorsRangePicker) {
        e.target.classList.add("activeColor");
      }
    } else if (e.target === colorRange) {
      colorRangePicker.classList.add("active");
      this.active = document.querySelector(".active");
      this.parentRect = e.target.getBoundingClientRect();
      colorRangePicker.style.right = `${
        this.parentRect.right - (e.clientX + this.radius)
      }px`;
      colorRangePicker.style.top = `${
        e.clientY - (this.parentRect.top + this.radius)
      }px`;

      this.coloring(e);
    } else if (e.target === colorsRange || e.target === opacityRange) {
      if (e.target === colorsRange) {
        colorsRangePicker.classList.add("activeColor");
      }
      e.target.querySelector("span").classList.add("active");
      this.active = document.querySelector(".active");
      this.parentRect = e.target.getBoundingClientRect();
      this.active.style.top = `${
        e.clientY - this.parentRect.top - this.radius
      }px`;
      this.coloring(e);
      this.coloringbg();
    }
  }
  eventUp(e) {
    pickers.forEach((ele) => {
      ele.classList.remove("active");
      ele.classList.remove("activeColor");
    });
  }
  eventMove(e) {
    this.bgColorrgba = `rgba(${red.textContent},${green.textContent},${blue.textContent},${opacity.textContent})`;
    this.bgColorrgb = `rgb(${red.textContent},${green.textContent},${blue.textContent})`;
    this.hexa();
    this.coloringbg();
    this.coloring(e);
  }
  coloringbg() {
    if (colorsRangePicker.classList.contains("activeColor")) {
      setTimeout(() => {
        this.currRed = red.textContent;
        this.currGreen = green.textContent;
        this.currBlue = blue.textContent;
      }, 300);
      colorsRangePicker.style.backgroundColor = this.bgColorrgb;
      colorRange.style.backgroundImage = `linear-gradient(to left,${this.bgColorrgb},white)`;
      colorRangePicker.style.backgroundColor = `${this.bgColorrgb}`;
      colorRangePicker.style.top = `-${this.radius}px`;
      colorRangePicker.style.right = `-${this.radius}px`;
    }

    color.style.backgroundColor = this.bgColorrgba;
  }
  coloring(e) {
    colorRangePicker.style.backgroundColor = this.bgColorrgb;

    let fraction = 100 / 6;
    if (this.eventType1 === "mousemove") {
      this.x = e.clientX;
      this.y = e.clientY;
    } else if (this.eventType1 === "touchmove") {
      this.x = e.changedTouches[0].clientX;
      this.y = e.changedTouches[0].clientY;
    }
    if (this.active) {
      if (
        colorsRangePicker.classList.contains("active") ||
        opacityRangePicker.classList.contains("active")
      ) {
        if (this.y < this.parentRect.top) {
          if (colorsRangePicker.classList.contains("active")) {
            red.textContent = "255";
            blue.textContent = "0";
            green.textContent = "0";
          } else if (opacityRangePicker.classList.contains("active")) {
            opacity.textContent = "1";
          }
          this.active.style.top = `0`;
          this.percentage = 0;
        } else if (this.y > this.parentRect.bottom) {
          if (colorsRangePicker.classList.contains("active")) {
            red.textContent = "255";
            blue.textContent = "0";
            green.textContent = "0";
          } else if (opacityRangePicker.classList.contains("active")) {
            opacity.textContent = "0";
          }
          this.active.style.bottom = `0`;
          this.percentage = 1;
        } else {
          this.active.style.top = `${this.y - this.parentRect.top}px`;
          if (colorsRangePicker.classList.contains("active")) {
            this.percentage = (this.y - this.parentRect.top) / this.height;
          } else if (opacityRangePicker.classList.contains("active")) {
            this.percentage = (this.y - this.parentRect.top) / this.height;
          }

          if (colorsRangePicker.classList.contains("active")) {
            if (this.percentage > 0 && this.percentage < fraction / 100) {
              blue.textContent = `${Math.trunc(this.percentage * 6 * 255)}`;
              red.textContent = "255";
              green.textContent = "0";
            } else if (
              this.percentage >= fraction / 100 &&
              this.percentage < (fraction * 2) / 100
            ) {
              blue.textContent = "255";
              green.textContent = "0";
              red.textContent = `${Math.trunc(
                (1 - (this.percentage - fraction / 100) * 6) * 255
              )}`;
            } else if (
              this.percentage >= (fraction * 2) / 100 &&
              this.percentage < (fraction * 3) / 100
            ) {
              red.textContent = "0";
              blue.textContent = "255";
              green.textContent = `${Math.trunc(
                (this.percentage - (fraction * 2) / 100) * 6 * 255
              )}`;
            } else if (
              this.percentage >= (fraction * 3) / 100 &&
              this.percentage < (fraction * 4) / 100
            ) {
              green.textContent = "255";
              red.textContent = "0";
              blue.textContent = `${Math.trunc(
                (1 - (this.percentage - (fraction * 3) / 100) * 6) * 255
              )}`;
            } else if (
              this.percentage >= (fraction * 4) / 100 &&
              this.percentage < (fraction * 5) / 100
            ) {
              blue.textContent = "0";
              green.textContent = "255";
              red.textContent = `${Math.trunc(
                (this.percentage - (fraction * 4) / 100) * 6 * 255
              )}`;
            } else if (
              this.percentage >= (fraction * 5) / 100 &&
              this.percentage < (fraction * 6) / 100
            ) {
              red.textContent = "255";
              blue.textContent = "0";
              green.textContent = `${Math.trunc(
                (1 - (this.percentage - (fraction * 5) / 100) * 6) * 255
              )}`;
            }
          } else if (opacityRangePicker.classList.contains("active")) {
            opacity.textContent = Number((1 - this.percentage).toFixed(2));
            this.currA = opacity.textContent;
          }
        }
      } else if (colorRangePicker.classList.contains("active")) {
        let percentageX = (this.x - this.parentRect.left) / this.width;
        let percentageY = (this.y - this.parentRect.top) / this.height;
        this.active.style.backgroundColor = this.bgColorrgb;
        this.r = Math.trunc(+this.currRed * (1 - percentageY));
        this.g = Math.trunc(+this.currGreen * (1 - percentageY));
        this.b = Math.trunc(+this.currBlue * (1 - percentageY));
        this.unified = Math.trunc(255 * (1 - percentageY));
        if (this.y < this.parentRect.top) {
          this.active.style.top = `-${this.radius}px`;

          if (this.x > this.parentRect.right) {
            red.textContent = `${this.currRed}`;
            green.textContent = `${this.currGreen}`;
            blue.textContent = `${this.currBlue}`;
          }
        } else if (this.y > this.parentRect.bottom) {
          this.active.style.bottom = `${this.radius}px`;
          red.textContent = blue.textContent = green.textContent = "0";
        } else {
          this.active.style.top = `${
            this.y - (this.parentRect.top + this.radius)
          }px`;
        }
        if (this.x < this.parentRect.left) {
          this.active.style.right = `${this.width - this.radius}px`;
          if (this.y < this.parentRect.top) {
            red.textContent = blue.textContent = green.textContent = "255";
          } else if (this.y > this.parentRect.bottom) {
            red.textContent = blue.textContent = green.textContent = "0";
          } else {
            red.textContent =
              green.textContent =
              blue.textContent =
                `${this.unified}`;
          }
        } else if (this.x > this.parentRect.right) {
          this.active.style.right = `-${this.radius}px`;
          if (this.y < this.parentRect.top) {
            red.textContent = `${this.currRed}`;
            green.textContent = `${this.currGreen}`;
            blue.textContent = `${this.currBlue}`;
          } else if (this.y > this.parentRect.bottom) {
            red.textContent = blue.textContent = green.textContent = "0";
          } else {
            red.textContent = `${this.r}`;
            green.textContent = `${this.g}`;
            blue.textContent = `${this.b}`;
          }
        } else {
          this.active.style.right = `${
            this.parentRect.right - (this.x + this.radius)
          }px`;
          if (this.y < this.parentRect.bottom && this.y > this.parentRect.top) {
            red.textContent = `${Math.trunc(
              (this.unified - this.r) * (1 - percentageX) + this.r
            )}`;
            green.textContent = `${Math.trunc(
              (this.unified - this.g) * (1 - percentageX) + this.g
            )}`;
            blue.textContent = `${Math.trunc(
              (this.unified - this.b) * (1 - percentageX) + this.b
            )}`;
          }
        }
      }
      // this.bg = value.textContent.replace(/\s+/g, " ").trim();
    } else {
      e.preventDefault();
    }
    this.bgColorrgba = `rgba(${red.textContent},${green.textContent},${blue.textContent},${opacity.textContent})`;
    this.bgColorrgb = `rgb(${red.textContent},${green.textContent},${blue.textContent})`;
  }
}
window.addEventListener("load", function (e) {
  if (
    /Android/i.test(navigator.userAgent) ||
    /iPad|iPhone|iPod/i.test(navigator.userAgent)
  ) {
    const app = new Application(
      "touchmove",
      "touchstart",
      "touchend",
      200,
      200,
      7,
      300,
      300
    );
  } else {
    const app = new Application(
      "mousemove",
      "mousedown",
      "mouseup",
      200,
      200,
      7,
      300,
      300
    );
  }
});
// let active,
//   parentRect,
//   x,
//   y,
//   eventType1,
//   eventType2,
//   eventType3,
//   percentage,
//   r,
//   b,
//   g,
//   unified,
//   bgColorrgba,
//   bgColorrgb;
// let currRed = "255";
// let currGreen = "0";
// let currBlue = "0";
// let currA = "1";
// let bg = value.textContent.replace(/\s+/g, " ").trim();

// window.addEventListener("load", function (e) {
//   if (
//     /Android/i.test(navigator.userAgent) ||
//     /iPad|iPhone|iPod/i.test(navigator.userAgent)
//   ) {
//     eventType1 = "touchmove";
//     eventType2 = "touchstart";
//     eventType3 = "touchend";
//     process();
//   } else {
//     eventType1 = "mousemove";
//     eventType2 = "mousedown";
//     eventType3 = "mouseup";
//     process();
//   }
// });

// icon.addEventListener("click", function (e) {
//   colorWindow.classList.toggle("activeWindow");
// });
// function process() {
//   document.addEventListener(eventType2, function (e) {
//     if (eventType2 === "mousedown") {
//       e.preventDefault();
//     }
//     if (pickers.includes(e.target)) {
//       e.target.classList.add("active");
//       parentRect = e.target.parentElement.getBoundingClientRect();
//       active = document.querySelector(".active");
//       if (e.target === colorsRangePicker) {
//         e.target.classList.add("activeColor");
//       }
//     } else if (e.target === colorRange) {
//       colorRangePicker.classList.add("active");
//       active = document.querySelector(".active");
//       parentRect = e.target.getBoundingClientRect();
//       colorRangePicker.style.right = `${parentRect.right - (e.clientX + this.radius)}px`;
//       colorRangePicker.style.top = `${e.clientY - (parentRect.top + this.radius)}px`;

//       coloring(e);
//     }
//   });
//   document.addEventListener(eventType3, function (e) {
//     pickers.forEach((ele) => {
//       ele.classList.remove("active");
//       ele.classList.remove("activeColor");
//     });
//   });
//   document.addEventListener(eventType1, function (e) {
//     bgColorrgba = `rgba(${red.textContent},${green.textContent},${blue.textContent},${opacity.textContent})`;
//     bgColorrgb = `rgba(${red.textContent},${green.textContent},${blue.textContent})`;

//     if (colorsRangePicker.classList.contains("activeColor")) {
//       setTimeout(() => {
//         currRed = red.textContent;
//         currGreen = green.textContent;
//         currBlue = blue.textContent;
//       }, 300);
//       colorsRangePicker.style.backgroundColor = bgColorrgb;
//       colorRange.style.backgroundImage = `linear-gradient(to left,${bgColorrgb},white)`;
//       colorRangePicker.style.backgroundColor = `${bgColorrgb}`;
//       colorRangePicker.style.top = "-this.radiuspx";
//       colorRangePicker.style.right = "-this.radiuspx";
//     }

//     color.style.backgroundColor = bgColorrgba;

//     coloring(e);
//   });
// }
// function coloring(e) {
//   colorRangePicker.style.backgroundColor = bgColorrgb;

//   let fraction = 100 / 6;
//   if (eventType1 === "mousemove") {
//     x = e.clientX;
//     y = e.clientY;
//   } else if (eventType1 === "touchmove") {
//     x = e.changedTouches[0].clientX;
//     y = e.changedTouches[0].clientY;
//   }
//   if (active) {
//     if (
//       colorsRangePicker.classList.contains("active") ||
//       opacityRangePicker.classList.contains("active")
//     ) {
//       if (y < parentRect.top) {
//         if (colorsRangePicker.classList.contains("active")) {
//           red.textContent = "255";
//           blue.textContent = "0";
//           green.textContent = "0";
//         } else if (opacityRangePicker.classList.contains("active")) {
//           opacity.textContent = "1";
//         }
//         active.style.top = "0";
//         percentage = 0;
//       } else if (y > parentRect.bottom) {
//         if (colorsRangePicker.classList.contains("active")) {
//           red.textContent = "255";
//           blue.textContent = "0";
//           green.textContent = "0";
//         } else if (opacityRangePicker.classList.contains("active")) {
//           opacity.textContent = "0";
//         }
//         active.style.bottom = "0";
//         percentage = 1;
//       } else {
//         active.style.top = `${y - parentRect.top}px`;
//         percentage = (y - parentRect.top) / 200;
//         if (colorsRangePicker.classList.contains("active")) {
//           if (percentage > 0 && percentage < fraction / 100) {
//             blue.textContent = `${Math.trunc(percentage * 6 * 255)}`;
//           } else if (
//             percentage >= fraction / 100 &&
//             percentage < (fraction * 2) / 100
//           ) {
//             blue.textContent = "255";
//             red.textContent = `${Math.trunc(
//               (1 - (percentage - fraction / 100) * 6) * 255
//             )}`;
//           } else if (
//             percentage >= (fraction * 2) / 100 &&
//             percentage < (fraction * 3) / 100
//           ) {
//             red.textContent = "0";
//             green.textContent = `${Math.trunc(
//               (percentage - (fraction * 2) / 100) * 6 * 255
//             )}`;
//           } else if (
//             percentage >= (fraction * 3) / 100 &&
//             percentage < (fraction * 4) / 100
//           ) {
//             green.textContent = "255";
//             blue.textContent = `${Math.trunc(
//               (1 - (percentage - (fraction * 3) / 100) * 6) * 255
//             )}`;
//           } else if (
//             percentage >= (fraction * 4) / 100 &&
//             percentage < (fraction * 5) / 100
//           ) {
//             blue.textContent = "0";
//             red.textContent = `${Math.trunc(
//               (percentage - (fraction * 4) / 100) * 6 * 255
//             )}`;
//           } else if (
//             percentage >= (fraction * 5) / 100 &&
//             percentage < (fraction * 6) / 100
//           ) {
//             red.textContent = "255";
//             green.textContent = `${Math.trunc(
//               (1 - (percentage - (fraction * 5) / 100) * 6) * 255
//             )}`;
//           }
//         } else if (opacityRangePicker.classList.contains("active")) {
//           opacity.textContent = Number((1 - percentage).toFixed(2));
//           currA = opacity.textContent;
//         }
//       }
//     } else if (colorRangePicker.classList.contains("active")) {
//       let percentageX = (x - parentRect.left) / 200;
//       let percentageY = (y - parentRect.top) / 200;
//       active.style.backgroundColor = bgColorrgb;
//       r = Math.trunc(+currRed * (1 - percentageY));
//       g = Math.trunc(+currGreen * (1 - percentageY));
//       b = Math.trunc(+currBlue * (1 - percentageY));
//       unified = Math.trunc(255 * (1 - percentageY));
//       if (y < parentRect.top) {
//         active.style.top = "-this.radiuspx";

//         if (x > parentRect.right) {
//           red.textContent = `${currRed}`;
//           green.textContent = `${currGreen}`;
//           blue.textContent = `${currBlue}`;
//         }
//       } else if (y > parentRect.bottom) {
//         active.style.bottom = "this.radiuspx";
//         red.textContent = blue.textContent = green.textContent = "0";
//       } else {
//         active.style.top = `${y - (parentRect.top + this.radius)}px`;
//       }
//       if (x < parentRect.left) {
//         active.style.right = "193px";
//         if (y < parentRect.top) {
//           red.textContent = blue.textContent = green.textContent = "255";
//         } else if (y > parentRect.bottom) {
//           red.textContent = blue.textContent = green.textContent = "0";
//         } else {
//           red.textContent = green.textContent = blue.textContent = `${unified}`;
//         }
//       } else if (x > parentRect.right) {
//         active.style.right = "-this.radiuspx";
//         if (y < parentRect.top) {
//           red.textContent = `${currRed}`;
//           green.textContent = `${currGreen}`;
//           blue.textContent = `${currBlue}`;
//         } else if (y > parentRect.bottom) {
//           red.textContent = blue.textContent = green.textContent = "0";
//         } else {
//           red.textContent = `${r}`;
//           green.textContent = `${g}`;
//           blue.textContent = `${b}`;
//         }
//       } else {
//         active.style.right = `${parentRect.right - (x + this.radius)}px`;
//         if (y < parentRect.bottom && y > parentRect.top) {
//           red.textContent = `${Math.trunc(
//             (unified - r) * (1 - percentageX) + r
//           )}`;
//           green.textContent = `${Math.trunc(
//             (unified - g) * (1 - percentageX) + g
//           )}`;
//           blue.textContent = `${Math.trunc(
//             (unified - b) * (1 - percentageX) + b
//           )}`;
//         }
//       }
//     }
//     bg = value.textContent.replace(/\s+/g, " ").trim();
//   } else {
//     e.preventDefault();
//   }
// }

// document.addEventListener("mousedown", function (e) {
//   if (e.target === type) {
//     type.classList.add("clicked");
//   }
// });
// type.addEventListener("mouseup", function (e) {
//   setTimeout(() => {
//     document.querySelector(".type").classList.remove("clicked");
//   }, 300);
// });
// copy.addEventListener("mousedown", function (e) {
//   copy.classList.add("clicked");
//   // if (
//   //   /Android/i.test(navigator.userAgent) ||
//   //   /iPad|iPhone|iPod/i.test(navigator.userAgent)
//   // ) {
//   //   navigator.clipboard.writeText(txt.textContent);
//   // } else {
//   // }
//   navigator.clipboard.writeText(bg);
// });
// copy.addEventListener("mouseup", function (e) {
//   setTimeout(() => {
//     copy.classList.remove("clicked");
//   }, 500);
// });
