import express from 'express';
import * as dotenv from 'dotenv';
import axios from 'axios'; // Using axios to make HTTP requests

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// Use the API key from the environment variable
const DEEP_IMAGE_API_URL = 'https://deep-image.ai/rest_api/process_result'; // Replace with the actual Deep Image API endpoint
const DEEP_IMAGE_API_KEY = process.env.DEEP_IMAGE_API_KEY; // API key from .env file

router.route('/').get((req, res) => {
    res.status(200).json({ message: "Hello from Deep Image Routes" });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        // Request payload for Deep Image API (adjust based on the actual API documentation)
        const requestBody = {
            prompt: prompt,
            enhancements: ["denoise", "deblur", "light"], // Example enhancements, adjust as needed
        };

        // Make a POST request to Deep Image API using axios
        const response = await axios.post(DEEP_IMAGE_API_URL, requestBody, {
            headers: {
                'Authorization': `Bearer ${DEEP_IMAGE_API_KEY}`, // Use API key from .env
                'Content-Type': 'application/json',
            }
        });

        // Assuming the Deep Image API returns the image in a format like 'b64_json'
        const image = response.data.result; // Adjust this based on the actual API response structure

        res.status(200).json({ photo: image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something Went Wrong" });
    }
});

export default router;










///////////////////////////////////////////////////////////////////////////////////////////////////////////

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




///////////////////////////////////////////////////////////////////////////////////////////////////////////
// the below code is not working so importing other way
// import { Configuration, OpenAIApi } from 'openai'; 
// dont need the Configuration bec can be done directly now
// so the below code is changed
// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// import express from 'express';
// import * as dotenv from 'dotenv';
// import { Configuration, OpenAIApi} from 'openai';

// dotenv.config();

// const router = express.Router();

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// router.route('/').get((req, res) => {
//   res.status(200).json({ message: "Hello from DALL.E ROUTES" })
// })

// router.route('/').post(async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const response = await openai.createImage({
//       prompt,
//       n: 1,
//       size: '1024x1024',
//       response_format: 'b64_json'
//     });

//     const image = response.data.data[0].b64_json;

//     res.status(200).json({ photo: image });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Something went wrong" })
//   }
// })

// export default router;