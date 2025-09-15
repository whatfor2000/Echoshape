# Echoshape
## Prerequisites
Make sure you have the following installed:

- Python (>= 3.7)

- pip (Python package manager)

- Node.js (>= 16.x) and npm (Node package manager)

- Git (for cloning the repository)

- postgresql Database

## Installation Steps
### 1. Clone the Repository
First, download the project files by running:

```bash
git clone https://github.com/whatfor2000/Echoshape
cd Echoshape
```
### 2. Set Up the Python AI Service (AIService)
This service handles the AI models and Flask API.

#### Create and Activate a Virtual Environment
It's recommended to create a virtual environment for the Python dependencies.

```Bash
# Navigate to the AIService directory
cd AIService

# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```
#### Install Dependencies
Use the following command to install all required Python libraries:
```Bash
pip install -r requirements.txt
```
#### Run the AIService
Start the Flask application with:

```Bash
python app.py
```
By default, the app runs on ```http://127.0.0.1:5000/```

### 3. Set Up the NestJS Backend
This service provides the main API for the frontend.

#### Install Dependencies
Open a new terminal and navigate to the ```backend``` folder to install its dependencies.

```Bash
# Go back to the main Echoshape folder
cd ..

# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```


#### Set Up Prisma with PostgreSQL
1. Create a Database

   - Open your PostgreSQL management tool (for example, Laragon with PostgreSQL, or pgAdmin).

   - Create a new database named:
    ```sql
    CREATE DATABASE echoshape;
    ```
2. Update Prisma Configuration
    Open the file ```backend/prisma/schema.prisma```and check the ```datasource``` block.
    Replace the connection URL with your PostgreSQL settings:
    ```prisma
    datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
    }
    ```
    Then open ```backend/.env``` and add/update: (yuou can see example in `backend/.env-example`)
    ```env
    DATABASE_URL="postgresql://postgres:your_password@localhost:5432/echoshape"
    ```
    >⚠️ Replace ```postgres``` and ```your_password``` with your actual PostgreSQL username and password
3. Run Initial Migration

    After the database is created and .env is configured, run:
    ```
    npx prisma migrate dev 
    ```
    This will create the necessary tables in the echoshape database and generate the Prisma client.

#### Run the NestJS Backend
Once the dependencies are installed, you can run the NestJS application with the following command:

```Bash
npm run start:dev
```
The NestJS server will typically run on ```http://localhost:3000/```

### 4. Set Up the React + Vite Frontend
This service handles the user interface.

#### Install Dependencies
Open another new terminal and navigate to the ```Frontend``` folder to install its dependencies.

```Bash
# Go back to the main Echoshape folder
cd ..

# Navigate to the Frontend directory
cd Frontend

# Install dependencies
npm install
```
#### Run the React + Vite Frontend
Once the dependencies are installed, you can run the React + Vite application with the following command:

```Bash
npm run dev
```
The frontend will typically run on http://localhost:5173/

## Updating Dependencies
- For Python: If you install new dependencies, update the ```requirements.txt``` file by running:

```Bash
pip freeze > requirements.txt
```
- For Node.js (Backend & Frontend): If you install a new dependency, it will automatically be added to ```package.json```. To update all packages, you can run ```npm update```.

## Troubleshooting
If you encounter issues with missing Python dependencies, ensure you're in the ```AIService``` directory and the virtual environment is activated before running ```pip install -r requirements.txt```.

For Node.js-related issues, ensure you are in the correct ```backend``` or ```Frontend``` directory before running ```npm``` commands.