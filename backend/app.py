from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-nayepankh-key-2026" 
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Database Connection and Seeding
try:
    client = MongoClient("mongodb+srv://jibinsjv:hello123@cluster.0plgohy.mongodb.net/?appName=Cluster")
    db = client["nayepankh_db"]
    client.server_info() # This tests if MongoDB is actually running
    print("✅ Connected to MongoDB successfully!")
    
    # Seed default admin if it doesn't exist
    if db.admins.count_documents({}) == 0:
        hashed_password = bcrypt.generate_password_hash("admin123").decode('utf-8')
        db.admins.insert_one({
            "username": "admin",
            "password": hashed_password
        })
        print("✅ Default admin account created (User: admin, Pass: admin123)")
        
except Exception as e:
    print(f"❌ Database connection error: {e}")
    print("⚠️ PLEASE ENSURE MONGODB IS INSTALLED AND RUNNING ON YOUR MACHINE.")

@app.route('/api/register', methods=['POST'])
def register_volunteer():
    try:
        data = request.json
        required_fields = ['fullName', 'email', 'phone', 'interest', 'availability']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
            
        volunteer_document = {
            "fullName": data['fullName'],
            "email": data['email'],
            "phone": data['phone'],
            "interest": data['interest'],
            "availability": data['availability'],
            "registrationDate": datetime.utcnow()
        }
        
        db.volunteers.insert_one(volunteer_document)
        return jsonify({"message": "Registration successful! Welcome to NayePankh Foundation."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    admin = db.admins.find_one({"username": username})
    if admin and bcrypt.check_password_hash(admin['password'], password):
        access_token = create_access_token(identity=username)
        return jsonify({"token": access_token}), 200
        
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/volunteers', methods=['GET'])
@jwt_required()
def get_volunteers():
    volunteers = list(db.volunteers.find({}, {"_id": 0}))
    for v in volunteers:
        if 'registrationDate' in v:
            v['registrationDate'] = v['registrationDate'].strftime("%Y-%m-%d %H:%M:%S")
    return jsonify(volunteers), 200

@app.route('/api/reports', methods=['GET'])
@jwt_required()
def get_reports():
    interest_pipeline = [{"$group": {"_id": "$interest", "count": {"$sum": 1}}}]
    interest_data = list(db.volunteers.aggregate(interest_pipeline))
    
    availability_pipeline = [{"$group": {"_id": "$availability", "count": {"$sum": 1}}}]
    availability_data = list(db.volunteers.aggregate(availability_pipeline))
    
    reports = {
        "totalVolunteers": db.volunteers.count_documents({}),
        "byInterest": {item["_id"]: item["count"] for item in interest_data},
        "byAvailability": {item["_id"]: item["count"] for item in availability_data}
    }
    return jsonify(reports), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)