from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack, jsonify
from sqlalchemy import and_
from models import db, User, Chatroom, Message
from datetime import datetime, timedelta
import os
from json import dumps, loads

app = Flask(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'chat.db')
))

db.init_app(app)

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    print('Initialized the database.')

def get_user_id(username):
    """Convenience method to look up the id for a username."""
    rv = User.query.filter_by(username=username).first()
    return rv.user_id if rv else None

def get_chatroom_id(name):
    """Convenience method to look up the id for a chatroom."""
    rv = Chatroom.query.filter_by(name=name).first()
    return rv.room_id if rv else None

def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")

@app.route('/', methods=['GET'])
def reroute_to_login():
    return  redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    if session.get('user_id'):
        return redirect(url_for('chatrooms'))
    else:
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            user = User.query.filter_by(username=username).first()

            if user is None:
                error = 'Invalid username'
            elif not user.password == password:
                error = 'Invalid password'
            else:
                flash('You were logged in, {}'.format(username))
                session['user_id'] = user.user_id
                session.pop('chatroom_id', None)
                return redirect(url_for('chatrooms'))
        return  render_template('login.html', error=error)

@app.route('/logout')
def logout():
    flash('You were logged out')
    session.pop('user_id', None)
    session.pop('chatroom_id', None)
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if get_user_id(username) is not None:
            error = 'Username is already taken'
        else:
            newUser = User(username = username, password = password)
            db.session.add(newUser)
            db.session.commit()
            flash("New account created")
            return  redirect(url_for('login'))  

    return render_template('register.html', error=error) 

@app.route('/join_chatroom', methods=['GET', 'POST'])
def chatrooms():
    error = None
    if request.method == 'POST':
        to_delete = request.form['toDelete']

        if to_delete:
            chatroom = Chatroom.query.filter_by(room_id=to_delete).first()

            if chatroom.creator_id == session['user_id']:
                flash("Chatroom {} was deleted".format(chatroom.name))
                db.session.delete(chatroom)
                db.session.commit()
            else:
                error = "You cannot delete a chatroom you did not create"
        # elif to_join:
        #     chatroom = Chatroom.query.filter_by(room_id=to_join).first()
        #     return url_for('current_chatroom', chatroom.name)
        else:
            error = "Chatroom no longer exists"

    chatrooms = Chatroom.query.all()
    return  render_template('join_chatroom.html', chatrooms=chatrooms, error=error)

@app.route('/create_chatroom', methods=['GET', 'POST'])
def create_chatroom():
    error = None
    if request.method == 'POST':
        chatroom_name = request.form['username']
        user = User.query.filter_by(user_id=session['user_id']).first()
        
        if get_chatroom_id(chatroom_name) is not None:
            error = 'Chatroom name is already in use'
        else:
            newRoom = Chatroom(name=chatroom_name, creator_id=user.user_id)
            db.session.add(newRoom)
            db.session.commit()
            flash("New chatroom {} created".format(chatroom_name))
            return  redirect(url_for('chatrooms'))  
    return  render_template('create_chatroom.html', error=error)

@app.route('/leave_chatroom', methods=['GET', 'POST'])
def leave_chatroom():
    current_room = Chatroom.query.filter_by(room_id=session['chatroom_id']).first()
    flash('You left room {} and can now join other rooms'.format(current_room.name))
    session.pop('chatroom_id', None)
    return redirect(url_for('chatrooms'))

@app.route('/chatroom/<name>', methods=['GET', 'POST'])
def current_chatroom(name):
    chatroom = Chatroom.query.filter_by(name=name).first()

    if session.get('chatroom_id'):   
        if session['chatroom_id'] == None or session['chatroom_id'] == chatroom.room_id:
            session['chatroom_id'] = chatroom.room_id
            messages = Message.query.filter(Message.chatroom_id==session['chatroom_id']).all()
            return render_template('chatroom.html', chatroomName=name, postedMessages=messages)
        else:
            oldRoom = Chatroom.query.filter_by(room_id=session['chatroom_id']).first()
            flash('You were redirected becuase you can only be in one chatroom at once!')
            return  redirect(url_for('current_chatroom', name=oldRoom.name))
            # error='You can only be in one chatroom at once! Try leaving the other one first'
            # chatrooms = Chatroom.query.all()
            # return  render_template('join_chatroom.html', chatrooms=chatrooms, error=error)
    else:
        session['chatroom_id'] = chatroom.room_id
        messages = Message.query.filter(Message.chatroom_id==session['chatroom_id']).all()
        return render_template('chatroom.html', chatroomName=name, postedMessages=messages)

@app.route('/post_message', methods=['POST'])
def post_message():
    json_text = request.json
    current_user = User.query.filter_by(user_id=session['user_id']).first()
    message = Message(message=json_text['message'], date_posted=datetime.now(), poster_id=session['user_id'], chatroom_id=session['chatroom_id'], poster_name=current_user.username)
    db.session.add(message)
    db.session.commit()
    return render_template('chatroom.html')

@app.route('/get_messages', methods=['GET'])
def get_messages():
    current_room = Chatroom.query.filter_by(room_id=session['chatroom_id']).first()

    if current_room:
        messages = Message.query.with_entities(Message.message, Message.poster_name).filter((Message.chatroom_id==session['chatroom_id']) & (Message.date_posted.between((datetime.now() - timedelta(seconds=1)), datetime.now()))).all()
        return dumps(messages)
    else:
        flash('The room you were in was deleted. Please select another room to join')
        session.pop('chatroom_id', None)
        return "GTFO of this chatroom now please and thank you very kindly time to go"
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, threaded=True)