const search = document.getElementById('search'),
submit = document.getElementById('submit'),
random = document.getElementById('random-btn'),

mealsEl = document.getElementById('meals'),
resultHeading = document.getElementById('result-heading'),
singleMealEl = document.getElementById('single-meal');


// search Meal and fetch form api

function searchMeal(e){
e.preventDefault();

// clear
mealsEl.innerHTML = '';
singleMealEl.innerHTML = '';

// get search term
const term = search.value;

// check for empty
if (term.trim()){
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {

        resultHeading.innerHTML = `<h2>Search result for '${term}'</h2>`

        if (data.meals === null){
            resultHeading.innerHTML = '<p>There are no search results. Try again!</p>'
        } else{
            mealsEl.innerHTML = data.meals.map(meal => `
            
            <div class='meal'>
            <img class='thumbnail' src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
            <div class='meal-info' data-mealid='${meal.idMeal}'>
            <h3>${meal.strMeal}</h3>
            </div>
            </div>
            `).join('');
        }
    
    })
search.value = '';
}

else{
    alert('Please enter a search term')
}

}

// fetch Meal By Id
const getMealById = mealID => {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    fetch(url)
        .then(res => res.json())
        .then(data => {addToDom(data.meals[0])});
}

// Fetch Random Meals
const getRandomMeal = () =>{
    // clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => addToDom(data.meals[0]))
}
// Add Meal to DOM
function addToDom(meal){
    mealsEl.innerHTML = '';
    const ingredients = [];
    for (let i = 1; i<=20; i++ ){
        if (meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)

        } else {
            break
        }
    }

    singleMealEl.innerHTML = `
<div class='single-meal'>
<h1>${meal.strMeal}</h1>
<img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
<div class='single-meal-info'>
${meal.strCategory ? `<p> ${meal.strCategory}</p>` : ''}
${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
</div>
<div class="main">
<p>${meal.strInstructions}</p>
<h2>Ingredients</h2>
<ul>
${ingredients.map(ing => `<li>${ing} </li>`).join('')}
</ul>
</div>
<div onclick="clearData()"><button class='clear-btn'> Clear data</button></div>
</div>`

}

// clear page
const clearData = () => {
    
    mealsEl.innerHTML = '';
    singleMealEl.innerHTML = '';
    
}

// Event Listeners

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal)


mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item =>  
        {
            if(item.classList){
             return item.classList.contains('meal-info');

            } else{
                return false;
            }
        })
        if(mealInfo){
            const mealID = mealInfo.getAttribute('data-mealid')
            getMealById(mealID)
        }
})
