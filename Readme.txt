how to install :

Terminal 1:

cd server
python -m venv venv
.\venv\Scripts\activate
pip install torch --index-url https://download.pytorch.org/whl/cu121
pip install -r .\requirements.txt
python main.py
uvicorn main:app --reload


Terminal 2:

cd client
npm i
npm run dev

(client
server
.gitignore
firstTime.txt)-3D shirt

(admin
backend
frontend
node_modules
.gitattributes
package.json
package-lock.json
)



Forever fullstack:

Terminal 1:

chatbot:
cd frontend
cd src
python app.py



Terminal 2:

cd frontend
npm run dev



Terminal 3:

cd backend
npm start



Terminal 4:

cd admin
npm run dev

