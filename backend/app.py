
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_sqlalchemy import SQLAlchemy
import traceback
from flask_cors import CORS
import jwt
from flask_migrate import Migrate
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///FitPro.db'
app.config['SECRET_KEY'] = str('VerySecretKey!')
db = SQLAlchemy(app)
CORS(app)
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

class Challenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    reward = db.Column(db.Integer, nullable=False)

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    duration = db.Column(db.Integer, nullable=False)  # in minutes
    calories = db.Column(db.Integer, nullable=False)

class Milestone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    progress = db.Column(db.Integer, nullable=False)  # percentage progress
    goal = db.Column(db.String, nullable=False)

class UserChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenge.id'), nullable=False)
    date_selected = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    user = db.relationship('User', backref='user_challenges', lazy=True)
    challenge = db.relationship('Challenge', backref='user_challenges', lazy=True)

class UserWorkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=True)
    sets = db.Column(db.Integer, nullable=True)
    reps = db.Column(db.Integer, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    date_selected = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    user = db.relationship('User', backref='user_workouts', lazy=True)
    workout = db.relationship('Workout', backref='user_workouts', lazy=True)

class UserMilestone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestone.id'), nullable=False)
    date_selected = db.Column(db.DateTime, default=datetime.utcnow)
    # Relationships
    user = db.relationship('User', backref='user_milestones', lazy=True)
    milestone = db.relationship('Milestone', backref='user_milestones', lazy=True)

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


class UserCompetition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    competition_name = db.Column(db.String, nullable=False)
    performance = db.Column(db.Float, nullable=False)  # Initial performance is required
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

class CustomWorkout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String, nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='custom_workouts', lazy=True)


class WorkoutLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_name = db.Column(db.String, nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    date_logged = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='workout_logs', lazy=True)

class Competition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String, nullable=True)
    visibility = db.Column(db.String, default='public')  # 'public' or 'private'
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    owner = db.relationship('User', backref='owned_competitions', lazy=True)

class GoalProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_goal_id = db.Column(db.Integer, db.ForeignKey('user_goal.id'), nullable=False)
    progress = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)



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

@app.route('/get_workouts', methods=['GET'])
def get_workouts():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required!"}), 400

        # Prebuilt workouts
        prebuilt_workouts = [
            {"id": 1, "name": "Bench Press", "sets": 3, "reps": 10, "weight": 135},
            {"id": 2, "name": "Squats", "sets": 3, "reps": 12, "weight": 185},
            {"id": 3, "name": "Deadlift", "sets": 4, "reps": 8, "weight": 225},
        ]

        # Custom workouts for the user
        custom_workouts = CustomWorkout.query.filter_by(user_id=user_id).all()
        custom_workouts_data = [
            {"id": cw.id, "name": cw.name, "sets": cw.sets, "reps": cw.reps, "weight": cw.weight}
            for cw in custom_workouts
        ]

        return jsonify({"prebuilt": prebuilt_workouts, "custom": custom_workouts_data}), 200
    except Exception as e:
        print(f"Error fetching workouts: {e}")
        return jsonify({"message": "Failed to fetch workouts", "error": str(e)}), 500


@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    goals = db.session.query(UserGoal.user_id, db.func.sum(UserGoal.progress).label('total_progress')).group_by(UserGoal.user_id).order_by(db.desc('total_progress')).all()
    leaderboard = [{"user_id": goal[0], "total_progress": goal[1]} for goal in goals]
    return jsonify(leaderboard), 200



@app.route('/save_workout_log', methods=['POST'])
def save_workout_log():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        workout_name = data.get('workout_name')
        sets = data.get('sets')
        reps = data.get('reps')
        weight = data.get('weight')

        if not user_id or not workout_name or sets is None or reps is None or weight is None:
            return jsonify({"message": "All workout log fields are required!"}), 400

        # Check if this workout exists in the Workout table
        workout = Workout.query.filter_by(name=workout_name).first()

        # If it's a custom workout, create a new entry
        if not workout:
            workout = Workout(
                name=workout_name,
                duration=0,  # Customize if you track duration
                calories=0  # Customize if you track calories
            )
            db.session.add(workout)
            db.session.commit()

        # Avoid duplicate logs
        existing_log = UserWorkout.query.filter_by(
            user_id=user_id,
            workout_id=workout.id,
            sets=sets,
            reps=reps,
            weight=weight,
        ).first()

        if existing_log:
            return jsonify({"message": "Workout log already exists!"}), 200

        # Save the workout log with the workout_id
        new_log = UserWorkout(
            user_id=user_id,
            workout_id=workout.id,
            sets=sets,
            reps=reps,
            weight=weight,
            date_selected=datetime.utcnow()
        )
        db.session.add(new_log)
        db.session.commit()

        return jsonify({"message": "Workout log saved successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error saving workout log: {e}")
        return jsonify({"message": "Failed to save workout log", "error": str(e)}), 500


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



@app.route('/get_workout_logs', methods=['GET'])
def get_workout_logs():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required!"}), 400

        logs = (
            db.session.query(
                UserWorkout,
                Workout.name.label('workout_name')
            )
            .join(Workout, UserWorkout.workout_id == Workout.id)
            .filter(UserWorkout.user_id == user_id)
            .order_by(UserWorkout.date_selected.desc())
            .distinct(UserWorkout.id)  # Prevent duplicates
            .all()
        )

        return jsonify([
            {
                "workout_name": log.workout_name,
                "sets": log.UserWorkout.sets,
                "reps": log.UserWorkout.reps,
                "weight": log.UserWorkout.weight,
                "date": log.UserWorkout.date_selected.strftime("%Y-%m-%d %H:%M:%S"),
            }
            for log in logs
        ]), 200
    except Exception as e:
        print(f"Error fetching workout logs: {e}")
        return jsonify({"message": "Failed to fetch workout logs", "error": str(e)}), 500


@app.route('/milestones', methods=['GET'])
def get_milestones():
    try:
        milestones = Milestone.query.all()
        result = [
            {"id": milestone.id, "name": milestone.name, "progress": milestone.progress, "goal": milestone.goal}
            for milestone in milestones
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching milestones: {e}")
        return jsonify({"message": "Failed to fetch milestones"}), 500

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

@app.route('/join_competition', methods=['POST'])
def join_competition():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        competition_name = data.get('competition_name')
        performance = data.get('performance')

        if not user_id or not competition_name or performance is None:
            return jsonify({"message": "User ID, competition name, and initial performance are required!"}), 400

        new_competition = UserCompetition(
            user_id=user_id,
            competition_name=competition_name,
            performance=performance
        )
        db.session.add(new_competition)
        db.session.commit()

        return jsonify({"message": "Joined competition successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error joining competition: {e}")
        return jsonify({"message": "Failed to join competition", "error": str(e)}), 500

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


@app.route('/add_friend', methods=['POST'])
def add_friend():
    try:
        # Extract the JWT token from the Authorization header
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        
        # Decode the token to get the user_id
        try:
            token = token.split(" ")[1]  # Get the token from 'Bearer <token>'
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({"message": "Invalid or expired token!"}), 401
        
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

@app.route('/notifications', methods=['GET'])
def get_pending_friend_requests():
    try:
        # Extract the JWT token from the Authorization header
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        
        # Decode the token to get the user_id
        try:
            token = token.split(" ")[1]  # Get the token from 'Bearer <token>'
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({"message": "Invalid or expired token!"}), 401
        
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

        # Log the competition name for debugging
        print(f"Fetching leaderboard for competition: {competition_name}")

        leaderboard = (
            UserCompetition.query.filter_by(competition_name=competition_name)
            .join(User)
            .add_columns(User.username, UserCompetition.performance)
            .order_by(UserCompetition.performance.desc())
            .all()
        )

        # Log the leaderboard data
        print("Leaderboard entries:", leaderboard)

        return jsonify([
            {"username": entry.username, "performance": entry.performance}
            for entry in leaderboard
        ]), 200
    except Exception as e:
        print(f"Error fetching leaderboard: {e}")
        return jsonify({"message": "Failed to fetch leaderboard", "error": str(e)}), 500


@app.route('/update_performance', methods=['POST'])
def update_performance():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        competition_name = data.get('competition_name')
        performance = data.get('performance')

        if not user_id or not competition_name or performance is None:
            return jsonify({"message": "User ID, competition name, and performance are required!"}), 400

        competition_entry = UserCompetition.query.filter_by(user_id=user_id, competition_name=competition_name).first()
        if not competition_entry:
            return jsonify({"message": "User is not part of this competition!"}), 404

        competition_entry.performance = performance
        db.session.commit()
        return jsonify({"message": "Performance updated successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error updating performance: {e}")
        return jsonify({"message": "Failed to update performance", "error": str(e)}), 500

@app.route('/save_custom_workout', methods=['POST'])
def save_custom_workout():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        sets = data.get('sets')
        reps = data.get('reps')
        weight = data.get('weight')

        if not user_id or not name or not sets or not reps or not weight:
            return jsonify({"message": "All fields are required!"}), 400

        custom_workout = CustomWorkout(
            user_id=user_id,
            name=name,
            sets=sets,
            reps=reps,
            weight=weight
        )
        db.session.add(custom_workout)
        db.session.commit()

        return jsonify({"message": "Custom workout saved successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error saving custom workout: {e}")
        return jsonify({"message": "Failed to save custom workout", "error": str(e)}), 500

@app.route('/create_competition', methods=['POST'])
def create_competition():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        name = data.get('name')
        description = data.get('description', '')
        visibility = data.get('visibility', 'public')

        if not user_id or not name:
            return jsonify({"message": "User ID and competition name are required!"}), 400

        # Check if competition name is unique
        existing_competition = Competition.query.filter_by(name=name).first()
        if existing_competition:
            return jsonify({"message": "Competition name already exists!"}), 400

        new_competition = Competition(
            name=name,
            description=description,
            visibility=visibility,
            owner_id=user_id
        )
        db.session.add(new_competition)
        db.session.commit()

        return jsonify({"message": "Competition created successfully!"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating competition: {e}")
        return jsonify({"message": "Failed to create competition", "error": str(e)}), 500
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
                "date_created": comp.date_created.strftime("%Y-%m-%d"),
            }
            for comp in competitions
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching competitions: {e}")
        return jsonify({"message": "Failed to fetch competitions", "error": str(e)}), 500


@app.before_request
def seed_default_competitions():
    default_competitions = [
        {"name": "Max Bench", "description": "Test your max bench press strength.", "visibility": "public", "owner_id": 1},
        {"name": "Max Steps", "description": "Track who takes the most steps.", "visibility": "public", "owner_id": 1},
        {"name": "Group X Class", "description": "Join a group fitness competition.", "visibility": "public", "owner_id": 1},
        {"name": "Cycling Challenge", "description": "Cycle the longest distance.", "visibility": "public", "owner_id": 1},
        {"name": "Swimming Contest", "description": "Swim the farthest distance.", "visibility": "public", "owner_id": 1},
    ]

    for comp in default_competitions:
        # Check if the competition already exists
        existing = Competition.query.filter_by(name=comp["name"]).first()
        if not existing:
            new_competition = Competition(**comp)
            db.session.add(new_competition)
    db.session.commit()


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
from app import db, user_friends
print(db.inspect(user_friends).columns.keys())  

print(db.inspect(User).columns.keys())  
if __name__ == '__main__':
    db.create_all()  
    app.run(debug=True)
