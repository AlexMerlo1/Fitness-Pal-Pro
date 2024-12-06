
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
import traceback
from flask_cors import CORS
import jwt
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///FitPro.db'
app.config['SECRET_KEY'] = str('VerySecretKey!')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
db = SQLAlchemy(app)
# CORS(app)
migrate = Migrate(app, db)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    role = db.Column(db.Integer, default=1)  # Regular user = role 1
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    friends = db.relationship('user_friends', foreign_keys='user_friends.user_id', backref='user', lazy=True)
    friends_of = db.relationship('user_friends', foreign_keys='user_friends.friend_id', backref='friend', lazy=True)

class user_friends(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String, default='pending')
    freind_request_sent = db.Column(db.DateTime, default=datetime.utcnow)
    friend_request_accepted = db.Column(db.DateTime, nullable=True)
    __table_args__ = (
        db.UniqueConstraint('user_id', 'friend_id', name='unique_friendship'),
    )

class user_workouts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.String, nullable=False)
    workout_name = db.Column(db.String, nullable=False) 
    sets = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
class WorkoutPlan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column(db.String, nullable=False)
    workout_name = db.Column(db.String, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to Exercise model (One-to-Many)
    exercises = db.relationship('Exercise', backref='workout_plan', lazy=True)

# Define the Exercise model
class Exercise(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_name = db.Column(db.String, nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.String, nullable=False)
    video_link = db.Column(db.String, nullable=True)
    
    # Foreign key to link to WorkoutPlan
    workout_plan_id = db.Column(db.Integer, db.ForeignKey('workout_plan.id'), nullable=False)

class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String, nullable=True)
    visibility = db.Column(db.String, default='public')  # 'public' or 'private'
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow() + timedelta(days=30))
    owner = db.relationship('User', backref='owned_competitions', lazy=True)

class Award(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    competition_id = db.Column(db.Integer, db.ForeignKey('competition.id'), nullable=False)
    rank = db.Column(db.Integer, nullable=False)
    reward = db.Column(db.String, nullable=False)

    competition = db.relationship('Competition', backref='awards', lazy=True)

class UserCompetition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    competition_id = db.Column(db.Integer, db.ForeignKey('competition.id'), nullable=False)
    performance = db.Column(db.Float, nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref='user_competitions', lazy=True)
    competition = db.relationship('Competition', backref='user_competitions', lazy=True)

class GraphData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    graph_type = db.Column(db.String, nullable=False)  # Example: 'Body Weight'
    data = db.Column(db.JSON, nullable=False)  # Store graph data as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class GraphingData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to the User table
    graph_type = db.Column(db.String, nullable=False)  # e.g., 'Body Weight', 'Workout Duration'
    values = db.Column(db.JSON, nullable=False, default=[0, 0, 0, 0, 0, 0, 0])  # Store an array of 7 values

    user = db.relationship('User', backref='graph_data')

class UserGoal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    goal_name = db.Column(db.String, nullable=False)
    goal_type = db.Column(db.String, nullable=False)  # 'weekly' or 'monthly'
    date_selected = db.Column(db.DateTime, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False) # True if goal is completed
    # Relationships
    user = db.relationship('User', backref='user_goals', lazy=True)
    progress = db.Column(db.Integer, default=0)

class GoalProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_goal_id = db.Column(db.Integer, db.ForeignKey('user_goal.id'), nullable=False)
    progress = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

def get_jwt_token(request):
    # Extract the JWT token from the Authorization header
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing!"}), 401
    
    # Decode the token to get the user_id
    try:
        token = token.split(" ")[1]  # Get the token from 'Bearer <token>'
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
        return user_id
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"message": "Invalid or expired token!"}), 401

@app.before_request
def create_tables():
    db.create_all()

# Route to fetch graphing data for a specific user and graph type
@app.route('/api/graph-data/<int:user_id>/<string:graph_type>', methods=['GET'])
def get_graph_data(user_id, graph_type):
    graph_data = GraphingData.query.filter_by(user_id=user_id, graph_type=graph_type).first()
    if not graph_data:
        # Return default values if no data exists
        return jsonify([0, 0, 0, 0, 0, 0, 0])
    return jsonify(graph_data.values)


# Route to update graphing data for a specific user and graph type
@app.route('/api/graph-data/<int:user_id>/<string:graph_type>', methods=['POST'])
def update_graph_data(user_id, graph_type):
    data = request.get_json()
    values = data.get('values', [0, 0, 0, 0, 0, 0, 0])

    # Check if a record already exists
    graph_data = GraphingData.query.filter_by(user_id=user_id, graph_type=graph_type).first()
    if graph_data:
        graph_data.values = values
    else:
        # Create a new record if none exists
        graph_data = GraphingData(user_id=user_id, graph_type=graph_type, values=values)
        db.session.add(graph_data)

    db.session.commit()
    return jsonify({'message': 'Graph data updated successfully'})

    
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Received data:", data)
        if not data:
            return jsonify({"message": "No data provided"}), 400
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({"message": "email and password are required!"}), 400
        # Check if email already exists
        existing_user = db.session.query(User.id, User.email, User.password, User.role, User.date_created).filter_by(email=email).first()

        if existing_user:
            return jsonify({"message": "email already taken!"}), 400
        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"message": "username already taken!"}), 400
        # Create a new user
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(email=email, username=username,password=hashed_password, role=1)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except Exception as e:
        print(f"Error during registration: {e}")
        print(traceback.format_exc())  
        return jsonify({"message": "Internal server error"}), 500
@app.route('/search_friends', methods=['GET'])
def search_friends():
    try:
        search_term = request.args.get('search')  # Get the search term from query params
        if not search_term:
            return jsonify({"message": "Search term is required"}), 400
        
        # Query users whose username matches the search term
        users = User.query.filter(User.username.ilike(f"%{search_term}%")).all()
        
        # Return only the usernames in the response
        friends = [{"id": user.id, "username": user.username} for user in users]
        
        return jsonify({"friends": friends}), 200
    except Exception as e:
        print(f"Error during search: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

from flask import request, jsonify
import jwt

@app.route('/add_friend', methods=['POST'])
def add_friend():
    try:
        user_id = get_jwt_token(request)
        # Retrieve the user details based on user_id
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found!"}), 404
        
        # Get the username associated with the user_id
        username = user.username
        
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400
        
        friend_id = data.get('friend_id')  # Friend's ID to be added
        
        if not friend_id:
            return jsonify({"message": "Friend ID is required"}), 400

        if user_id == friend_id:
            return jsonify({"message": "You cannot add yourself as a friend"}), 400
        
        # Check if the friendship already exists
        existing_friendship = user_friends.query.filter(
            (user_friends.user_id == user_id) & (user_friends.friend_id == friend_id)
        ).first()

        if existing_friendship:
            return jsonify({"message": "Friendship already exists"}), 400
        
        # Create a new friendship record with the associated username
        new_friendship = user_friends(
            user_id=username, 
            friend_id=friend_id, 
            status='pending',
        )
        db.session.add(new_friendship)
        db.session.commit()

        return jsonify({"message": "Friend request sent successfully!"}), 201
    except Exception as e:
        print(f"Error during adding friend: {e}")
        print(traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500
@app.route('/get_workout_log', methods=['GET'])
def get_workout_log():
    try:
        # Extract user_id from JWT token
        user_id = get_jwt_token(request)

        # Retrieve the user details based on user_id
        user = User.query.get(user_id)
        print(user_id)
        if not user:
            return jsonify({"message": "User not found!"}), 404

        # Retrieve the user's workouts from the database
        workouts = user_workouts.query.filter_by(created_by=user_id).order_by(desc(user_workouts.date_created)).all()

        # Prepare the workout log
        workout_log = []
        for workout in workouts:
            workout_data = {
                "workout_name": workout.workout_name,
                "sets": workout.sets or 0,
                "reps": workout.reps or 0,
                "weight": workout.weight or 0.0,
                "date_created": workout.date_created.isoformat() if workout.date_created else None
            }
            workout_log.append(workout_data)

        # Return the workout log
        return jsonify({"workouts": workout_log}), 200

    except AttributeError as attr_err:
        print(f"Attribute error: {attr_err}")
        return jsonify({"message": "Data processing error"}), 500

    except Exception as e:
        # Catch any other general exceptions
        print(f"Error fetching workout log: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

@app.route('/friends_goals', methods=['GET'])
def get_friends_goals():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required!"}), 400

        # Get the current user's username
        current_user = User.query.filter_by(id=user_id).first()
        if not current_user:
            return jsonify({"message": "User not found!"}), 404
        current_username = current_user.username

        # Fetch friends (both directions)
        friends = db.session.query(User.username).filter(
            (user_friends.user_id == current_username) & (user_friends.status == "Accepted")
        ).union(
            db.session.query(User.username).filter(
                (user_friends.friend_id == current_username) & (user_friends.status == "Accepted")
            )
        ).all()

        friend_usernames = [friend[0] for friend in friends]

        # Fetch goals for all friends
        friend_goals = []
        for friend_username in friend_usernames:
            friend = User.query.filter_by(username=friend_username).first()
            if friend:
                goals = UserGoal.query.filter_by(user_id=friend.id).all()
                for goal in goals:
                    friend_goals.append({
                        "friend_username": friend.username,
                        "goal_name": goal.goal_name,
                        "goal_type": goal.goal_type,
                        "progress": goal.progress,
                        "completed": goal.completed
                    })

        return jsonify(friend_goals), 200
    except Exception as e:
        print(f"Error fetching friends' goals: {e}")
        return jsonify({"message": "Failed to fetch friends' goals", "error": str(e)}), 500
        
def get_workout_log():
    try:
        user_id = get_jwt_token(request)
        
        # Retrieve the user details based on user_id
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found!"}), 404

        # Retrieve the user's workouts from the database
        workouts = user_workouts.query.filter_by(created_by=user_id).order_by(desc(user_workouts.date_created)).all()

        if not workouts:
            return jsonify({"message": "No workouts found for this user!"}), 404
        
        # Prepare the workout log data
        workout_log = []
        for workout in workouts:
            workout_data = {
                "workout_name": workout.workout_name,
                "sets": workout.sets,
                "reps": workout.reps,
                "weight": workout.weight,
                "date_created": workout.date_created.isoformat()  
            }
            workout_log.append(workout_data)
        return jsonify({"workouts": workout_log}), 200

    except Exception as e:
        print(f"Error fetching workout log: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


@app.route('/get_workout_plans', methods=['GET'])
def get_workout_plan():
    # Retrieve all workout plans from the database
    workout_plans = WorkoutPlan.query.all()

    # Create a list to hold the response data
    response_data = []

    for workout in workout_plans:
        workout_data = {
            "id": workout.id,
            "created_by": workout.created_by,
            "workout_name": workout.workout_name,
            "date_created": workout.date_created,
            "exercises": []  
        }

        # Adding exercises related to this workout plan
        for exercise in workout.exercises:
            exercise_data = {
                "exercise_name": exercise.exercise_name,
                "sets": exercise.sets,
                "reps": exercise.reps,
                "weight": exercise.weight,
                "video_link": exercise.video_link
            }
            workout_data["exercises"].append(exercise_data)
        # Append the workout data to the response list
        response_data.append(workout_data)
    
    # Return the data as a JSON response
    return jsonify(response_data)



@app.route('/notifications', methods=['GET'])
def get_pending_friend_requests():
    try:
        # User ID of logged in user
        user_id = get_jwt_token(request)
        # Retrieve the user details based on user_id
        user = User.query.get(user_id)
        if user is not None:
            user_username = user.username
        if not user:
            return jsonify({"message": "User not found!"}), 404
        
        # Query all pending friend requests where the current user is the recipient
        pending_requests = user_friends.query.filter_by(
            friend_id=user_username, 
            status="pending"
        ).all()
        if not pending_requests:
            return jsonify({"message": "No pending friend requests"}), 200
        
        for req in pending_requests:
            print(f"Request ID: {req.user_id}, Friend ID: {req.friend_id}, Status: {req.status}")

        
        # Format the data for the response
        pending_requests_list = [
            {
                "user_id": req.user_id,  # Requesters username
                "friend_id": req.friend_id,  # The friend username of the current request
                "status": req.status, 
                "type": "friend-request",
            }
            for req in pending_requests
        ]

        return jsonify({"pending_requests": pending_requests_list}), 200

    except Exception as e:
        print(f"Error during fetching pending requests: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route("/accept_friend_request", methods=["POST"])
def accept_friend_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided!"}), 400
        
        user_username = data.get('user_username')
        requestor_username = data.get('requestor_username')
        print(user_username, requestor_username)
        if not user_username or not requestor_username:
            return jsonify({"message": "Missing required fields!"}), 400
        
        friend_request = user_friends.query.filter_by(
            user_id=user_username,
            friend_id=requestor_username
        ).first()

        if not friend_request:
            return jsonify({"message": "Friend request not found!"}), 404
        
        # Query for the reverse friendship (requestor -> user)
        reverse_friend_request = user_friends.query.filter_by(
            user_id=requestor_username,
            friend_id=user_username
        ).first()

        # If the reverse entry exists, remove it
        if reverse_friend_request:
            db.session.delete(reverse_friend_request)
        
        # Update the status of the original friend request to "Accepted"
        friend_request.status = "Accepted"
        
        # Commit the changes to the database
        db.session.commit()
        
        return jsonify({"message": "Friend request accepted and reverse entry removed!"}), 200

    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 500
@app.route('/challenges', methods=['GET'])
def get_challenges():
    try:
        challenges = Challenge.query.all()
        result = [
            {"id": challenge.id, "title": challenge.title, "description": challenge.description, "reward": challenge.reward}
            for challenge in challenges
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching challenges: {e}")
        return jsonify({"message": "Failed to fetch challenges"}), 500


@app.route('/has_joined', methods=['GET'])
def has_joined():
    user_id = request.args.get('user_id')
    competition_name = request.args.get('competition_name')

    if not user_id or not competition_name:
        return jsonify({"message": "User ID and competition name are required"}), 400

    competition = Competition.query.filter_by(name=competition_name).first()
    if not competition:
        return jsonify({"message": "Competition not found"}), 404

    user_competition = UserCompetition.query.filter_by(
        user_id=user_id, competition_id=competition.id
    ).first()

    return jsonify({"has_joined": user_competition is not None}), 200


@app.route('/join_competition', methods=['POST'])
def join_competition():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        competition_name = data.get('competition_name')
        performance = data.get('performance')

        if not user_id or not competition_name or performance is None:
            return jsonify({"message": "User ID, competition name, and performance are required!"}), 400

        competition = Competition.query.filter_by(name=competition_name).first()
        if not competition:
            return jsonify({"message": "Competition not found!"}), 404

        existing_entry = UserCompetition.query.filter_by(
            user_id=user_id, competition_id=competition.id
        ).first()
        if existing_entry:
            return jsonify({"message": "User has already joined this competition!"}), 400

        new_entry = UserCompetition(
            user_id=user_id,
            competition_id=competition.id,
            performance=performance
        )
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "Joined competition successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error joining competition: {e}")
        return jsonify({"message": "Failed to join competition", "error": str(e)}), 500
    
@app.route('/update_goal_progress', methods=['POST'])
def update_goal_progress():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        goal_name = data.get('goal_name')
        progress = data.get('progress')

        if not user_id or not goal_name or progress is None:
            return jsonify({"message": "User ID, goal name, and progress are required!"}), 400

        goal = UserGoal.query.filter_by(user_id=user_id, goal_name=goal_name).first()
        if not goal:
            return jsonify({"message": "Goal not found!"}), 404

        goal.progress = progress
        goal.completed = progress >= 100
        db.session.commit()

        return jsonify({"message": "Goal progress updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating goal progress: {e}")
        return jsonify({"message": "Failed to update goal progress", "error": str(e)}), 500

@app.route('/get_goal_progress', methods=['GET'])
def get_goal_progress():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"message": "User ID is required!"}), 400

    goals = UserGoal.query.filter_by(user_id=user_id).all()
    return jsonify([
        {"name": goal.goal_name, "type": goal.goal_type, "progress": goal.progress, "completed": goal.completed}
        for goal in goals
    ]), 200

@app.route('/select_weekly_goal', methods=['POST'])
def select_weekly_goal():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        goal_name = data.get('goal_name')

        if not user_id or not goal_name:
            return jsonify({"message": "User ID and goal name are required!"}), 400

        new_goal = UserGoal(user_id=user_id, goal_name=goal_name, goal_type='weekly')
        db.session.add(new_goal)
        db.session.commit()

        return jsonify({"message": "Weekly goal selected successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error selecting weekly goal: {e}")
        return jsonify({"message": "Failed to select weekly goal"}), 500

@app.route('/select_monthly_goal', methods=['POST'])
def select_monthly_goal():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        goal_name = data.get('goal_name')

        if not user_id or not goal_name:
            return jsonify({"message": "User ID and goal name are required!"}), 400

        new_goal = UserGoal(user_id=user_id, goal_name=goal_name, goal_type='monthly')
        db.session.add(new_goal)
        db.session.commit()

        return jsonify({"message": "Monthly goal selected successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error selecting monthly goal: {e}")
        return jsonify({"message": "Failed to select monthly goal"}), 500

@app.route('/add_goal', methods=['POST'])
def add_goal():
    data = request.get_json()
    user_id = data.get('user_id')
    goal_name = data.get('goal_name')
    goal_type = data.get('goal_type')

    if not user_id or not goal_name or not goal_type:
        return jsonify({"message": "User ID, goal name, and goal type are required!"}), 400

    new_goal = UserGoal(user_id=user_id, goal_name=goal_name, goal_type=goal_type)
    db.session.add(new_goal)
    db.session.commit()

    return jsonify({"message": f"Goal '{goal_name}' added successfully!"}), 201

@app.route('/remove_goal', methods=['POST'])
def remove_goal():
    data = request.get_json()
    user_id = data.get('user_id')
    goal_name = data.get('goal_name')
    goal_type = data.get('goal_type')

    if not user_id or not goal_name or not goal_type:
        return jsonify({"message": "User ID, goal name, and goal type are required!"}), 400

    goal = UserGoal.query.filter_by(user_id=user_id, goal_name=goal_name, goal_type=goal_type).first()
    if goal:
        db.session.delete(goal)
        db.session.commit()
        return jsonify({"message": f"Goal '{goal_name}' removed successfully!"}), 200

    return jsonify({"message": "Goal not found!"}), 404

@app.route('/get_user_goals', methods=['GET'])
def get_user_goals():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"message": "User ID is required!"}), 400

    goals = UserGoal.query.filter_by(user_id=user_id).all()
    return jsonify([
        {"name": goal.goal_name, "type": goal.goal_type, "completed": goal.completed}
        for goal in goals
    ]), 200

                    
@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        competition_name = request.args.get('competition_name')
        if not competition_name:
            return jsonify({"message": "Competition name is required!"}), 400

        # Fetch the competition
        competition = Competition.query.filter_by(name=competition_name).first()
        if not competition:
            return jsonify({"message": "Competition not found!"}), 404

        # Get leaderboard entries for the competition
        leaderboard = (
            db.session.query(User.username, UserCompetition.performance)
            .join(UserCompetition, User.id == UserCompetition.user_id)
            .filter(UserCompetition.competition_id == competition.id)
            .order_by(UserCompetition.performance.desc())  # Sort by performance
            .all()
        )

        # Format the leaderboard data
        result = [
            {"username": entry.username, "performance": entry.performance}
            for entry in leaderboard
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        return jsonify({"message": "Failed to fetch leaderboard", "error": str(e)}), 500

@app.route('/create_competition', methods=['POST'])
def create_competition():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        description = data.get('description', '')
        visibility = data.get('visibility', 'public')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        awards = data.get('awards', [])

        # Validate required fields
        if not user_id or not name or not start_date or not end_date:
            return jsonify({"message": "Missing required fields!"}), 400

        # Ensure dates are in correct format
        try:
            start_date = datetime.fromisoformat(start_date)
            end_date = datetime.fromisoformat(end_date)
        except ValueError:
            return jsonify({"message": "Invalid date format. Use ISO 8601 (YYYY-MM-DD)."}), 400

        # Create competition
        new_competition = Competition(
            name=name,
            description=description,
            visibility=visibility,
            owner_id=user_id,
            start_date=start_date,
            end_date=end_date,
        )
        db.session.add(new_competition)
        db.session.commit()

        # Add awards
        for award in awards:
            if 'rank' in award and 'reward' in award:
                new_award = Award(
                    competition_id=new_competition.id,
                    rank=award['rank'],
                    reward=award['reward'],
                )
                db.session.add(new_award)

        db.session.commit()
        return jsonify({"message": "Competition created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating competition: {e}")
        return jsonify({"message": "Failed to create competition", "error": str(e)}), 500

@app.route('/user_competitions_log', methods=['GET'])
def user_competitions_log():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"message": "User ID is required!"}), 400

    log_entries = (
        db.session.query(
            Competition.name.label('competition_name'),
            UserCompetition.performance,
            db.func.rank().over(
                partition_by=UserCompetition.competition_id,
                order_by=UserCompetition.performance.desc()
            ).label('rank')
        )
        .join(UserCompetition, Competition.id == UserCompetition.competition_id)
        .filter(UserCompetition.user_id == user_id)
        .all()
    )

    result = [
        {
            "competition_name": entry.competition_name,
            "performance": entry.performance,
            "rank": entry.rank
        }
        for entry in log_entries
    ]

    return jsonify(result), 200
@app.route('/competitions', methods=['GET'])
def get_competitions():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required!"}), 400

        # Get the username of the current user
        current_user = User.query.filter_by(id=user_id).first()
        if not current_user:
            return jsonify({"message": "User not found!"}), 404

        current_username = current_user.username

        # Fetch the friends' usernames (check both directions)
        friends = db.session.query(user_friends.user_id).filter(
            (user_friends.friend_id == current_username) & (user_friends.status == "Accepted")
        ).union(
            db.session.query(user_friends.friend_id).filter(
                (user_friends.user_id == current_username) & (user_friends.status == "Accepted")
            )
        ).all()

        friend_usernames = [friend[0] for friend in friends]

        # Query competitions
        competitions = Competition.query.filter(
            (Competition.visibility == 'public') |  # Public competitions
            (Competition.owner_id == user_id) |  # Competitions owned by the user
            ((Competition.visibility == 'private') & (Competition.owner_id.in_(
                [User.query.filter_by(username=username).first().id for username in friend_usernames]
            )))  # Private competitions owned by friends
        ).all()

        result = [
            {
                "id": comp.id,
                "name": comp.name,
                "description": comp.description,
                "visibility": comp.visibility,
                "owner_id": comp.owner_id,
                "date_created": comp.date_created.strftime("%Y-%m-%d"),  # Only date
                "start_date": comp.start_date.strftime("%Y-%m-%d"),  # Only date
                "end_date": comp.end_date.strftime("%Y-%m-%d"),  # Only date
            }
            for comp in competitions
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching competitions: {e}")
        return jsonify({"message": "Failed to fetch competitions", "error": str(e)}), 500


@app.before_request
def seed_default_competitions():
    from sqlalchemy.exc import IntegrityError

    try:
        print("Starting seeding process for default competitions...")
        default_competitions = [
            {
                "name": "Max Bench",
                "description": "Test your max bench press strength.",
                "visibility": "public",
                "owner_id": 1,
                "start_date": datetime.utcnow(),
                "end_date": datetime.utcnow() + timedelta(days=30),
                "awards": [
                    {"rank": 1, "reward": "$25 gift card"},
                    {"rank": 2, "reward": "$15 gift card"},
                    {"rank": 3, "reward": "$10 gift card"},
                ],
            },
            {
                "name": "Max Steps",
                "description": "Track who takes the most steps.",
                "visibility": "public",
                "owner_id": 1,
                "start_date": datetime.utcnow(),
                "end_date": datetime.utcnow() + timedelta(days=15),
                "awards": [
                    {"rank": 1, "reward": "Fitness Tracker"},
                    {"rank": 2, "reward": "$20 gift card"},
                    {"rank": 3, "reward": "Water Bottle"},
                ],
            },
            {
                "name": "Group X Class",
                "description": "Join a group fitness competition.",
                "visibility": "public",
                "owner_id": 1,
                "start_date": datetime.utcnow(),
                "end_date": datetime.utcnow() + timedelta(days=45),
                "awards": [
                    {"rank": 1, "reward": "Free Gym Membership"},
                    {"rank": 2, "reward": "$50 gift card"},
                    {"rank": 3, "reward": "Workout T-Shirt"},
                ],
            },
        ]

        for comp_data in default_competitions:
            try:
                existing_comp = Competition.query.filter_by(name=comp_data["name"]).first()
                if existing_comp:
                    continue

                print(f"Adding competition '{comp_data['name']}'...")
                new_comp = Competition(
                    name=comp_data["name"],
                    description=comp_data["description"],
                    visibility=comp_data["visibility"],
                    owner_id=comp_data["owner_id"],
                    date_created=datetime.utcnow(),
                    start_date=comp_data["start_date"],
                    end_date=comp_data["end_date"],
                )
                db.session.add(new_comp)
                db.session.flush()  # Get the competition ID for awards

                # Add associated awards
                for award_data in comp_data["awards"]:
                    new_award = Award(
                        competition_id=new_comp.id,
                        rank=award_data["rank"],
                        reward=award_data["reward"],
                    )
                    db.session.add(new_award)
                print(f"Competition '{comp_data['name']}' added successfully.")
            except IntegrityError as e:
                print(f"IntegrityError while adding competition '{comp_data['name']}': {e}")
                db.session.rollback()

        db.session.commit()
        print("Seeding process for default competitions completed successfully.")
    except Exception as e:
        print(f"Unexpected error during seeding: {e}")


@app.before_request
def seed_default_graphing_data():
    try:
        # Ensure a default user exists
        try:
            default_user = User.query.filter_by(id=1).first()
            if not default_user:
                print("Default user not found. Creating a new user...")
                default_user = User(
                    id=1,
                    username="testuser",
                    email="testuser@example.com",
                    password="securepassword",
                    role="user",
                )
                db.session.add(default_user)
                db.session.commit()  # Commit to assign the user an ID if necessary
                print("Default user created successfully.")
            else:
                print("Default user already exists.")
        except Exception as e:
            print(f"Error checking/creating default user: {e}")

        # Default data for GraphingData
        default_graphing_data = [
            {"user_id": 1, "graph_type": "Body Weight", "values": [0, 0, 0, 0, 0, 0, 0]},
            {"user_id": 1, "graph_type": "Workout Duration", "values": [0, 0, 0, 0, 0, 0, 0]},
        ]

        for data in default_graphing_data:
            try:
                print(f"Checking if data exists for graph_type: {data['graph_type']}...")
                existing_data = GraphingData.query.filter_by(
                    user_id=data["user_id"], graph_type=data["graph_type"]
                ).first()

                if not existing_data:
                    print(f"No existing data found for {data['graph_type']}. Adding new entry...")
                    new_data = GraphingData(
                        user_id=data["user_id"],
                        graph_type=data["graph_type"],
                        values=data["values"],
                    )
                    db.session.add(new_data)
                else:
                    print(f"Data already exists for {data['graph_type']}. Skipping...")
            except Exception as e:
                print(f"Error processing data for {data['graph_type']}: {e}")

        try:
            db.session.commit()  # Commit changes to the database
            print("All changes committed successfully.")
        except Exception as e:
            print(f"Error committing changes to the database: {e}")

        print("Default graphing data seeding process completed.")
    except Exception as e:
        print(f"Unexpected error in the seeding process: {e}")


@app.route('/awards', methods=['GET'])
def get_awards():
    try:
        competition_name = request.args.get('competition_name')
        if not competition_name:
            return jsonify({"message": "Competition name is required!"}), 400

        # Find the competition
        competition = Competition.query.filter_by(name=competition_name).first()
        if not competition:
            return jsonify({"message": "Competition not found!"}), 404

        # Fetch associated awards
        awards = Award.query.filter_by(competition_id=competition.id).all()
        result = [{"rank": award.rank, "reward": award.reward} for award in awards]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching awards: {e}")
        return jsonify({"message": "Failed to fetch awards", "error": str(e)}), 500
    

@app.route('/update_performance', methods=['POST'])
def update_performance():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        competition_name = data.get('competition_name')
        performance = data.get('performance')

        if not user_id or not competition_name or performance is None:
            return jsonify({"message": "User ID, competition name, and performance are required!"}), 400

        # Fetch the competition
        competition = Competition.query.filter_by(name=competition_name).first()
        if not competition:
            return jsonify({"message": "Competition not found!"}), 404

        # Fetch the user competition entry
        competition_entry = UserCompetition.query.filter_by(
            user_id=user_id, competition_id=competition.id
        ).first()

        if not competition_entry:
            return jsonify({"message": "User is not part of this competition!"}), 404

        # Update the performance
        competition_entry.performance = performance
        db.session.commit()
        return jsonify({"message": "Performance updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating performance: {e}")
        return jsonify({"message": "Failed to update performance", "error": str(e)}), 500


@app.route('/leaderboard_goal', methods=['GET'])
def get_leaderboard():
    goals = db.session.query(UserGoal.user_id, db.func.sum(UserGoal.progress).label('total_progress')).group_by(UserGoal.user_id).order_by(db.desc('total_progress')).all()
    leaderboard = [{"user_id": goal[0], "total_progress": goal[1]} for goal in goals]
    return jsonify(leaderboard), 200

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
        user = db.session.query(User.id, User.email, User.password, User.role, User.date_created).filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({"message": "Invalid email or password!"}), 401
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=2)  # Token expires in 2 hour
        }, app.config['SECRET_KEY'], algorithm='HS256')
        print({
            'message': 'Login successful!',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'date_created': user.date_created
            }
        })

        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'user_id' : user.id,
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'date_created': user.date_created
            }
        }), 200
    except Exception as e:
        print(f"Error during login: {e}")
        print(traceback.format_exc()) 
        return jsonify({"message": "Internal server error", "error": str(e)}), 500
        
def get_ordinal_suffix(day):
    if 10 <= day <= 20:  
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    return f"{day}{suffix}"

@app.route('/profile/<friend_id>', methods=['GET'])
def get_profile(friend_id):
    try:
        # Query the User table to find the user with the given username
        user = User.query.filter_by(username=friend_id).first()
        
        # Check if the user exists
        if not user:
            return jsonify({"message": "Profile not found"}), 404
        
        # Count the number of accepted friends
        friend_count = user_friends.query.filter(
            ((user_friends.user_id == user.username) | (user_friends.friend_id == user.username)) & 
            (user_friends.status == 'Accepted')
        ).count()
        
        # Query the latest workouts (limit to last 5 workouts ordered by date)
        latest_workouts = user_workouts.query.filter_by(created_by=user.id) \
            .order_by(user_workouts.date_created.desc()) \
            .limit(5).all()
        workouts_data = [
            {
                "workout_name": workout.workout_name,
                "date_created": workout.date_created.strftime('%Y-%m-%d %H:%M:%S'),
            }
            for workout in latest_workouts
        ]
        
        # Build the profile response
        profile_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": f"Created account on {user.date_created.strftime('%B ')}{get_ordinal_suffix(user.date_created.day)}, {user.date_created.strftime('%Y')}",
            "friends_count": friend_count,
            "latest_workouts": workouts_data
        }

        return jsonify(profile_data), 200
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({"message": "Internal server error"}), 500

@app.route("/create_custom_workout", methods=["POST"])
def create_custom_workout():
    try:
        created_by = get_jwt_token(request)
        
        # Ensure created_by is a valid user ID
        if not created_by:
            return jsonify({"message": "User not authenticated!"}), 401
        
        # Get the workout data from the request
        data = request.get_json()
        
        if not data:
            return jsonify({"message": "No data provided!"}), 400
        
        workout_name = data.get('workout_name')
        sets = data.get('sets')
        reps = data.get('reps')
        weight = data.get('weight')
        
        # Create the new workout object
        new_workout = user_workouts(
            created_by=created_by, 
            workout_name=workout_name,
            sets=sets,
            reps=reps,
            weight=weight,
            date_created=datetime.utcnow()
        )
        
        # Add the new workout to the database and commit
        db.session.add(new_workout)
        db.session.commit()
        
        return jsonify({"message": "Workout added successfully!"}), 201
    
    except Exception as e:
        print(f"Error adding workout: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500

from app import db, user_friends

def initialize_database():
    with app.app_context():
        try:
            db.create_all()
            default_user = User.query.filter_by(id=1).first()
            if not default_user:
                default_user = User(id=1, username="testuser", email="testuser@example.com", password="password", role="user")
                db.session.add(default_user)
                print("Default user added.")

            default_data = [
                {"user_id": 1, "graph_type": "Body Weight", "values": [0, 0, 0, 0, 0, 0, 0]},
                {"user_id": 1, "graph_type": "Workout Duration", "values": [0, 0, 0, 0, 0, 0, 0]},
            ]

            for entry in default_data:
                existing_data = GraphingData.query.filter_by(user_id=entry["user_id"], graph_type=entry["graph_type"]).first()
                if not existing_data:
                    graph_data = GraphingData(**entry)
                    db.session.add(graph_data)

            db.session.commit()
            print("Database initialized and data committed.")
        except Exception as e:
            print(f"Error initializing database: {e}")


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
