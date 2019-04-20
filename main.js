(function() {
  
  const BTN_START = document.querySelector(".start");
  const BTN_PAUSE = document.querySelector(".pause");
  const BTN_RESET = document.querySelector(".reset");
  const BTN_LAP = document.querySelector(".lap");
  const LIST_LAPS = document.querySelector(".laps");
  const BTN_DELETE = document.querySelector(".delete");
  const TIME_DISPLAY = document.querySelector(".time");

  let mseconds, seconds, minutes, hours;

  BTN_START.addEventListener("click", event => {
    event.preventDefault();
    if (DATA.isGoing === false) {
      DATA.isGoing = true;
      DATA.timerId = window.requestAnimationFrame(startTimer);
    }

    //Resuming play
    if (DATA.progress !== 0) {
      DATA.start = performance.now() - DATA.progress;
    }
  });

  BTN_PAUSE.addEventListener("click", pauseTimer);
  BTN_RESET.addEventListener("click", resetTimer);
  BTN_LAP.addEventListener("click", recordLap);
  BTN_DELETE.addEventListener("click", event => {
    event.preventDefault();
    removeChildren(LIST_LAPS);
    DATA.laps = [];
    updateLaps();
  });

  const DATA = {
    start: 0,
    progress: 0,
    currentTime: "",
    isGoing: false,
    timerId: null,
    laps: [],
    get milliseconds() {
      return Math.trunc(this.progress);
    }
  };

  updateLaps();

  function startTimer(timestamp) {
    if (!DATA.start) DATA.start = timestamp;
    DATA.progress = timestamp - DATA.start;
    DATA.timerId = window.requestAnimationFrame(startTimer);
    TIME_DISPLAY.textContent = getDisplay();
  }

  function pauseTimer() {
    DATA.isGoing = false;
    window.cancelAnimationFrame(DATA.timerId);
  }

  function resetTimer() {
    // Increment DATA.start with new delay time
    DATA.start += DATA.progress;
    DATA.progress = 0.01;
    TIME_DISPLAY.textContent = "00:00:00:00";
  }

  function recordLap() {
    if (DATA.isGoing === true) {
      DATA.laps.push(DATA.currentTime);
      updateLaps();
    }
  }

  function updateLaps() {
    removeChildren(LIST_LAPS);
    let fragment = document.createDocumentFragment();
    DATA.laps.forEach(event => {
      createEl({ tag: "li", content: event, parent: fragment, addToParent: 1 });
    });
    LIST_LAPS.appendChild(fragment);
    BTN_DELETE.style.display = DATA.laps.length > 0 ? "block" : "none";
  }

  function getDisplay() {
    mseconds = Math.trunc((DATA.milliseconds / 10) % 100);
    seconds = Math.trunc(DATA.milliseconds / 1000)
      .toString()
      .padStart(2, "0");
    hours = parseInt(seconds / 3600);
    seconds = seconds % 3600; 
    minutes = Math.trunc(seconds / 60)
      .toString()
      .padStart(2, "0");
    seconds = seconds % 60; 

    DATA.currentTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
      seconds
    )}:${formatTime(mseconds)}`;
    return DATA.currentTime;
  }

  function formatTime(time) {
    return time.toString().padStart(2, "0");
  }

  function createEl({ parent, tag, content, classes, addToParent } = {}) {
    let el = document.createElement(tag);
    if (content) {
      let txt = document.createTextNode(content);
      el.appendChild(txt);
    }
    if (classes) {
      el.setAttribute("class", classes);
    }
    if (addToParent) {
      parent.appendChild(el);
    }
    return el;
  }s

  function removeChildren(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
})();
