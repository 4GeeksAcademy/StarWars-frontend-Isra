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

#------------------- DELETE FAVORITE CHARACTER/PLANET/VEHICLE TO A USER------------------------
@api.route('/favorites/users/<int:user_id>/<string:type>/<int:id>', methods=['DELETE'])
def delete_favorite(user_id, type, id):
    user = User.query.get(user_id)
    if not user:
        raise APIException("User not found", status_code=404)

    if type not in ['character', 'vehicles', 'planet']:
        raise APIException("Invalid favorite type", status_code=400)

    favorite = Favorites.query.filter_by(user_id=user_id, favorite_type=type, favorite_id=id).first()
    if not favorite:
        raise APIException("Favorite not found", status_code=404)

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": f"{type.capitalize()} with id {id} removed from user {user.name} favorites"}), 200

################### CHARACTERS ENDPOINTS ########################
#------------------- GET ALL CHARACTERS -------------------------
@api.route('/characters', methods=['GET'])
def get_characters():
    characters=Character.query.all()
    serialized_characters = list([character.serialize() for character in characters])
    if not characters:
        raise APIException("No characters found", status_code=404)
    else:
        return jsonify(serialized_characters), 200

#------------------- GET CHARACTER BY ID -------------------------
@api.route('/characters/<int:character_id>', methods=['GET'])
def get_character(character_id):
    character = Character.query.get(character_id)
    if not character:
        raise APIException("Character not found", status_code=404)
    else:
        return jsonify(character.serialize()), 200

#------------------------ ADD CHARACTER -------------------------
@api.route('/characters', methods=['POST'])
def add_character():
    body = request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)
    
    character=Character()
    character.name = body.get('name')
    character.gender=body.get('gender')
    character.birth_year=body.get('birth_year')
    character.height=body.get('height') 
    character.hair_color=body.get('hair_color')
    character.eye_color=body.get('eye_color')
    character.description=body.get('description')
    character.image_url=body.get('image_url')
    character.planet_id=body.get('planet_id')

    if not character.name:
        raise APIException("Name is required", status_code=400)
    if not character.gender:
        raise APIException("Gender is required", status_code=400)
    if not character.birth_year:
        raise APIException("Birth year is required", status_code=400)
    if not character.height:
        raise APIException("Height is required", status_code=400)
    if not character.hair_color:
        raise APIException("Hair color is required", status_code=400)
    if not character.eye_color:
        raise APIException("Eye color is required", status_code=400)
    if not character.planet_id:
        raise APIException("Planet ID is required", status_code=400)

    try:
        db.session.add(character)
        db.session.commit()
        return jsonify(character.serialize()), 201
    except Exception as e:
        db.session.rollback()
        raise APIException(str(e), status_code=500)


#------------------------ EDIT A CHARACTER ------------------------- 
@api.route('/characters/<int:character_id>', methods=['PUT'])
def edit_character(character_id):
    character=Character.query.filter_by(id=character_id).first()
    if not character:
        raise APIException("Character not found", status_code=404)
    
    body= request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)

    character.name = body.get('name', character.name)
    character.gender=body.get('gender', character.gender)
    character.birth_year=body.get('birth_year', character.birth_year)
    character.height=body.get('height', character.height)
    character.hair_color=body.get('hair_color', character.hair_color)
    character.eye_color=body.get('eye_color', character.eye_color)
    character.description=body.get('description', character.description)
    character.image_url=body.get('image_url', character.image_url)
    character.planet_id=body.get('planet_id', character.planet_id)

    db.session.commit()

    return jsonify('Character has been edit successfully',character.serialize()), 200

#------------------------ DELETE A CHARACTER ------------------------- 
# Funciona el delete porque borra los datos pero me da un estatus 500   
@api.route('/characters/<int:character_id>', methods=['DELETE'])
def delete_character(character_id):
    character=Character.query.filter_by(id = character_id).first()
    if not character:
        raise APIException("Character not found", status_code=404)
    serialized_character = character.serialize()
    db.session.delete(character)
    db.session.commit()

    return jsonify('Character has been deleted successfully', serialized_character), 200

################### PLANETS ENDPOINTS ########################
#------------------- GET ALL PLANETS -------------------------

@api.route('/planets', methods=['GET'])
def get_planets():
    planets=Planet.query.all()
    serialized_planets = list([planet.serialize() for planet in planets])
    if not planets:
        raise APIException("No planets found", status_code=404)
    else:
        return jsonify(serialized_planets), 200
    
#------------------- GET PLANET BY ID -------------------------
@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    planet = Planet.query.get(planet_id)
    if not planet:
        raise APIException("Character not found", status_code=404)
    else:
        return jsonify(planet.serialize()), 200

#------------------------ ADD PLANET -------------------------
@api.route('/planets', methods=['POST'])
def add_planet():
    body = request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)
    
    planet=Planet()
    planet.name = body.get('name')
    planet.population=body.get('population')
    planet.climate=body.get('climate')
    planet.terrain=body.get('terrain')
    planet.diameter=body.get('diameter')
    planet.rotation_period=body.get('rotation_period')
    planet.orbital_period=body.get('orbital_period')
    planet.description=body.get('description')
    planet.image_url=body.get('image_url')


    if not planet.name:
        raise APIException("Name is required", status_code=400)
    if not planet.population:
        raise APIException("Population is required", status_code=400)
    if not planet.climate:
        raise APIException("Climate is required", status_code=400)
    if not planet.terrain:
        raise APIException("Terrain is required", status_code=400)
    if not planet.diameter:
        raise APIException("Diameter is required", status_code=400)
    if not planet.rotation_period:
        raise APIException("Rotation period is required", status_code=400)
    if not planet.orbital_period:
        raise APIException("Orbital period is required", status_code=400)
  
    try:
        db.session.add(planet)
        db.session.commit()
        return jsonify(planet.serialize()), 201
    except Exception as e:
        db.session.rollback()
        raise APIException(str(e), status_code=500)

#------------------------ EDIT A PLANET -------------------------
@api.route('/planets/<int:planet_id>', methods=['PUT'])
def edit_planet(planet_id):
    planet=Planet.query.filter_by(id = planet_id).first()
    if not planet:
        raise APIException("Planet not found", status_code=404)
    
    body= request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)

    planet.name = body.get('name', planet.name)
    planet.population=body.get('population', planet.population)
    planet.climate=body.get('climate', planet.climate)
    planet.terrain=body.get('terrain', planet.terrain)
    planet.diameter=body.get('diameter', planet.diameter)
    planet.rotation_period=body.get('rotation_period', planet.rotation_period)
    planet.orbital_period=body.get('orbital_period', planet.orbital_period)

    db.session.commit()

    return jsonify('Planet has been edit successfully',planet.serialize()), 200

#------------------------ DELETE A PLANET -------------------------
@api.route('/planets/<int:planet_id>', methods=['DELETE'])
def delete_planet(planet_id):
    planet=Planet.query.filter_by(id = planet_id).first()
    print(planet)
    if not planet:
        raise APIException("Planet not found", status_code=404)

    db.session.delete(planet)
    db.session.commit()

    return jsonify('Planet has been deleted successfully',planet.serialize()), 200

################### VEHICLES ENDPOINTS ########################
#------------------- GET ALL VEHICLES -------------------------
@api.route('/vehicles', methods=['GET'])
def get_vehicles():
    vehicles=Vehicle.query.all()
    serialized_vehicles = list([vehicle.serialize() for vehicle in vehicles])
    if not vehicles:
        raise APIException("No vehicles found", status_code=404)
    else:
        return jsonify(serialized_vehicles), 200

#------------------- GET VEHICLE BY ID -------------------------
@api.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        raise APIException("Vehicle not found", status_code=404)
    else:
        return jsonify(vehicle.serialize()), 200
    
#------------------------ ADD VEHICLE -------------------------
@api.route('/vehicles', methods=['POST'])
def add_vehicle():
    body = request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)
    
    vehicle=Vehicle()
    vehicle.name = body.get('name')
    vehicle.model=body.get('model')
    vehicle.vehicle_class=body.get('vehicle_class')
    vehicle.manufacturer=body.get('manufacturer')
    vehicle.length=body.get('length')
    vehicle.crew=body.get('crew')
    vehicle.passengers=body.get('passengers')
    vehicle.max_atmosphering_speed=body.get('max_atmosphering_speed')
    vehicle.cargo_capacity=body.get('cargo_capacity')
    vehicle.consumables=body.get('consumables')
    vehicle.description=body.get('description')
    vehicle.image_url=body.get('image_url')
    vehicle.pilot_id=body.get('pilot_id')

    if not vehicle.name:
        raise APIException("Name is required", status_code=400)
    if not vehicle.model:
        raise APIException("Model is required", status_code=400)
    if not vehicle.vehicle_class:
        raise APIException("Vehicle class is required", status_code=400)
    if not vehicle.manufacturer:
        raise APIException("Manufacturer is required", status_code=400)
    if not vehicle.length:
        raise APIException("Length is required", status_code=400)
    if not vehicle.crew:
        raise APIException("Crew is required", status_code=400)
    if not vehicle.passengers:
        raise APIException("Passengers is required", status_code=400)
    if not vehicle.max_atmosphering_speed:
        raise APIException("Max atmosphering speed is required", status_code=400)
    if not vehicle.cargo_capacity:
        raise APIException("Cargo capacity is required", status_code=400)
    if not vehicle.consumables:
        raise APIException("Consumables is required", status_code=400)
    if not vehicle.pilot_id:
        raise APIException("Pilot ID is required", status_code=400)
    
    try:
        db.session.add(vehicle)
        db.session.commit()
        return jsonify(vehicle.serialize()), 201
    except Exception as e:
        db.session.rollback()
        raise APIException(str(e), status_code=500)
    
#------------------------ EDIT A VEHICLE -------------------------
@api.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
def edit_vehicle(vehicle_id):
    vehicle=Vehicle.query.filter_by(id = vehicle_id).first()
    if not vehicle:
        raise APIException("Vehicle not found", status_code=404)
    
    body= request.get_json()
    if not body:
        raise APIException("Request body is empty", status_code=400)

    vehicle.name = body.get('name', vehicle.name)
    vehicle.model=body.get('model', vehicle.model)
    vehicle.vehicle_class=body.get('vehicle_class', vehicle.vehicle_class)
    vehicle.manufacturer=body.get('manufacturer', vehicle.manufacturer)
    vehicle.length=body.get('length', vehicle.length)
    vehicle.crew=body.get('crew', vehicle.crew)
    vehicle.passengers=body.get('passengers', vehicle.passengers)
    vehicle.max_atmosphering_speed=body.get('max_atmosphering_speed', vehicle.max_atmosphering_speed)
    vehicle.cargo_capacity=body.get('cargo_capacity', vehicle.cargo_capacity)
    vehicle.consumables=body.get('consumables', vehicle.consumables)
    vehicle.description=body.get('description', vehicle.description)
    vehicle.image_url=body.get('image_url', vehicle.image_url)
    vehicle.pilot_id=body.get('pilot_id', vehicle.pilot_id)

    db.session.commit()
    
    return jsonify('Planet has been edit successfully',vehicle.serialize()), 200

#------------------------ DELETE A VEHICLE -------------------------
# Funciona el delete porque borra los datos pero me da un error estatus 500
@api.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    vehicle=Vehicle.query.filter_by(id = vehicle_id).first()
    if not vehicle:
        raise APIException("Vehicle not found", status_code=404)
    serialized_vehicle= vehicle.serialize()
    db.session.delete(vehicle)
    db.session.commit()

    return jsonify('Vehicle has been deleted successfully', serialized_vehicle), 200    

