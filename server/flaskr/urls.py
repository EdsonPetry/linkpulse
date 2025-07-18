from flask import Blueprint, g, request, url_for, jsonify
from werkzeug.exceptions import abort

from flask_jwt_extended import jwt_required, get_jwt_identity
from flaskr.db import get_db

bp = Blueprint("urls", __name__)

def get_url(url_id, check_user=True):
    db = get_db()
    url_data = db.execute(
        "SELECT id, url, alias, check_interval_seconds, http_method, expected_status_code,"
        "expected_content_math, is_active, created_at, updated_at, last_checked_at, last_status,"
        "last_response_time_ms, user_id FROM url WHERE id = ?", (url_id,)
    ).fetchone()

    if url_data is None:
        abort(404, description=f"URL id {url_id} doesn't exist")
    
    current_user_id = int(get_jwt_identity())

    if check_user and url_data['user_id'] != current_user_id:
        abort(403, description="Forbidden: You do not own this URL.")
    
    return url_data


@bp.route("/", methods=["GET"])
@jwt_required()
def index():
    db = get_db()
    current_user_id = int(get_jwt_identity())

    urls = db.execute(
        'SELECT id, url, alias, check_interval_seconds, http_method, expected_status_code, '
        'expected_content_match, is_active, created_at, updated_at, last_checked_at, last_status, last_response_time_ms '
        'FROM url WHERE user_id = ? ORDER BY created_at DESC',
        (current_user_id,)
    ).fetchall()

    urls_list = [dict(url) for url in urls]

    return jsonify(urls_list), 200



@bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update(id):
    url_data = get_url(id)
    data = request.get_json()

    update_fields = []
    update_values = []

    if 'url' in data:
        update_fields.append('url = ?')
        update_values.append(data['url'])
    if 'alias' in data:
        update_fields.append('alias = ?')
        update_values.append(data['alias'])
    if 'check_interval_seconds' in data:
        if not isinstance(data['check_interval_seconds'], int) or data['check_interval_seconds'] <= 0:
            return jsonify({"error": "Check interval must be a positive integer."}), 400
        update_fields.append('check_interval_seconds = ?')
        update_values.append(data['check_interval_seconds'])
    if 'http_method' in data:
        update_fields.append('http_method = ?')
        update_values.append(data['http_method'])
    if 'expected_status_code' in data:
        update_fields.append('expected_status_code = ?')
        update_values.append(data['expected_status_code'])
    if 'expected_content_match' in data:
        update_fields.append('expected_content_match = ?')
        update_values.append(data['expected_content_match'])
    if 'is_active' in data:
        if not isinstance(data['is_active'], bool):
            return jsonify({"error": "is_active must be a boolean."}), 400
        update_fields.append('is_active = ?')
        update_values.append(data['is_active'])
    
    if not update_fields:
        return jsonify({"message": "No valid fields provided for update."}), 200 # Nothing to update

    db = get_db()
    try:
        db.execute(
            f"UPDATE url SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            (*update_values, id) # Unpack values and add ID
        )
        db.commit()
    except db.IntegrityError as e:
        return jsonify({"error": f"Failed to update URL: {e}"}), 409
    except Exception as e:
        print(f"Error updating URL: {e}")
        return jsonify({"error": "An unexpected error occurred while updating the URL."}), 500

    updated_url_data = get_url(id, check_user=True) # Fetch again to get updated_at
    return jsonify({"message": "URL updated successfully", "url": dict(updated_url_data)}), 200

@bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete(id):
    get_url(id)

    db = get_db()
    db.execute('DELETE FROM url WHERE id = ?', (id))
    db.commit()

    return jsonify({"message": f"URL {id} delete successfully"}), 200

@bp.route("/", methods=["POST"])
@jwt_required()
def add_url():
    data = request.get_json()
    required_fields = ["url", "check_interval_seconds"]

    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"{field} is required."}), 400

    db = get_db()
    current_user_id = int(get_jwt_identity())

    try:
        db.execute(
            """
            INSERT INTO url (
                url, alias, check_interval_seconds, http_method,
                expected_status_code, expected_content_match,
                is_active, user_id, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """,
            (
                data["url"],
                data.get("alias", ""),
                data["check_interval_seconds"],
                data.get("http_method", "GET"),
                data.get("expected_status_code", 200),
                data.get("expected_content_match", ""),
                data.get("is_active", True),
                current_user_id,
            )
        )
        db.commit()
        return jsonify({"message": "URL created successfully."}), 201
    except Exception as e:
        print(f"Error inserting URL: {e}")
        return jsonify({"error": "Failed to create URL"}), 500