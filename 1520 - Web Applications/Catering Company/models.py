from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_staff = db.Column(db.Boolean, nullable=False)

    fk_created_event = db.relationship("Event", backref="customer")

# class Staff(db.Model):
#     staff_id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     password = db.Column(db.String(80), unique=False, nullable=False)

#     fk_event_worked = db.relationship("EventsWorked", backref="created_event")

class Event(db.Model):
    event_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False, nullable=False)
    dateEntered = db.Column(db.String(20), unique=True, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False) #change this back to false in production
    first_worker_id = db.Column(db.String(80), nullable=True)
    second_worker_id = db.Column(db.String(80), nullable=True)
    third_worker_id = db.Column(db.String(80), nullable=True)

    # fk_event_linked = db.relationship("EventsWorked", backref="linked_event")

# class EventsWorked(db.Model):
#     linker_id = db.Column(db.Integer, primary_key=True)
#     event_id = db.Column(db.Integer, db.ForeignKey("event.event_id"), nullable=False)
#     staff_id = db.Column(db.Integer, db.ForeignKey("staff.staff_id"), nullable=False)


    #make staff and customer one table
    #make each event have staff1, staff2, staff3