const { response } = require("express");

const generateClarifaiRequestOptions = (imageUrl) => {
  const PAT = "87c6ebe774ce476e880757d5af5302f6";
  const USER_ID = "betweentwopoints";
  const APP_ID = "react-face-recognition";
  const MODEL_ID = "face-detection";
  const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };

  return {
    MODEL_ID,
    MODEL_VERSION_ID,
    requestOptions,
  };
};

const handleApiCall = (req, res) => {
  const { MODEL_ID, MODEL_VERSION_ID, requestOptions } =
    generateClarifaiRequestOptions(req.body.input);

  fetch(
    `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
    requestOptions
  )
    .then((response) => response.json())
    .then((data) => {
      res.json(data);
    })
    .catch((err) => console.log("API CALL FAILED"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("UNABLE TO GET ENTRIES"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
