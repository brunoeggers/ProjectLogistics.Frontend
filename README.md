# Frontend

This repository is for the frontend.

For the backend, go to <https://github.com/brunoeggers/ProjectLogistics.Backend>

## Tech Stack

React

Google Maps API

## Setup

1. Clone this repository
2. Open a terminal and navigate to the project's folder
3. Run npm i
4. Open the project in Visual Studio Code
5. Edit a file called .env in the root of the project
6. Replace `<API_KEY>` with the sent one via e-mail
7. Run the project with `npm start` from a terminal window

## Remarks

1. I've used Google Maps API to show the map and routes. There is no easy way to label all stops (waypoints). To be able to display custom labels in the map I'd need to implement a custom extension, and that is very time consuming, not feasible in this project's time frame.
2. You can trace routes for all packages assigned to a warehouse, clicking the Trace Route button in the warehouse details page. You can also trace routes for individual packages in the package details page.
