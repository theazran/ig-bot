require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const { IgApiClient, IgCheckpointError } = require("instagram-private-api");
const { get } = require("request-promise");
const CronJob = require("cron").CronJob;

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  const imageBuffer = await get({
    url: "https://ichef.bbci.co.uk/news/800/cpsprodpb/16CE/production/_105483850_35a5b348-5c3f-45ca-94d7-4210aebc1a8e.jpg",
    encoding: null,
  });

  await ig.publish.photo({
    file: imageBuffer,
    caption: "Hello friends..!",
  });
};

const cronInsta = new CronJob("30 5 * * *", async () => {
  postToInsta();
});

cronInsta.start();
