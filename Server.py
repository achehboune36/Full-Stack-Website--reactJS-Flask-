from flask import Flask ,session ,render_template, flash, redirect , url_for , request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
import datetime 
from datetime import date
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField, ValidationError
from wtforms.validators import DataRequired, EqualTo, Length
from flask_restful import Api , Resource , reqparse , abort , fields , marshal_with
import bcrypt
import pydicom.uid
from pydicom.uid import generate_uid
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import uuid
from flask_mail import Mail
from flask_mail import Message


app = Flask(__name__)
# Config
app.secret_key=""
app.config['SECRET_KEY'] = ""
MYSQL_HOST = '' 
MYSQL_USERNAME = ''
MYSQL_PASSWORD = ''
MYSQL_DATABASE = ''
MYSQL_PORT = ''

SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://'+MYSQL_USERNAME+':'+MYSQL_PASSWORD+'@'+MYSQL_HOST+':'+MYSQL_PORT+'/'+MYSQL_DATABASE
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587,
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = 'email addresse',
    MAIL_PASSWORD = 'password',
))

mail = Mail(app)
api = Api(app)
db = SQLAlchemy(app)

class Users(db.Model):
	id =db.Column(db.Integer, primary_key=True)
	public_id = db.Column(db.String(50), unique=True)
	name = name = db.Column(db.String(50))
	email = db.Column(db.String(50))
	password = db.Column(db.String(80))
	tel = db.Column(db.Integer)
	location = db.Column(db.String(80))
	brikoleur = db.Column(db.Boolean)
	admin = db.Column(db.Boolean)
	created_at = db.Column(db.DateTime(True),default = db.func.now())
	updated_at = db.Column(db.DateTime(True),default = db.func.now() , onupdate = db.func.now())

class BricoleurData(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	domaine = db.Column(db.String(80))
	seniority = db.Column(db.Integer)
	wallet = db.Column(db.Integer)
	profile = db.Column(db.String(80))
	user_id = db.Column(db.Integer)


class Mission(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	brikoleur_id = db.Column(db.Integer)
	demandeur_id = db.Column(db.Integer)
	date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
	accepted = db.Column(db.Boolean)


def tojson(user_id):
	user = Users.query.filter_by(public_id=user_id).first()
	if not user:
		return jsonify({'message' : 'User Not found!'})
	user_data={}
	user_data['public_id'] = user.public_id
	user_data['name'] = user.name
	user_data['email'] = user.email
	user_data['tel'] =user.tel
	user_data['location'] = user.location
	user_data['brikoleur'] = user.brikoleur
	user_data['admin'] = user.admin
	if user.brikoleur:
		data = BricoleurData.query.filter_by(user_id=user.id).first()
		user_data['domaine'] = data.domaine
		user_data['seniority'] = data.seniority
		user_data['wallet'] = data.wallet
		user_data['profile'] = data.profile
	return user_data


def token_required(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		token = None

		if 'x-access-token' in request.headers:
			token = request.headers['x-access-token']

		if not token:
			return jsonify({'message' : 'Token is missing!'}), 401

		try: 
			data = jwt.decode(token, app.config['SECRET_KEY'])
			current_user = Users.query.filter_by(public_id=data['public_id']).first()
		except:
			return jsonify({'message' : 'Token is invalid!'}), 401

		return f(current_user, *args, **kwargs)

	return decorated


#### ALL ####
@app.route('/login', methods=['POST'])
def login():
	auth = request.authorization

	if not auth or not auth.username or not auth.password:
		return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

	user = Users.query.filter_by(email=auth.username).first()

	if not user:
		return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})

	if check_password_hash(user.password, auth.password):
		token = jwt.encode({
			'public_id' : user.public_id, 
			'expiration' :str( datetime.datetime.utcnow() + datetime.timedelta(minutes=30))}, 
			app.config['SECRET_KEY'])

		return jsonify({'token' : token.decode('utf_8')})

	return make_response('Could not verify', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})


@app.route('/register', methods=['POST'])
def register():
	data = request.get_json()
	if data['brikoleur']:
		hashed_password = generate_password_hash(data['password'], method='sha256')
		new_user = Users(public_id=str(uuid.uuid4()), name=data['name'],email=data['email'], password=hashed_password, admin=False,brikoleur=True,tel=data['tel'],location=data['location'])
		db.session.add(new_user)
		db.session.commit()
		user_data = BricoleurData(domaine=data['domaine'],seniority=data['seniority'],wallet=0,profile=data['profile'],user_id=new_user.id)
		db.session.add(user_data)
		db.session.commit()
		return jsonify({'message' : 'New user created!'})
	hashed_password = generate_password_hash(data['password'], method='sha256')
	new_user = Users(public_id=str(uuid.uuid4()), name=data['name'],email=data['email'], password=hashed_password, admin=False,brikoleur=False,tel=data['tel'],location=data['location'])
	db.session.add(new_user)
	db.session.commit()

	return jsonify({'message' : 'New user created!'})

###   ADMIN  ####
@app.route('/admin', methods=['GET'])
#@token_required
def get_all_users(current_user):

	#if not current_user.admin:
	#	return jsonify({'message' : 'Cannot perform that function!'})

	users = Users.query.all()

	output = []

	for user in users:
		user_data=tojson(user.public_id)
		output.append(user_data)

	return jsonify({'users' : output})

@app.route('/admin/<public_id>', methods=['POST'])
#@token_required
def get_one_user(public_id):

	#if not current_user.admin:
	#	return jsonify({'message' : 'Cannot perform that function!'})

	user = Users.query.filter_by(public_id=public_id).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	user_data = tojson(user.public_id)

	return jsonify({'user' : user_data})



@app.route('/admin/<public_id>', methods=['PUT'])
@token_required
def promote_user(current_user, public_id):
	if not current_user.admin:
		return jsonify({'message' : 'Cannot perform that function!'})

	user = Users.query.filter_by(public_id=public_id).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	user.admin = True
	user.brikoleur=False
	db.session.commit()

	return jsonify({'message' : 'The user has been promoted!'})



@app.route('/admin/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, public_id):
	if not current_user.admin:
		return jsonify({'message' : 'Cannot perform that function!'})

	user = Users.query.filter_by(public_id=public_id).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	db.session.delete(user)
	db.session.commit()
	if user.brikoleur:
		data = BricoleurData.query.filter_by(user_id=user.id).first()
		db.session.delete(data)
		db.session.commit()

	return jsonify({'message' : 'The user has been deleted!'})


###   Demandeur  ####
@app.route('/demandeur')
#@token_required
def get_all_brikoleurs():

	#if current_user.admin or current_user.brikoleur :
	#	return jsonify({'message' : 'Cannot perform that function!'})

	users = Users.query.filter_by(brikoleur=True).all()

	output = []

	for user in users:
		user_data=tojson(user.public_id)
		output.append(user_data)

	return jsonify({'brikoleurs' : output})

@app.route('/demandeur/<public_id>', methods=['GET'])
@token_required
def get_one_brikoleur(current_user, public_id):

	if current_user.admin or current_user.brikoleur :
		return jsonify({'message' : 'Cannot perform that function!'})

	user = Users.query.filter_by(public_id=public_id).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	user_data = tojson(user.public_id)

	return jsonify({'user' : user_data})

@app.route('/demandeur/request/<public_id>', methods=['POST'])
#@token_required
def send_request(public_id):

	#if current_user.admin or current_user.brikoleur :
	#	return jsonify({'message' : 'Cannot perform that function!'})
	current_user = public_id
	user = Users.query.filter_by(public_id=public_id ,admin=False , brikoleur = True).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	request = Mission(demandeur_id=current_user, brikoleur_id = user.id ,accepted=False)
	db.session.add(request)
	db.session.commit()
	return jsonify({'message' : 'request sent !'})

@app.route('/demandeur/request/<public_id>', methods=['DELETE'])
@token_required
def undo_request(current_user, public_id):

	if current_user.admin or current_user.brikoleur :
		return jsonify({'message' : 'Cannot perform that function!'})

	user = Users.query.filter_by(public_id=public_id ,admin=False , brikoleur = True).first()

	if not user:
		return jsonify({'message' : 'No user found!'})

	mision = Mission.query.filter_by(demandeur_id=current_user.id,brikoleur_id=user.id).first()
	
	if not mision :
		return jsonify({'message' : 'there is no request to this brikoleur !'})

	if mision.accepted :
		return jsonify({'message' : 'Request Alredy accepted!'})
	db.session.delete(mision)
	db.session.commit()


	return jsonify({'message' : 'request deleted !'})


@app.route('/demandeur/request', methods=['GET'])
@token_required
def check_requests(current_user):

	if current_user.admin or current_user.brikoleur :
		return jsonify({'message' : 'Cannot perform that function!'})


	requests = Mission.query.filter_by(demandeur_id=current_user.id).all()
	accepted_requests=[]
	pending_requests=[]
	for request in requests:
		data={}
		data['to brikoleur'] = request.brikoleur_id
		data['sent in'] = request.date
		if request.accepted:
			accepted_requests.append(data)
		else:
			pending_requests.append(data)

	return jsonify({'accepted' : accepted_requests ,
					'pending' : pending_requests})

### Brikoleur ###

@app.route('/brikoleur', methods=['GET'])
#@token_required
def check_requests_b():

	#if not  current_user.brikoleur :
	#	return jsonify({'message' : 'Cannot perform that function!'})


	requests = Mission.query.filter_by(brikoleur_id='9bd80a1e-d4d8-4f0f-bd8e-262963f16694').all()
	accepted_requests=[]
	pending_requests=[]
	for request in requests:
		data={}
		data['from demandeur'] = request.demandeur_id
		data['sent in'] = request.date
		if request.accepted:
			accepted_requests.append(data)
		else:
			pending_requests.append(data)

	return jsonify({'accepted' : accepted_requests ,
					'pending' : pending_requests})

@app.route('/brikoleur/<request_id>', methods=['POST'])
@token_required
def accept_request(current_user,request_id):

	if not  current_user.brikoleur :
		return jsonify({'message' : 'Cannot perform that function!'})


	requests = Mission.query.filter_by(brikoleur_id=current_user.id , id = request_id).first()

	if not requests :
		return jsonify({'message' : 'There is no request with thie Id!'})

	if requests.accepted :
		return jsonify({'message' : 'request alredy accepted!'})

	requests.accepted=True
	db.session.commit()

	return jsonify({'message' : 'request accepted !' })

@app.route('/brikoleur/<request_id>', methods=['DELETE'])
@token_required
def refuse_request(current_user,request_id):

	if not  current_user.brikoleur :
		return jsonify({'message' : 'Cannot perform that function!'})


	requests = Mission.query.filter_by(brikoleur_id=current_user.id , id = request_id).first()

	if not requests :
		return jsonify({'message' : 'There is no request with thie Id!'})

	if requests.accepted :
		return jsonify({'message' : 'request alredy accepted!'})

	db.session.delete(requests)
	db.session.commit()

	return jsonify({'message' : 'request refused !' })




def send_reset_email(user):
	token = jwt.encode({
			'public_id' : user.public_id, 
			'expiration' :str( datetime.datetime.utcnow() + datetime.timedelta(minutes=30))}, 
			app.config['SECRET_KEY'])
	msg = Message('Password Reset Request',
				  sender='noreply@demo.com',
				  recipients=[user.email])
	msg.body = f'''To reset your password, visit the following link:
{url_for('reset_token', token=token.decode('utf_8'), _external=True)}
If you did not make this request then simply ignore this email and no changes will be made.
'''
	mail.send(msg)


@app.route("/reset_password", methods=['GET', 'POST'])
def reset_request():
	data = request.get_json()
	user = Users.query.filter_by(email=data['email']).first()
	if user :
		send_reset_email(user)
		return jsonify({'message' : 'email sent!'})
	else :
		return jsonify({'message' : 'no info!'})
	


@app.route("/reset_password/<token>", methods=['GET', 'POST'])
def reset_token(token):
	try: 
		data = jwt.decode(token, app.config['SECRET_KEY'])
		current_user = Users.query.filter_by(public_id=data['public_id']).first()
	except:
		return jsonify({'message' : 'Token is invalid!'}), 401
	data = request.get_json()
	hashed_password = generate_password_hash(data['password'], method='sha256')
	current_user.password=hashed_password
	db.session.commit()
	return jsonify({'message' : 'password updated!'})


@app.route('/update_profile', methods=['POST'])
#@token_required
def update_profile(current_user):
	data = request.get_json()
	if 'email' in data :
		user = Users.query.filter_by(email=data["email"]).first()
		if user :
			return jsonify({'message' : 'email alredy used !'})
		else :
			current_user.email = data['email']
	elif 'name' in data :
		current_user.name = data['name']
	elif 'password' in data :
		hashed_password = generate_password_hash(data['password'], method='sha256')
		current_user.password = hashed_password
	elif 'tel' in data :
		current_user.tel = data['tel']
	elif 'location' in data :
		current_user.location = data['location']
	if current_user.brikoleur :
		usr_data = BricoleurData.query.filter_by(user_id=current_user.id).first()
		if 'domaine' in data :
			usr_data.domaine = data['domaine']
		elif 'seniority' in data :
			usr_data.seniority = data['seniority']
		elif 'wallet' in data :
			usr_data.wallet = data['wallet']
		elif 'profile' in wallet :
			usr_data.profile = data['profile']
	db.session.commit()
	return jsonify({'message' : 'info updated !'})

@app.route('/delete_profil', methods=['DELETE'])
@token_required
def delete_profil(current_user):
	if current_user.brikoleur :
		data = BricoleurData.query.filter_by(user_id=current_user.id).first()
		db.session.delete(data)
		db.session.commit()
	db.session.delete(current_user)
	db.session.commit()
	return jsonify({'message' : 'done !'})


if __name__ == '__main__':
	app.run(debug=True)



























