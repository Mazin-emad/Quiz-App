// slelect element
let count = document.querySelector(".count span") 
let bullets = document.querySelector(".bullets")
let bulletsContainer = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area")
let botton = document.querySelector(".submit-button")
let resultContainer = document.querySelector(".results")
let countDownElement = document.querySelector(".count-down")

// set options
let currentIndex = 0;
let rightAnswers = 0;

function getQustion () {
  let req = new XMLHttpRequest();

  req.onreadystatechange = function (){
    if (this.status == 200 & this.readyState == 4){
      let quistionObject = JSON.parse(this.responseText)
      let qCount = quistionObject.length;
      
      getCount(qCount);

      addQutions(quistionObject[currentIndex], qCount);
      
      // count down
      countDown(30, qCount)


      botton.onclick = () => {
        
        let rightanswer = quistionObject[currentIndex].right_answer; 
        
        currentIndex++;
        
        
        checkAnswer(rightanswer, qCount)
        
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        addQutions(quistionObject[currentIndex], qCount);

        handelBullets();

        clearInterval(countDownIntervar);
        // count down
      countDown(30, qCount);

        showResults(qCount);
      } 
    }
  }

  req.open("GET", "html_questions.json", true)

  req.send();

}

getQustion()

function getCount(num){
  count.innerHTML = num;
  
  // creat bullets
  for (let i = 0; i < num; i++) {
    
    let bullet = document.createElement("span")

    if ( i == 0 ){
      bullet.className = "on"
    }
    
    bulletsContainer.appendChild(bullet)
  }
}

function addQutions(obj, count){
  if (currentIndex < count){
    let h2 = document.createElement("h2")

  let quist = document.createTextNode(`${obj.title}`)

  h2.appendChild(quist)

  quizArea.appendChild(h2)

  for (let i = 1; i <= 4; i++) {
    let mainDiv = document.createElement("div");
    mainDiv.className = "answer"

    let input = document.createElement("input");
    input.name = "quistion";
    input.id = `answer_${i}`;
    input.type =  "radio";
    input.dataset.ansewr = obj[`answer_${i}`];

    if(i == 1 ){
      input.checked = true;
    }

    let label = document.createElement("label")
    label.htmlFor = `answer_${i}`;

    let labelText = document.createTextNode(obj[`answer_${i}`])

    label.appendChild(labelText);

    mainDiv.appendChild(input)

    mainDiv.appendChild(label);

    answerArea.appendChild(mainDiv)

  }
  }
}

function checkAnswer(rAnswer, count){
  let answers = document.getElementsByName("quistion");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if(answers[i].checked){
      chosenAnswer = answers[i].dataset.ansewr; 
    }
    
  }
if (chosenAnswer == rAnswer){
  rightAnswers++;
}
}

function handelBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrBull = Array.from(bulletsSpans);

  arrBull.forEach((span, index) => {
    if (currentIndex == index){
      span.className = "on"
    }
  })
}

function showResults(count) {
  let theResult;
  if (currentIndex == count){
    botton.remove();
    answerArea.remove();
    quizArea.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count){
      theResult = `<span class="good">Good</span> ${rightAnswers} From ${count}`
    } else if(rightAnswers === count){
      theResult = `<span class="perfect">Perfect</span> All Answers Is Perfect`
    }else {
      theResult = `<span class="pad">Pad</span> ${rightAnswers} From ${count}`
    }

    resultContainer.innerHTML = theResult;
    resultContainer.style.padding = "15px"
    resultContainer.style.backgroundColor = "white"
    resultContainer.style.marginTop = "20px"
  }
}

function countDown (duration, count){
  if (currentIndex < count) { 
    let minuts, seconds;
    countDownIntervar = setInterval(function () {
      minuts = parseInt(duration / 60)
      seconds = parseInt(duration % 60)
      minuts = minuts < 10 ? `0${minuts}` : minuts;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minuts}:${seconds}`

      if (--duration < 0){
        clearInterval(countDownIntervar)
        botton.click();
      }
    }, 1000)
  }
}