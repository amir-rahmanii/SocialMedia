// imports
const { default: mongoose } = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

// load env
const productionMode = process.env.NODE_ENV === "production";
if (!productionMode) {
  dotenv.config();
}

//db connection
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    console.error(`err to DB connection ${error}`);
    process.exit(1);
  }
}

// runing server
function startServer() {
  const port = process.env.PORT || 4002;
  app.listen(port, () => {
    console.log(
      `server runing in ${
        productionMode ? "production" : "developMent"
      } on port ${port}`
    );
  });
}
// run server.js

async function run() {
  await connectToDb();
  startServer();
}
run();
