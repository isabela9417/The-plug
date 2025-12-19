# AI Resume Builder & Career Optimizer
A React-based intelligent resume generation system designed to help users create ATS-friendly resumes. This application uses Generative AI to analyze job descriptions and tailor user experience to match specific industry keywords.

Group Project  - Hertech Hive

# 🚀 Technologies Used
Frontend: React (Vite), TypeScript

Styling: Tailwind CSS, Shadcn UI

AI Integration: Vercel AI SDK / OpenAI API

State Management: React Hooks & Context

Persistence: Browser LocalStorage (Privacy-first architecture)

# 🛠️ Setup & Installation Instructions
Follow these steps to run the application locally on your machine.

1. Prerequisites
Ensure you have Node.js (v18 or higher) and npm installed.

Download Node.js

2. Clone the Repository
Open your terminal and run the following commands to download the project:

Bash

# Clone the repository
git clone <YOUR_GITHUB_REPO_URL_HERE>

# Navigate into the project directory
cd <YOUR_PROJECT_FOLDER_NAME>
3. Install Dependencies
Install the required packages (React, Tailwind, AI SDK, etc.):

Bash

npm install
4. Configuration (API Keys)
This project requires an OpenAI API key to power the AI features (Resume Generation & ATS Scoring).

Create a file named .env in the root directory of the project.

Copy the content below into the file:

Code snippet

# Get your key from https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=your_sk_key_starts_with_sk-...
(Note: If you are using the Client-Side "Bring Your Own Key" mode we built, you can skip this step, as the app will ask for the key in the UI settings).

5. Run the Local Server
Start the development server:

Bash

npm run dev
The terminal will show a local URL (usually http://localhost:8080 or http://localhost:5173).

Open that link in your browser to view the app.

📝 Usage Guide
Dashboard: Navigate to the main dashboard to see your application history.

Builder: Click "New Application" to start the 3-step wizard.

Export: On the preview screen, click "Export PDF" to generate the final ATS-friendly document.

⚠️ Troubleshooting
Build Errors: If npm install fails, try deleting the node_modules folder and package-lock.json file, then run npm install again.

AI Not Working: Ensure your API key has credits and is correctly pasted in the .env file or the App Settings modal.
