import functools

from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
    jsonify
)

from flaskr.db import get_db
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

bp = Blueprint("users", __name__, url_prefix="/users")

@bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    db = get_db()
    current_user_id = get_jwt_identity()

    user_data = db.execute(
        'SELECT id, username, email FROM user WHERE id = ?', (int(current_user_id),)
    ).fetchone()

    if user_data is None:
        return jsonify({"error": "user not found"}), 404
    
    user_dict = dict(user_data)

    if request.method == 'GET':
        return jsonify(user_dict), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        
        update_fields = []
        update_values = []
        
        if 'username' in data:
            update_fields.append('username = ?')
            update_values.append(data['username'])
        if 'email' in data:
            update_fields.append('email = ?')
            update_values.append(data['email'])
        
        if not update_fields:
            return jsonify({"message": "No valid fields provided for update."}), 200
        
        try:
            db.execute(
                f"UPDATE user SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                (*update_values, int(current_user_id))
            )
            db.commit()
        except db.IntegrityError:
            return jsonify({"error": "Username or email already exists."}), 409
        except Exception as e:
            print(f"Error updating user profile: {e}")
            return jsonify({"error": "An unexpected error occurred while updating the profile."}), 500
        
        # Fetch updated user data
        updated_user_data = db.execute(
            'SELECT id, username, email FROM user WHERE id = ?', (int(current_user_id),)
        ).fetchone()
        
        return jsonify({"message": "Profile updated successfully", "user": dict(updated_user_data)}), 200
