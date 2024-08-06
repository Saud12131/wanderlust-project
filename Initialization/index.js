const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listings.js");
const { object } = require("joi");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to database ");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initdb = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "669fbe06084b7a298988ff53"}));
    await listing.insertMany(initdata.data);
    console.log("data was saved");
};
initdb();