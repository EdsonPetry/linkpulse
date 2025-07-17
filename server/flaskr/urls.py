from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('urls', __name__)

@bp.route('/')
def index():
    db = get_db()
    urls = db.execute(
        'SELECT p.id, name, body, created, user_id, username'
        '   FROM url p JOIN user u ON p.user_id = u.id'
        '   ORDER BY created DESC'
    ).fetchall()
    return render_template('url/index.html', urls=urls)

@bp.route('/create', methods=('GET', 'POST'))
@login_required
def create():
    if request.method == 'POST':
        name = request.form['name']
        body = request.form['body']
        error = None

        if not name:
            error = 'Name is required.'
        
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'INSERT INTO url (name, body, user_id)'
                'VALUES (?, ?, ?)',
                (name, body, g.user['id'])
            )
            db.commit()
            return redirect(url_for('url.index'))
    
    return render_template('url/create.html')

def get_url(id, check_user=True):
    url = get_db().execute(
        'SELECT p.id, name, body, created, user_id, username'
        '   FROM url p JOIN user u ON p.user_id = u.id'
        '   WHERE p.id = ?',
        (id,)
    ).fetchone()

    if url is None:
        abort(404, f"URL id {id} doesn't exist")
    if check_user and url['user_id'] != g.user['id']:
        abort(403)
    
    return url

@bp.route('/<int:id>/update', methods=('GET', 'POST'))
@login_required
def update(id):
    url = get_url(id)

    if request.method == 'POST':
        name = request.form['name']
        body = request.form['body']
        error = None

        if not name:
            error = 'Name is required.'
        
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                'UPDATE url SET name = ?, body = ?'
                '   WHERE id = ?',
                (name, body, id)
            )
            db.commit()

        return redirect(url_for('url.index'))
    return render_template('url/update.html', url=url)

@bp.route('/<int:id>/delete', methods=('GET', 'POST'))
@login_required
def delete(id):
    get_url(id)
    db = get_db()
    db.execute('DELETE FROM url WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('url.index'))