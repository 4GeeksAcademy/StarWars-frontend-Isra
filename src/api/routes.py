"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Favorites, Character, Planet, Vehicle
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
# Que tipo de peticiones y de donde
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

################### USE IN CASE OF ERROR ##########################
@api.errorhandler(APIException)
def handle_invalid_use(error):
    return jsonify(error.to_dict()), error.status_code

################### GENERATE SITE MAP ########################
@api.route('/')
def sitemap():
    return generate_sitemap(api)


################### USERS ENDPOINTS ########################
#------------------- GET ALL USERS -------------------------
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    
    serialized_users = list([user.serialize() for user in users])
    print(serialized_users)
    if not users:
        raise APIException("No users found", status_code=404)
    else:
        return jsonify(serialized_users), 200

##################### FAV ENDPOINTS ########################
#------------------- GET ALL FAVS OF A USER-------------------------
@api.route('/users/<int:user_id>/favs', methods=['GET'])
def get_favs(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", status_code=404)

    favorites = Favorites.query.filter_by(user_id=user_id).all()
    print(favorites)
    if not favorites:
        raise APIException("No favorites found", status_code=404)
    else:
        favorites_dict = {
            "favorite_characters": [],
            "favorite_planets": [],
            "favorite_vehicles": []
        }
        for favorite in favorites:
            if favorite.favorite_type == "character":
                character = Character.query.get(favorite.favorite_id)
                print(character)
                if character:
                    favorites_dict["favorite_characters"].append(character.name)
            elif favorite.favorite_type == "planet":
                planet = Planet.query.get(favorite.favorite_id)
                if planet:
                    favorites_dict["favorite_planets"].append(planet.name)
            elif favorite.favorite_type == "vehicles":
                vehicle = Vehicle.query.get(favorite.favorite_id)
                if vehicle:
                    favorites_dict["favorite_vehicles"].append(vehicle.name)
        return jsonify(favorites_dict), 200

#------------------- ADD FAVORITE CHARACTER/PLANET/VEHICLE TO A USER------------------------
@api.route('/favorites/user/<int:user_id>', methods=['POST'])
def add_favorite(user_id):
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", status_code=404)
    
    body = request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)

    favorite_type = body.get('favorite_type')
    favorite_id = body.get('favorite_id')

    if not favorite_type or not favorite_id:
        raise APIException("Missing favorite_type or favorite_id in request body", status_code=400)

    if favorite_type not in ['character', 'vehicles', 'planet']:
        raise APIException("Invalid favorite_type", status_code=400)

    if favorite_type == 'character':
        favorite_item = Character.query.get(favorite_id)
    elif favorite_type == 'vehicles':
        favorite_item = Vehicle.query.get(favorite_id)
    elif favorite_type == 'planet':
        favorite_item = Planet.query.get(favorite_id)

    if not favorite_item:
        raise APIException(f"{favorite_type.capitalize()} with id {favorite_id} not found", status_code=404)

    new_favorite = Favorites(user_id=user.id, favorite_type=favorite_type, favorite_id=favorite_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"message": "Favorite added successfully"}), 201
