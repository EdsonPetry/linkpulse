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
from flaskr.auth import login_required

bp = Blueprint("users", __name__, url_prefix="/users")

@bp.route('/profile', methods=('GET', 'PUT'))
@login_required
def profile():
    db = get_db

    user_data = db.execute(
        'SELECT id, username, email FROM user WHERE id = ?', (g.user['id'])
    ).fetchone()

    if user_data is None:
        return jsonify({"error": "user not found"}), 404
    
    user_dict = dict(user_data)

    if request.method == 'GET':
        return jsonify(user_dict), 200
