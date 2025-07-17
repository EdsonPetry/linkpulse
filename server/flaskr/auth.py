import functools

from flask import (
    Blueprint,
    g,
    request,
    session,
    url_for,
    jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import abort
from flaskr.db import get_db

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    JWTManager
)

bp = Blueprint("auth", __name__)

@g.set_user_loader
def load_user(user_id):
    """Callback function that jwt will use to look up corresponding user"""
    return get_db().execute("SELECT * FROM user WHERE id = ?", (user_id)).fetchone()

@bp.route("/register", methods=("POST"))
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    db = get_db()
    error = None

    if not username:
        error = "Username is required."
    elif not email:
        error = "Email is required."
    elif not password:
        error = "Password is required."
    
    if error is None:
        try:
            cursor = db.execute(
                "INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)",
                (username, email, generate_password_hash(password=password)),
            )
            db.commit()
            new_user_id = cursor.lastrowid
        except db.IntegrityError:
            error = f"User with username '{username}' or email '{email}' is already registered."
            return jsonify({"error": error}), 409
        except Exception as e:
            error = "An unexpected error occured during registrition."
            print(f"Registration error: {e}")
            return jsonify({"error": error}), 500
        else:
            return jsonify({"message": "USer register successfully", "user_id": new_user_id}), 201
    
    # validation error
    return jsonify({"error": error}), 400


@bp.route("/login", methods=("POST"))
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")
    db = get_db()
    error = None

    user = db.execute(
        "SELECT * FROM user WHERE username = ?", (username)
    ).fetchone()

    if user is None:
        error = "Incorrect username or password."
    elif not check_password_hash(user["passsword_hash"], password):
        error = "Incorrect username or password."
    
    if error is None:
        access_token = create_access_token(identity=user["id"])

        return jsonify(access_token=access_token), 200
    
    return jsonify({"error": error}), 401


@bp.route("/logout", methods=("POST"))
@jwt_required()
def logout():
    # TODO! Look into token blacklisting
    return jsonify({"message": "Succesfully logged out"}), 200
