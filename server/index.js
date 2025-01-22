import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import huggingFaceRoutes from './routes/dalle.routes.js';  // Import Hugging Face routes

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Use Hugging Face routes
app.use('/api/v1/huggingface', huggingFaceRoutes);  // Hugging Face route for image generation

app.get('/', (req, res) => {
  res.status(200).json({ message: "Hello from Hugging Face API" });
});

app.listen(8080, () => console.log('Server has started on port 8080'));








// import express from 'express';
// import * as dotenv from 'dotenv';
// import cors from 'cors';

// import dalleRoutes from './routes/dalle.routes.js'

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "50mb" }))

// app.use('/api/v1/dalle',dalleRoutes)

// app.get('/', (req,res) => {
//     res.status(200).json({ message: "Hellow from Dalle" })
// })

// app.listen(8080, ()=> console.log('Server has started on port 8080'))