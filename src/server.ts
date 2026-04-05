import app from "./app";

/**
 * Define the port to run the server on
 * Uses the PORT environment variable if available, otherwise defaults to 3000
 */
const PORT = process.env.PORT || 3001;

/**
 * Start the Express server and listen on the defined port
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
