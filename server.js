const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000; // Heroku -> is free, it automatically (re)deploys our apps every time that we push code to the master/main/primary branch

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
