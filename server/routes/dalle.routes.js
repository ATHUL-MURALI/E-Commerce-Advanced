import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';

const router = express.Router();

// Replace with your Hugging Face API key
const API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_ID = "stabilityai/stable-diffusion-2";  // The model ID

// Function to generate an image using Hugging Face API
const generateImage = async (prompt) => {
  const API_URL = `https://api-inference.huggingface.co/models/${MODEL_ID}`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    inputs: prompt,
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.buffer();  // Get the response as a buffer (binary data)

    // Specify the path to save the image
    const savePath = "C:/Users/anith/Desktop/temp/output_hf.png";  // Update this to your desired path
    fs.writeFileSync(savePath, result);
    console.log(`Image saved as ${savePath}`);
    return savePath;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// POST route to generate an image
router.route('/generate-image').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    // Generate the image using the Hugging Face API
    const imagePath = await generateImage(prompt);

    // Respond with the path where the image is saved
    res.status(200).json({ imagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
});

export default router;






















// import express, { response } from 'express';
// import * as dotenv from 'dotenv';
// import OpenAI from 'openai';
// import { DallEAPIWrapper } from "@langchain/openai";

// dotenv.config();

// const router = express.Router();

// // const openai = new OpenAI({
// //     apiKey: process.env.OPENAI_API_KEY,
// // });

// router.route('/').get((req,res) => {
//     res.status(200).json({message: "Hello from DALL.E Routes"})
// })

// router.route('/').post(async(req,res) => {
//     // try {
//         // const { prompt } = req.body;
//         // const response = await openai.createImage({
//         //     prompt,
//         //     n: 1,
//         //     size: '1024x1024',
//         //     response_format: 'b64_json'
//         //   });

//         // const image = response.data.data[0].b64_json;

//         const response = await fetch("https://api.openai.com/v1/images/generations", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//             body: JSON.stringify({
//                 prompt: "a painting of a cat",
//                 n: 1,
//                 size: "1024x1024",
//             }),
//         });
//         const data = await response.json();
//         console.log(data);
        
          
//     // }   

//     //     res.status(200).json({ photo: image });
//     // } catch (error) {
//     //     console.error(error);
//     //     res.status(500).json({ message: "Something Went Wrong" })
//     //}
// })

// export default router;






// import express, { response } from 'express';
// import * as dotenv from 'dotenv';
// import OpenAI from 'openai';

// dotenv.config();

// const router = express.Router();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// router.route('/').get((req,res) => {
//     res.status(200).json({message: "Hello from DALL.E Routes"})
// })

// router.route('/').post(async(req,res) => {
//     try {
//         const { prompt } = req.body;
//         const response = await openai.createImage({
//             prompt,
//             n: 1,
//             size: '1024x1024',
//             response_format: 'b64_json'
//           });

//         const image = response.data.data[0].b64_json;

//         res.status(200).json({ photo: image });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Something Went Wrong" })
//     }
// })

// export default router;

























