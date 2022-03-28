var colorPalette = ['#01BEFE', '#FF7D00', '#FF006D', '#8F00FF'];
var backgroundBlockPalette = ['#01BEFE', '#FFDD00', '#FF7D00', '#FF006D', '#8F00FF', '#ADDD02']

var shapes = [[2, 7, 10, 11, 12, 13, 17, 18, 24],
              [1, 3, 5, 7, 8]];

var shapeRotations = {};

var hasPlayedUnderstand = false;
var runningStep1 = false;
var highlighterIsOn = false;
var tryItRunning = false;

function createGridGame() {
  let colorCounter = genRandomNum(0, colorPalette.length - 1);
  for (let gameNum = 0; gameNum < 3; gameNum++) {
    let ng = document.getElementsByClassName('shape' + (gameNum + 1));

    for (let i = 0; i < ng.length; i++) {
      let boxColor = colorPalette[colorCounter % colorPalette.length];
      for (let j = 0; j < 25; j++) {
        let newBox = document.createElement("div");
        if (shapes[gameNum].includes(j)) {
          newBox.style.backgroundColor = boxColor;
        }
        ng[i].appendChild(newBox);
      }

      if (!ng[i].classList.contains('tinygrid')) {
        ++colorCounter;
      }
    }
  }
}

function demo_animate() {
  let ng = document.getElementById('gg1');

  ng.style.transform = 'rotate(' + (genRandomNum(-2, 2) * 90) + 'deg)';

  wait_demo_loop();
}

async function wait_demo_loop() {
  await sleep(4000);

  demo_animate();
}

async function handleUnderstand(fillTable=false) {
  let uCounter = document.getElementById('understand-counter');
  let understandTable = document.getElementById('und-table');

  let count = (shapeRotations['understand'] / 90);
  uCounter.innerHTML = '' + count + '번';
  if (count > 0) {
    uCounter.style.color = '#009999';

    if (count == 7 && !hasPlayedUnderstand) {
      let cell = understandTable.rows[1 + (count % 4)].cells[1 + Math.floor(count / 4)];
      let tinyGrid = understandTable.rows[1 + (count % 4)].cells[0].childNodes[0];
      neutralAnimate([tinyGrid, document.getElementById('understand')], 2);

      await sleep(1000);

      cell.innerHTML = count;
      goodAnimate([cell, uCounter]);

      let gridElem = document.getElementById('understand')
      while (count < 11) {
        await sleep(400);
        ++count;
        gridElem.style.transform = 'rotate(' + (count * 90) + 'deg)';
        uCounter.innerHTML = '' + count + '번';
        let numCell = understandTable.rows[1 + (count % 4)].cells[1 + Math.floor(count / 4)];
        numCell.innerHTML = '' + count;
        let txtCell = understandTable.rows[1 + (count % 4)].cells[4];
        txtCell.innerHTML = '4로 나눈 나머지가 ' + (count % 4) + '이다';
        txtCell.style.color = 'red';

        goodAnimate([numCell, txtCell, uCounter]);
      }
      shapeRotations['understand'] = 11*90;
      hasPlayedUnderstand = true;
      return;
    }
  } else {
    uCounter.style.color = 'black';
  }

  if (count <= 11) {
    let cell = understandTable.rows[1 + (count % 4)].cells[1 + Math.floor(count / 4)];
    let tinyGrid = understandTable.rows[1 + (count % 4)].cells[0].childNodes[0];
    neutralAnimate([tinyGrid, document.getElementById('understand')], 2);

    await sleep(1000);

    cell.innerHTML = count;
    goodAnimate([cell, uCounter]);
  }
}

function goodAnimate(elements, duration=0.3) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.animationDuration = '' + duration + 's';
    elements[i].style.animationIterationCount = '1';
    elements[i].style.animationTimingFunction = 'linear';
    elements[i].style.animationName = 'goodShine';
    elements[i].addEventListener('animationend', function(){
        this.style.animationName = '';
      }, false);
  }
}

function neutralAnimate(elements, duration=0.3) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.animationDuration = '' + duration + 's';
    elements[i].style.animationIterationCount = '1';
    elements[i].style.animationTimingFunction = 'linear';
    elements[i].style.animationName = 'neutralShine';
    elements[i].addEventListener('animationend', function(){
        this.style.animationName = '';
      }, false);
  }
}

function badAnimate(elements, duration=0.2) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.animationDuration = '' + duration + 's';
    elements[i].style.animationIterationCount = '1';
    elements[i].style.animationTimingFunction = 'linear';
    elements[i].style.animationName = 'badShake';
    elements[i].addEventListener('animationend', function(){
        this.style.animationName = '';
      }, false);
  }
}

function highlighterOn() {
  let highlighter = document.getElementById('svg-light');
  highlighter.style.transitionDuration = '0.5s';
  highlighter.style.boxShadow = '0px 0px 10px 10px #0000FF';
  highlighterIsOn = true;
}

function highlighterOff() {
  let highlighter = document.getElementById('svg-light');
  highlighter.style.boxShadow = '';
  highlighterIsOn = false;
  setTimeout(function () {highlighter.remove();}, 500);
}

function highlightElement(elementId) {
  if (!highlighterIsOn) {
    let newHL = document.createElement('div');
    newHL.className = 'svg-highlighter';
    newHL.setAttribute("id", "svg-light");
    document.body.appendChild(newHL);
  }

  let highlighter = document.getElementById('svg-light');
  let elemRect = document.getElementById(elementId).getBoundingClientRect();

  highlighter.style.top = '' + (elemRect.y + window.scrollY) + 'px';
  highlighter.style.left = '' + (elemRect.x + window.scrollX) + 'px';
  highlighter.style.width = '' + elemRect.width + 'px';
  highlighter.style.height = '' + elemRect.height + 'px';

  if (!highlighterIsOn) {
    highlighterOn();
  }
}

function rotateButton(event) {
  let [gridId, direction] = event['srcElement']['id'].split('-');

  if(gridId == "understand" && direction == 'anticlock' && (!('understand' in shapeRotations) || shapeRotations['understand'] == 0)) {
    return;
  }

  let deg = (direction == 'clock' ? 90 : -90) + (gridId in shapeRotations ? shapeRotations[gridId] : 0);
  shapeRotations[gridId] = deg;

  let gridElem = document.getElementById(gridId);
  gridElem.style.transform = 'rotate(' + deg + 'deg)';

  if(gridId == "understand") {
    if (deg < 8 * 90) {
      handleUnderstand();
    } else {
      handleUnderstand(true);
    }
  }
}

async function stepButton(event) {
  if (runningStep1) {
    return;
  }
  runningStep1 = true;

  let stepNum = event['srcElement']['id'].split('-')[0] == 'step1' ? 1 : 2;

  let gridElem = document.getElementById('step' + stepNum);
  gridElem.style.transform = 'rotate(' + (stepNum == 1 ? 0 : 180) + 'deg)';

  let sCounter1 = document.getElementById('step' + stepNum + '-counter1');
  let sCounter2 = document.getElementById('step' + stepNum + '-counter2');
  let sCounterBlock = document.getElementById('step' + stepNum + '-counter-block');

  sCounter1.innerHTML = '10번';
  if (stepNum == 1) {
    sCounter1.style.color = '#990000';
    sCounter2.style.color = '#990000';
  } else {
    sCounter1.style.color = 'black';
    sCounter2.style.color = 'black';
  }

  highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_32');

  await sleep(1000);

  highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_24');

  await sleep (1000);

  goodAnimate([sCounter1], 1);
  sCounter1.innerHTML = '2번';

  await sleep(2000);

  for (let i = 0; i < 2; i++) {
    highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_17');

    await sleep(1000);

    neutralAnimate([sCounter1], 0.5);
    highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_43');

    await sleep(1000);

    await sleep(1000);

    highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_8');

    await sleep(1000);

    gridElem.style.transform = 'rotate(' + ((stepNum == 1 ? 0 : 180) + (90*(i+1))) + 'deg)';
    sCounter1.innerHTML = '' + (1 - i) + '번';
    goodAnimate([sCounter1, gridElem], 1);

    await sleep(2000);
  }

  highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_17');

  await sleep(1000);

  neutralAnimate([sCounter1], 0.5);
  highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_12');

  await sleep(1000);

  highlightElement('' + (stepNum == 1 ? '' : '2') + 'svg_1');

  await sleep(500);

  sCounter1.style.color = '#009900';
  sCounter2.style.color = '#009900';
  goodAnimate([sCounterBlock, gridElem], 1);

  await sleep(1000);
  highlighterOff()

  runningStep1 = false;
}

async function tryItButton(event) {
  if (tryItRunning) {
    return;
  }
  tryItRunning = true;

  let gridChoiceElem = event["srcElement"]["id"] ? event["srcElement"] : event["srcElement"]["parentElement"];
  let firstNumber = document.getElementById("mistake1");
  let secondNumber = document.getElementById("mistake2");
  let gridElem = document.getElementById("try");
  let result = document.getElementById("result");

  if (!(gridChoiceElem["id"] == "tiny270deg")) {
    badAnimate([gridChoiceElem]);
  } else {
    goodAnimate([gridChoiceElem], 1);

    await sleep(1000);

    highlightElement("mistake1");

    await sleep(1500);

    firstNumber.innerHTML = '2';

    await sleep(1500);

    goodAnimate([gridElem], 0.5);
    gridElem.style.transform = 'rotate(' + 90 + 'deg)';
    firstNumber.innerHTML = '1';

    await sleep(1500);

    goodAnimate([gridElem], 0.5);
    gridElem.style.transform = 'rotate(' + 180 + 'deg)';
    firstNumber.innerHTML = '0';

    await sleep(1500);

    highlightElement('mistake2');

    await sleep(1500);

    secondNumber.innerHTML = '1';

    await sleep(1500);

    goodAnimate([gridElem], 0.5);
    gridElem.style.transform = 'rotate(' + 270 + 'deg)';
    secondNumber.innerHTML = '0';

    await sleep(1500);

    goodAnimate([gridElem, result], 1);
    result.innerHTML = 'Good job!';

    highlighterOff();
  }

  tryItRunning = false;
}

function addButtonEvents() {
  let rotButtons = document.getElementsByClassName('rotateButton');

  for (let i = 0; i < rotButtons.length; i++) {
    rotButtons[i].addEventListener('click', rotateButton);
  }

  document.getElementById('step1-start').addEventListener('click', stepButton);
  document.getElementById('step2-start').addEventListener('click', stepButton);

  for (let i = 0; i < 4; i++) {
    document.getElementById('tiny' + (i * 90) + 'deg').addEventListener('click', tryItButton);
  }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function genRandomNum(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

createGridGame();
addButtonEvents();
demo_animate();
