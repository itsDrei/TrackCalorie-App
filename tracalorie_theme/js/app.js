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
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    this._render();
  }
  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
  }

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
        const remaining = this._calorieLimit - this._totalCalories;

        calorieRemains.innerText = remaining
    }
  _render() {
    this._showCalorieTotal();
    this._calorieConsumed();
      this._calorieBurned();
      this._calorieRemaining();
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

const tracker = new CalorieTracker();
const breakfast = new Meal("Breakfast", 500);
const workout = new Workout("Cardio",100);
tracker.addMeal(breakfast);
tracker.addWorkout(workout);
