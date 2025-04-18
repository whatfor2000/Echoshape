# Echoshape


## Prerequisites
Make sure you have the following installed:
- Python (>= 3.7)
- pip (Python package manager)
- Git (for cloning the repository)
- Virtual environment (recommended)
- Nodejs [click to download](https://nodejs.org/en)

## Installation Steps

### 1. Clone the Repository
First, download the project files by running:
```sh
git clone https://github.com/whatfor2000/Echoshape
cd Echoshape
```

### 2. Create and Activate a Virtual Environment
Create a virtual environment to keep dependencies isolated:
```sh
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
Use the following command to install all required Python libraries:
```sh
pip install -r requirements.txt
```

### 4. Run the Application
Start the Flask application with:
```sh
python app.py
```
By default, the app runs on `http://127.0.0.1:5000/`

## 5. Setup React + Vite (Frontend)

### Install Dependencies
After installing Python dependencies and following the previous steps,New terminal go into the `Frontend` folder and install the dependencies for React + Vite:

```sh
cd Frontend
npm install
```

### Run React + Vite
Once the dependencies are installed, you can run the React + Vite application with the following command:

```sh
npm run dev
```

### Build React + Vite for Production (for build)
If you need to create a production build for the React app, run:

```sh
npm run build
```

## Updating Dependencies
If you install new dependencies, update the `requirements.txt` file by running:
```sh
pip freeze > requirements.txt
```

## Troubleshooting
- If you encounter issues with missing dependencies, try reinstalling them with:
  ```sh
  pip install -r requirements.txt --no-cache-dir
  ```
- If you have problems with virtual environments, ensure it is activated before running any commands.

