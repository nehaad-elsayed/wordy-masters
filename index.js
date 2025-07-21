//&&&&&&&&&&&&&&&&& Global
const letters = document.querySelectorAll(".scoreboard-letter");
const loadingBox = document.querySelector(".info-bar");
const logo =document.querySelector(".brand")
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
let validWord=""


//***&&&&&&&&& eventsssssssss =>>>>

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

//*****&&&&&&&& functions =====>

//to handle validation  for letters  ===>>>
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



//&&&&&&&& add letter ==========>>>
function addLetter(letter) {
  if (currentGuess.length < ANSWER_LENGTH) {
    //to add letter in the end
    currentGuess += letter;
  } else {
    //to replace the last letter
    currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter; // if the word reach to 5 letters replace the last letter with the new letter ( لو الكلمة وصلت 5 حروف:بدل اخر حرف بالجديد)
  }

  letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =letter; //zawd 3la elletter elly 3aleeh eldoor //example=> if the guess=2 and row =0 letters[5 * 0 + 2 - 1] = letters[1] //يبقي ده مكان الحرف اللي هيتضاف جديد
}


//&&&&&&&&&& to  commit when press enter 
async function commit() {
  if (currentGuess.length != ANSWER_LENGTH) {
    return;
  }

isLoading=true
setLoading(true)

const response = await fetch(`https://words.dev-apis.com/validate-word`,
  {
    method:"POST",
    body:JSON.stringify({word : currentGuess}),
    headers:{
      "content-type":"application/json"
    }
  }
)
const data =await response.json()
validWord= data.validWord
console.log(validWord)
isLoading= false
setLoading(false)


guessParts= currentGuess.split("")
map = makeMap(wordParts)
  

 for(let i = 0 ; i< ANSWER_LENGTH ; i++){  //loop on the row and compare array of the guess letters with the array of the word letters
if(wordParts[i]===guessParts[i]){
     letters[currentRow *ANSWER_LENGTH + i].classList.add("correct")
     map[guessParts[i]]--;

}else if (wordParts.includes(guessParts[i])&& map[guessParts[i]]>0){ 
         letters[currentRow *ANSWER_LENGTH + i].classList.add("close")
           map[guessParts[i]]--;

}else if (!wordParts.includes(guessParts[i])){
letters[currentRow *ANSWER_LENGTH + i].classList.add("wrong","invalid")
        
}
   }

  currentRow++; //enzel line

if (currentRow === ROUNDS && currentGuess !== word) {
  toastr.info(`You lost! The word was ${word}`);
  done = true;
}
if (currentGuess === word) {
  toastr.success("Congrats you win 🥳");
  logo.classList.add("winner")
  done = true;
  return;
} else if (!validWord) {
  toastr.error("Incorrect guess");
  
} 
 currentGuess=""  
}


//*****&&&&&&& to backspace 
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
    

    }
     return obj 
}

function setLoading(isLoading){
     loadingBox.classList.toggle("show",isLoading)
}