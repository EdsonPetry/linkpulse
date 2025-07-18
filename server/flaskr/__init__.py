import os
from flask import Flask
from flask_jwt_extended import JWTManager


# application factory function
def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
        JWT_SECRET_KEY="dev",
    )

    if test_config is None:
        # load the instance config if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    jwt = JWTManager(app)

    from . import db

    db.init_app(app)

    from . import auth

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return auth.load_user(identity)

    app.register_blueprint(auth.bp, url_prefix="/api/auth")

    from . import urls

    app.register_blueprint(urls.bp, url_prefix="/api/urls")

    from flaskr import users

    app.register_blueprint(users.bp, url_prefix="/api/users")

    return app
