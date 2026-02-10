let pets = ['goldfish', 'dog', 'rhino'];

console.log(pets.length);

pets[3] = "bunny";

console.log(pets);

pets.push('lizard');

console.log(pets);

const steps = ['one', 'two', 'three'];

//.forEach call a function for every item in the array

// steps.forEach(function(item){
//     console.log(item);
// })

steps.forEach(showSteps);

function showSteps(step){
    console.log(step);
}

// .map also calls a function but create a new array from the original array

let myList = document.querySelector("#myList");

const stepsHtml = steps.map(listTemplate);

function listTemplate(item) {
    return `<li>${item}</li>`;
}
myList.innerHTML = stepsHtml.join('');


//.map

let grades = ['a', 'a', 'a'];

let points;

let gpaPoints = grades.map(convert);

function convert(grade) {
    // grade = grade.toUpperCase();
    switch (grade.toUpperCase()) {
        case 'A':
            points = 4;
            break
        case 'B':
            points = 3;
            break
        case 'C':
            points = 2;
            break
        case 'D':
            points = 1;
            break
        case 'F':
            points = 0;
            break
        default:
            alert('not a valid grade');
    }
    return points;
}
console.log(gpaPoints)
console.log(grades);


//.reduce - reduce down to a single calue wiht an accumulator

let totalPoints = gpaPoints.reduce(getTotal);

function getTotal(total, item){
    return total + item;
}

console.log(totalPoints);
let gpaAverage = totalPoints/gpaPoints.length;
console.log(gpaAverage);


// .filer make a new array but inky items that pass a certain condition

const words = ['watermelon', 'peach', 'apple', 'tomato', 'grape'];

const shortWords = words.filter(function(word){
    return word.length < 6;
})

console.log(shortWords);