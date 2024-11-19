from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_sqlalchemy import SQLAlchemy
import traceback
from flask_cors import CORS
import jwt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///FitPro.db'
app.config['SECRET_KEY'] = str('VerySecretKey!')
db = SQLAlchemy(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.Integer, default=1)  # Regular user = role 1
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

@app.before_request
def create_tables():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        print("Received data:", data)

        if not data:
            return jsonify({"message": "No data provided"}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "email and password are required!"}), 400

        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"message": "email already taken!"}), 400

        # Create a new user
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!"}), 201

    except Exception as e:
        # Log the error and stack trace for debugging purposes
        print(f"Error during registration: {e}")
        print(traceback.format_exc())  # Prints the full stack trace
        return jsonify({"message": "Internal server error"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data provided!"}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required!"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Invalid email or password!"}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
        }, app.config['SECRET_KEY'], algorithm='HS256')  # SECRET_KEY is a string

        return jsonify({
            'message': 'Login successful!',
            'token': token
        }), 200

    except Exception as e:
        print(f"Error during login: {e}")
        print(traceback.format_exc())  # Prints the full stack trace
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

if __name__ == '__main__':
    db.create_all()  
    app.run(debug=True)
