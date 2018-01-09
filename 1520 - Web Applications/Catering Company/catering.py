from flask import Flask, request, session, url_for, redirect, render_template, abort, g, flash, _app_ctx_stack
from models import db, User, Event
import os

app = Flask(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default',

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'catering.db')
))

db.init_app(app)

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    db.drop_all()
    db.create_all()
    print('Initialized the database.')

@app.before_request
def before_request():
    g.user = None
    if 'user_id' in session:
        g.user = User.query.filter_by(user_id=session['user_id']).first()

def get_user_id(username):
    """Convenience method to look up the id for a username."""
    rv = User.query.filter_by(username=username).first()
    return rv.user_id if rv else None

def get_event_id_by_date(date):
    """Convenience method to look up the id for a username."""
    rv = Event.query.filter_by(dateEntered=date).first()
    return rv.event_id if rv else None

@app.route('/', methods=['GET'])
def reroute_to_login():
    return  redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        # if g.user:
        #     return ("<h1>fsdfs</h1>")
        #     if g.user.is_staff == True:
        #         return  redirect(url_for('staff_home'))  
        #     else:
        #         return  redirect(url_for('customer_home')) 
        # elif 'owner_logged_in' in session == True:
        #     return  redirect(url_for('owner_home'))

        username = request.form['username']
        password = request.form['password']
            
        if username == 'owner' and password == 'pass':
            session['owner_logged_in'] = True
            return  redirect(url_for('owner_home'))

        user = User.query.filter_by(username=username).first()

        if user is None:
            error = 'Invalid username'
        elif not user.password == password:
            error = 'Invalid password'
        else:
            flash('You were logged in, {}'.format(username))
            session['user_id'] = user.user_id

            if user.is_staff == True:
                return redirect(url_for('staff_home'))  
            else:
                return redirect(url_for('customer_home'))  

    return render_template('login.html', error=error)
  
@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if get_user_id(username) is not None:
            error = 'Username is already taken.'
        else:
            newCustomer = User(username = username, password = password, is_staff = False)
            db.session.add(newCustomer)
            db.session.commit()
            flash("New account created.")
            return  redirect(url_for('login'))  

    return render_template('register.html', error=error) 

@app.route('/logout')
def logout():
    flash('You were logged out')
    session.pop('user_id', None)
    session.pop('owner_logged_in', None)
    return redirect(url_for('login'))

@app.route('/owner_homepage', methods=['GET', 'POST'])
def owner_home(): 
    all_events = Event.query.all()
    return render_template('owner_homepage.html', all_events=all_events) 

@app.route('/staff_homepage', methods=['GET', 'POST'])
def staff_home():
    error = None
    staff_member = User.query.filter_by(user_id=session['user_id']).first()

    if request.method == 'POST':
        to_sign_up = request.form['sign_up']
        signed_up = Event.query.filter_by(event_id=to_sign_up).first()

        if signed_up.first_worker_id == staff_member.username or signed_up.second_worker_id == staff_member.username or signed_up.third_worker_id == staff_member.username:
            error = 'You are already signed up for that event'
        else:
            if signed_up.first_worker_id is None and signed_up.first_worker_id != staff_member.username:
                signed_up.first_worker_id = staff_member.username
            elif signed_up.second_worker_id is None and signed_up.second_worker_id != staff_member.username:
                signed_up.second_worker_id = staff_member.username
            elif signed_up.third_worker_id is None and signed_up.third_worker_id != staff_member.username:
                signed_up.third_worker_id = staff_member.username

            db.session.commit()
            flash('You are now signed up for event \'{}\''.format(signed_up.title))

    signed_up = Event.query.filter((Event.first_worker_id==staff_member.username) | (Event.second_worker_id==staff_member.username) | (Event.third_worker_id==staff_member.username)).all()
    available = Event.query.filter((Event.first_worker_id==None) | (Event.second_worker_id==None) | (Event.third_worker_id==None)).all()
    #available = Event.query.filter(((Event.first_worker_id==None) & (Event.first_worker_id!=staff_member.username)) | ((Event.second_worker_id==None) & (Event.second_worker_id!=staff_member.username)) | ((Event.third_worker_id==None) & (Event.third_worker_id!=staff_member.username))).all()
    return render_template('staff_homepage.html', signed_up=signed_up, available=available, error=error) 

@app.route('/customer_homepage', methods=['GET', 'POST'])
def customer_home(): 
    if request.method == 'POST':
        to_delete = request.form['delete']
        deleted = Event.query.filter_by(event_id=to_delete).first()
        flash('Event \'{}\' has been canceled'.format(deleted.title))
        Event.query.filter_by(event_id=to_delete).delete()
        db.session.commit()
        
    scheduled_events = Event.query.filter_by(creator_id=session['user_id']).all()
    return render_template('customer_homepage.html', events=scheduled_events) 

@app.route('/staff_creation', methods=['GET', 'POST'])
def add_new_staff(): 
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if get_user_id(username) is not None:
            error = 'Username is already taken.'
        else:
            newStaff = User(username = username, password = password, is_staff = True)
            db.session.add(newStaff)
            db.session.commit()
            flash('New staff member \'{}\' created.'.format(username))
            return  redirect(url_for('owner_home')) 

    return render_template('staff_creation.html', error=error) 

@app.route('/event_scheduler', methods=['GET', 'POST'])
def add_new_event(): 
    error = None
    if request.method == 'POST':
        title = request.form['title']
        date = request.form['date']

        if get_event_id_by_date(date) is not None:
            error = "Event is already scheduled for that date. Please select another date."
        else:
            #also need to enter user's id in the table as well
            newEvent = Event(title=title, dateEntered=date, creator_id=session["user_id"])
            db.session.add(newEvent)
            db.session.commit()
            flash('New event titled: \'{}\' scheduled for: {}'.format(title, date))
            return  redirect(url_for('customer_home')) 

    return render_template('event_scheduler.html', error=error) 

if __name__ == "__main__":
    app.run()