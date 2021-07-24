const meals = document.getElementById('meals');
const favContainer = document.getElementById('fav-meals')

const mealPopup = document.getElementById('meal-popup')
const popupCloseBtn = document.getElementById('close')
const mealInfoEl = document.getElementById('mealRecipe')

const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')
for(var i=0;i<50;i++){
    getRandomMeal();
}
fetchfavMeals();

async function getRandomMeal(){

    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true);
}

async function getMealsByid(id){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}

async function getMealsBySearch(term){
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term);

    const respData = await resp.json();
    const meal = respData.meals;
    return meal;
}

function addMeal(mealData, random = false){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
                <div class="meal-header">
                ${random ? `<span class="random">${mealData.strCategory}</span>` : ' '}
                
                    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <button id="wishlist" onclick=""><i class="fas fa-heart"></i>
                       </button>
                </div>`;
    const btn = meal.querySelector("#wishlist");
    btn.addEventListener('click',()=>{
        if(btn.classList.contains("active")){
            removeMealLS(mealData.idMeal)
            btn.classList.remove("active")
        }else{
            addMealLS(mealData.idMeal)
            btn.classList.add("active")
        }
        fetchfavMeals();
    })

    meal.addEventListener('click', ()=>{
        showMealInfo(mealData)
    })
    meals.appendChild(meal); 
}

function removeMealLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function addMealLS(mealId){
    const mealIds = getMealsLS();

    localStorage.setItem('mealIds', JSON.stringify([...mealIds,mealId]));
}

function getMealsLS(){
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds == null ? [] : mealIds;
}

async function fetchfavMeals(){

    favContainer.innerHTML = " ";
    const mealIds = getMealsLS();

    for(let i=0;i<mealIds.length;i++){
        const mealId = mealIds[i];
        meal = await getMealsByid(mealId);
        addMealTofav(meal);
    }
}

function addMealTofav(mealData){
    const favmeal = document.createElement('li');
   
    favmeal.innerHTML = `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"><span>${mealData.strMeal}</span><button class="clear"><i class="far fa-times-circle"></i></button>
    </li>`;

    const btn = favmeal.querySelector('.clear');
    btn.addEventListener('click', ()=>{
        removeMealLS(mealData.idMeal)
        fetchfavMeals()
    });
    favmeal.addEventListener('click', ()=>{
        showMealInfo(mealData)
    })
    favContainer.appendChild(favmeal); 
}

function showMealInfo(mealData){
    mealInfoEl.innerHTML= ` `;
    const mealEl = document.createElement('div');
    
    mealEl.innerHTML = `
                <h1>${mealData.strMeal}</h1> 
                <img src="${mealData.strMealThumb}" alt="">

                <p>${mealData.strInstructions}</p>
                `

    mealInfoEl.appendChild(mealEl)

    mealPopup.classList.remove('hidden')
}

searchBtn.addEventListener('click',async () =>{
    const search = searchTerm.value;
    const meals = await getMealsBySearch(search)
    removeMeal();
    meals.forEach((meal) =>{
        addMeal(meal);
    })
})

function removeMeal(){
    meals.innerHTML = ` `
}


popupCloseBtn.addEventListener('click',()=>{
    mealPopup.classList.add('hidden');
})
