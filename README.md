Simple ChatGPT Server Application
This is a Node.js server application that integrates with OpenAI's GPT-3.5 model to provide chatbot functionalities. It uses Server-Sent Events (SSE) to push real-time responses back to the client.

Features
SSE for real-time response streaming.
Integration with OpenAI's GPT-3.5 model.
Basic express server setup with structured routes.
Prerequisites
Node.js
npm (Node.js package manager)
OpenAI API Key

Installation
Clone the repository
**git clone https://github.com/your-repository.git
cd your-repository**

**npm install**

Set up environment variables:
Create a .env file in the root directory and add your OpenAI API key:
**CHAT_GPT_API_KEY=your_openai_api_key**

Running the Server
npm start
