# Delivery Order Price Calculator UI

This is an assignment for Wolt frontend internship.
Used to calculate the total price and price breakdown of a delivery order based on user input.
Available on

## How to Run

1. `npm install`
2. `npm run dev`
3. Go to http://localhost:5173/

## How to Use After Running

1. Enter the input field for venue name and cart value (Use home-assignment-venue-helsinki in this case)
2. Press the "Get Your Location", ensure you allow location for this website (or just enter location manually)
3. Press Calculate Delivery Price

## Features

- Validate user input thoroughly
- Provide detailed error message to user
- Frontend testing for bad input
- Accessibility
- Minimal Animation
- Responsive

## Libraries used

- Zod and React Hook Form for the ease of form validation
- SCSS for styling
- Geolib for calculating straight line distance
- Vite for bundling
- Axios for fetch
