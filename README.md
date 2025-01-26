# Delivery Order Price Calculator UI

2 Minute VIDEO DEMO: [YouTube Link](https://youtu.be/743--y52qew)

- This is an assignment for Wolt frontend internship.
- Used to calculate the total price and price breakdown of a delivery order based on user input.

## How to Run

1. `npm install`
2. `npm run dev`
3. Go to http://localhost:5173/

## How to Use After Running

1. Enter the input field for venue slug and cart value (Use home-assignment-venue-helsinki in this case, other slugs would work too but just this)
2. Press the "Get Your Location", ensure you allow location for this website (or just enter location manually)
3. Press Calculate Delivery Price

## Features

- Validate user input thoroughly
- Provide detailed error message to user
- Unit Testing for utility functions
- Accessibility
- Minimal Animation
- Responsive

## UI

![Demo image 1](./public/demo1.png?raw=true "UI")
![Demo image 2](./public/demo2.png?raw=true "UI")
![Demo image 3](./public/demo3.png?raw=true "UI")
![Demo image 4](./public/demo4.png?raw=true "UI")

## Libraries used

- Zod and React Hook Form for the ease of form validation
- SCSS for styling
- Geolib for calculating straight line distance
- Vite for bundling
- Axios for fetch
- Vitest for unit testing
