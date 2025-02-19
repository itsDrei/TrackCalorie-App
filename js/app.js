class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

    //display data
    this._showCalorieTotal();
    this._showCalorieLimit();
    this._calorieConsumed();
    this._calorieBurned();
    this._calorieRemaining();
    this._displayCalorieProgress();
  }

  //public methods

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._displayMeals(meal);
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._displayWorkout(workout);
    this._render();
  }
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      this._meals.splice(index, 1);
      this._render();
    }
  }
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._render();
  }
  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    this._showCalorieLimit();
    this._render();
  }

  //private methods
  _showCalorieTotal() {
    const caloryTotal = document.getElementById("calories-total");
    caloryTotal.innerText = this._totalCalories;
  }
  _showCalorieLimit() {
    const caloryLimit = document.getElementById("calories-limit");
    caloryLimit.innerText = this._calorieLimit;
  }
  _calorieConsumed() {
    const calorieConsumed = document.getElementById("calories-consumed");
    const calorieConsumedData = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    calorieConsumed.innerText = calorieConsumedData;
  }
  _calorieBurned() {
    const calorieBurned = document.getElementById("calories-burned");
    const calorieBurnedData = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    calorieBurned.innerText = calorieBurnedData;
  }
  _calorieRemaining() {
    const calorieRemains = document.getElementById("calories-remaining");
    const progEl = document.getElementById("calorie-progress");
    const remaining = this._calorieLimit - this._totalCalories;

    calorieRemains.innerText = remaining;

    if (remaining <= 0) {
      calorieRemains.parentElement.parentElement.classList.remove("bg-light");
      calorieRemains.parentElement.parentElement.classList.add("bg-danger");
      progEl.classList.remove("bg-success");
      progEl.classList.add("bg-danger");
    } else {
      calorieRemains.parentElement.parentElement.classList.remove("bg-danger");
      calorieRemains.parentElement.parentElement.classList.add("bg-light");
      progEl.classList.add("bg-success");
      progEl.classList.remove("bg-danger");
    }
  }
  _displayCalorieProgress() {
    const progEl = document.getElementById("calorie-progress");
    const progress = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(progress);

    progEl.style.width = `${width}%`;
  }
  _displayMeals(meal) {
    const mealEl = document.getElementById("meal-items");
    const newMeal = document.createElement("div");
    newMeal.classList.add("card", "my-2");
    newMeal.setAttribute("data-id", meal.id);
    newMeal.innerHTML = `
      <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;
    mealEl.appendChild(newMeal);
  }
  _displayWorkout(workout) {
    const workoutEl = document.getElementById("workout-items");
    const newworkout = document.createElement("div");
    newworkout.classList.add("card", "my-2");
    newworkout.setAttribute("data-id", workout.id);
    newworkout.innerHTML = `
      <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
    `;
    workoutEl.appendChild(newworkout);
  }
  _render() {
    this._showCalorieTotal();
    this._calorieConsumed();
    this._calorieBurned();
    this._calorieRemaining();
    this._displayCalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}
class App {
  constructor() {
    this._tracker = new CalorieTracker();

    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItem.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItem.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const item = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (item.value === "" || calories.value === "") {
      alert("Please enter a value!");
      return;
    }

    if (type === "meal") {
      const addMeal = new Meal(item.value, +calories.value);
      this._tracker.addMeal(addMeal);
    } else {
      const addWorkout = new Workout(item.value, +calories.value);
      this._tracker.addWorkout(addWorkout);
    }

    item.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const newCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }
  _filterItem(type, e) {
    const text = e.target.value.toLowerCase();
    let matchFound = false;
    const message = document.getElementById(`${type}-message`); // Message specific to type

    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;

      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "block";
        matchFound = true;
      } else {
        item.style.display = "none";
      }
    });

    // Handle the message visibility AFTER looping through all items
    if (message) {
      message.style.display = matchFound ? "none" : "block";
    }
    document.body.addEventListener("click", () => {
      message.style.display = "none";
    });
  }
  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }
  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");
    

    if (limit.value === '') {
      alert('Please add a limit');
      return;
    } 

    this._tracker.setLimit(+limit.value)
    limit.value = ''

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
