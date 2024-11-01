// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load the system prompt once when the server starts
const systemPrompt = fs.readFileSync('./system_prompt.txt', 'utf-8');

// Endpoint to handle OpenAI API requests
app.post('/api/openai', async (req, res) => {
  const { combinedInput } = req.body; // Receive combinedInput from the frontend

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: combinedInput } // Pass combinedInput as user content
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Send the OpenAI response back to the frontend
    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
