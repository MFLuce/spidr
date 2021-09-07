const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/spidr")
  .then((x) => {
    console.log(`Connected to the db`);
  })
  .catch((err) => {
    console.error(`Oppsie, didnt connect to the db`);
  });
