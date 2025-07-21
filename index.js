const letters = document.querySelectorAll(".scoreboard-letter");
const loadingBox = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5; //capital letters it means a constant value will not change ever
const ROUNDS = 6 ;
let isLoading =true
let currentGuess = "";
let currentRow = 0;
let guessParts =[];
let wordParts =[];
let map ={};
let word =""
let done;



//*** eventsssssssss =>>>>

document.addEventListener("keydown", (e) => {
if(done || isLoading){
  return;
}

  const action = e.key;

  if (action === "Enter") {
    commit();
  } else if (action === "Backspace") {
    backspace();
  } else if (isLetter(action)) {
    addLetter(action.toUpperCase());
  } else {
     if(currentRow<ROUNDS){
       toastr.warning("please enter a valid char");
     }
    
  }
});

//***** functions =====>

//handles validation  for letters  ===>>>
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}




async function getWord(){
    setLoading(true)
    let response =await fetch(`https://words.dev-apis.com/word-of-the-day`);
    let finalResponse =await response.json();
     word = finalResponse.word.toUpperCase()
     wordParts = word.split("")
    console.log("word of today is", word)
    setLoading(false)
    isLoading= false
    done=false
   
}
getWord()

function setLoading(isLoading){
     loadingBox.classList.toggle("show",isLoading)
}

//*** add letter ==========>>>
function addLetter(letter) {
  if (currentGuess.length < ANSWER_LENGTH) {
    //to add letter in the end
    currentGuess += letter;
  } else {
    //to replace the last letter
    currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter; // if the word reach to 5 letters replace the last letter with the new letter ( لو الكلمة وصلت 5 حروف:بدل اخر حرف بالجديد)
  }

  letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
    letter; //zawd 3la elletter elly 3aleeh eldoor //example=> if the guess=2 and row =0 letters[5 * 0 + 2 - 1] = letters[1] //يبقي ده مكان الحرف اللي هيتضاف جديد
}

async function commit() {
  if (currentGuess.length != ANSWER_LENGTH) {
    return;
  }
if(currentGuess == word){
    toastr.success("Congrats you win 🥳")
    done=true
    return;
} else if(currentGuess!= word){
toastr.error(" incorrect word try another one")
}
   guessParts= currentGuess.split("")
   map = makeMap(wordParts)
//    console.log(map)
//    console.log(guessParts)
//    console.log(wordParts)

 for(let i = 0 ; i< ANSWER_LENGTH ; i++){  //loop on the row and compare array of the guess letters with the array of the word letters
if(wordParts[i]===guessParts[i]){
     letters[currentRow *ANSWER_LENGTH + i].classList.add("correct")
     map[guessParts[i]]--;

}else if (wordParts.includes(guessParts[i])){ 
         letters[currentRow *ANSWER_LENGTH + i].classList.add("close")
           map[guessParts[i]]--;

}else if (!wordParts.includes(guessParts[i])){
         letters[currentRow *ANSWER_LENGTH + i].classList.add("wrong","invalid")

}
   }

    currentRow++; //enzel line
   currentGuess = "";

   if (currentRow === ROUNDS){
    toastr.info(`you lost word was ${word}`)
   }
 
}

function backspace() {
  currentGuess = currentGuess.substring(0, currentGuess.length - 1);
  letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
}


function makeMap(arr){

    const obj ={}

    for(let i =0 ; i< arr.length ; i++){

        const letter = arr[i]
        if(obj[letter]){
            obj[letter]++;

        }else{
            obj[letter]= 1;

        }
     return obj

    }
}