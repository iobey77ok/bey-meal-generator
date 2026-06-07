/*
express creates the web server/API
cors allows frontend 5173 to talk to backend 3000
*/

import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { mealRouter } from "./routes/mealRoutes.js";

/*
create server
  app is your Express server.
  It will run on port 3000.
*/
const app = express();
const PORT = process.env.PORT || 3000;

// CORS lets the React app on a different port request data from this API.
app.use(cors());

/*
Home Route
  when open http://localhost:3000 -> It returns basic API info.
*/
app.get("/", (request, response) => {
  response.json({
    message: "Meal Generator API",
    randomMealEndpoint: "/meal/random"
  });
});

app.use("/meal", mealRouter);

/* Healthcheck Endpoint for docker or
  monitoring tools to verify the API is running and responsive.*/
app.get("/health", (request, response) => {
  response.status(200).json({ status: "UP", timestamp: new Date() });
});

// Only start listening when this file is run directly (e.g. `node server.js`),
// not when it's imported by tests via supertest.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { app };