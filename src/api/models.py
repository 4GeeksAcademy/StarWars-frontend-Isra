from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(50), unique=False, nullable=False)

    def __repr__(self):
        return '<User %r>' % self.id 

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            # No añadimos la contraseña al serialize, ya que es un riesgo de seguridad
        }

class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    gender = db.Column(db.Enum('female', 'male', 'other', 'n/a', name="genderTy"), nullable=False)
    birth_year = db.Column(db.Integer, unique=False, nullable=False)
    height = db.Column(db.Integer, unique=False, nullable=False)
    hair_color = db.Column(db.String(50), unique=False, nullable=False)
    eye_color = db.Column(db.String(50), unique=False, nullable=False)
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    planet_id = db.Column(db.Integer, db.ForeignKey('planet.id'), nullable=False)
    planet = db.relationship('Planet', backref='characters', lazy=True)

    def __repr__(self):
        return '<Character %r>' % self.id
    
    def serialize(self):
        planet_name = self.planet.name if self.planet else ''
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "birth_year": self.birth_year,
            "height": self.height,
            "hair_color": self.hair_color,
            "eye_color": self.eye_color,
            "description": self.description,
            "image_url": self.image_url,
            "homeworld": planet_name,
        }

class Planet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    climate = db.Column(db.Enum('arid', 'temperate', 'tropical', 'frozen', 'murky', name="climateTy"), nullable=False)   
    terrain = db.Column(db.Enum('desert', 'grasslands', 'mountains', 'forests', 'rainforests','jungle', 'ocean', 'tundra','ice caves','ranges','swamps','gas gigant','lakes','grassy hills','cityscape', name="terrainTy"), nullable=False)
    population = db.Column(db.Integer, unique=False, nullable=False)
    orbital_period = db.Column(db.Integer, unique=False, nullable=False)
    rotation_period = db.Column(db.Integer, unique=False, nullable=False)
    diameter = db.Column(db.Integer, unique=False, nullable=False)
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(500))

    def __repr__(self):
        return '<Planet %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "climate": self.climate,
            "population": self.population,
            "orbital_period": self.orbital_period,
            "rotation_period": self.rotation_period,
            "diameter": self.diameter,
            "description": self.description,
            "image_url": self.image_url,
        }

class Vehicle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    model = db.Column(db.String(100), unique=False, nullable=False)
    vehicle_class = db.Column(db.String(100), unique=False, nullable=False)
    manufacturer = db.Column(db.String(100), unique=False, nullable=False)
    length = db.Column(db.Integer, unique=False, nullable=False)
    crew = db.Column(db.Integer, unique=False, nullable=False)
    passengers = db.Column(db.Integer, unique=False, nullable=False)
    max_atmosphering_speed = db.Column(db.Integer, unique=False, nullable=False)
    cargo_capacity = db.Column(db.Integer, unique=False, nullable=False)
    consumables = db.Column(db.String(100), unique=False, nullable=False)
    description = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    pilot_id = db.Column(db.Integer, db.ForeignKey('character.id'))
    character = db.relationship('Character', backref='vehicles', lazy=True)
    
    def __repr__(self):
        return '<Vehicle %r>' % self.id
    
    def serialize(self):
        pilot_name = self.character.name if self.character else ''
        return {
            "id": self.id,
            "name": self.name,
            "model": self.model,
            "vehicle_class": self.vehicle_class,
            "manufacturer": self.manufacturer,
            "length": self.length,
            "crew": self.crew,
            "passengers": self.passengers,
            "max_atmosphering_speed": self.max_atmosphering_speed,
            "cargo_capacity": self.cargo_capacity,
            "consumables": self.consumables,
            "description": self.description,
            "image_url": self.image_url,
            "pilot_id": pilot_name,
        }

class Favorites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    character_id = db.Column(db.Integer, db.ForeignKey('character.id'))
    planet_id = db.Column(db.Integer, db.ForeignKey('planet.id'))
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicle.id'))
    user = db.relationship('User', backref='favorites', lazy=True)
    character = db.relationship('Character', backref='favorites', lazy=True)
    planet = db.relationship('Planet', backref='favorites', lazy=True)
    vehicle = db.relationship('Vehicle', backref='favorites', lazy=True)

    def __repr__(self):
        return '<Favorites %r>' % self.user_id
    
    def serialize(self):
        characters = [favorite.character.name for favorite in Favorites.query.filter(Favorites.character_id.isnot(None)).all() if favorite.character]
        planets = [favorite.planet.name for favorite in Favorites.query.filter(Favorites.planet_id.isnot(None)).all() if favorite.planet]
        vehicles = [favorite.vehicle.name for favorite in Favorites.query.filter(Favorites.vehicle_id.isnot(None)).all() if favorite.vehicle]
        return {
            "character_id": characters,
            "planets": planets,
            "vehicle_id": vehicles
        }
