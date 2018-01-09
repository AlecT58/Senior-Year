from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(30), unique=False, nullable=False)
    created_chatrooms = db.relationship('Chatroom', backref='creator', lazy='dynamic')
    posted_messages = db.relationship('Message', backref='poster', lazy='dynamic')

class Chatroom(db.Model):
    room_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    posted_messages = db.relationship('Message', backref='room', lazy='dynamic')
    
class Message(db.Model):
    message_id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(140), unique=False, nullable=False)
    date_posted = db.Column(db.DateTime(), unique=False, nullable=False)
    poster_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    chatroom_id = db.Column(db.Integer, db.ForeignKey('chatroom.room_id'))
    poster_name = db.Column(db.String(30), unique=False, nullable=False)
