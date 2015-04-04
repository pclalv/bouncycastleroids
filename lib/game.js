"use strict";

(function () {
  if (typeof(window.Asteroids) === 'undefined') {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function (options) {
    this.asteroids = [];
    this.bullets =   [];
    this.powerUps =  [];
    this.addAsteroids();
    this.bullet_cooldown = 0;
    this.ship = new Asteroids.Ship({pos: this.randomPos()});
    this.window = new SAT.Polygon(
      new SAT.V(),
      [new SAT.V(0, 0), new SAT.V(0, Game.DIM_Y),
       new SAT.V(Game.DIM_X, 0), new SAT.V(Game.DIM_X, Game.DIM_Y)]);
  };

  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;
  Game.NUM_ASTEROIDS = 5;
  Game.BULLET_COOLDOWN = 20;

  Asteroids.Game.prototype.addAsteroids = function (options) {
    var i, keys, asteroid,
        my = this,
        outOfBounds = false,
        options = options || {};

    while (this.asteroids.length < Game.NUM_ASTEROIDS) {
      outOfBounds = false;

      keys = { pos: options.pos || this.randomPos() };
      asteroid = new Asteroids.Asteroid(keys)

      asteroid.vertices().forEach(function (vertex) {
        outOfBounds = outOfBounds || my.isOutOfBounds(vertex);
      });

      if (!outOfBounds) {
        this.asteroids.push(asteroid)
      }
    }
  };

  Game.prototype.randomPos = function () {
    return [Math.random() * Game.DIM_X,
      Math.random() * Game.DIM_Y];
  };

  Game.prototype.draw = function(ctx) {
    var bmp;

    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });
  };

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (object) {
      object.move();

      if (this.isOutOfBounds(object.pos) && !object.isWrappable()) {
        object.remove = true;
      }

      if (object instanceof Asteroids.Asteroid || object instanceof Asteroids.Ship) {
        this.bounce(object);
      } else if (object instanceof Asteroids.Bullet) {
        this.wrap(object.pos);
      }
    }, this);
  };

  Game.prototype.wrap = function (pos) {
    if (pos.x > Game.DIM_X) {
      pos.x -= Game.DIM_X;
    }
    if (pos.x < 0) {
      pos.x += Game.DIM_X;
    }
    if (pos.y > Game.DIM_Y) {
      pos.y -= Game.DIM_Y;
    }
    if (pos.y < 0) {
      pos.y += Game.DIM_Y;
    }
  };

  Game.prototype.bounce = function (object) {
    var move = new SAT.V(0, 0),
        my = this;

    object.vertices().forEach(function (vertex) {
      if (my.isOutOfBounds(vertex)) {
        if (object instanceof Asteroids.Ship) {
          if (vertex.x < 0) {
            move.x += 2;
          }
          if (vertex.y < 0) {
            move.y += 2;
          }
          if (vertex.x > Game.DIM_X) {
            move.x -= 2;
          }
          if (vertex.y > Game.DIM_Y) {
            move.y -= 2;
          }
          object.rotate(Math.PI);
          object.move(move)
        } else {
          Asteroids.Util.rotateVec(object.head, (Math.PI)/2);
        }
      }
    });
  }

  Game.prototype.checkCollisions = function () {
    var response, edge, firstVertexIdx, secondVertexId, i, j, newPoints,
        keepGoing = true,
        originalAsteroidVertices = [],
        newAsteroidVertices1 = [],
        newAsteroidVertices2 = [],
        relocateShip = false;

    this.asteroids.forEach(function (asteroid) {
      relocateShip = relocateShip || asteroid.isCollidedWith(this.ship);
    }, this);

    if (relocateShip) {
      this.ship.relocate(this.randomPos());
    }

    this.bullets.forEach(function (bullet) {
      this.asteroids.forEach(function (asteroid) {
        response = new SAT.Response();

        if (asteroid.isCollidedWith(bullet, response)) {

          // splitting the asteroid

          // if it's collided with a bullet and
          if (asteroid.collidedBullet
              && asteroid.collidedBullet === bullet
              && asteroid.edge1 != response.edge
              && response.bInA == false) {
            debugger

            originalAsteroidVertices = asteroid.polygon.points.slice();

            asteroid.vertex2 = bullet.pos.clone();
            asteroid.edge2 = response.edge;
            i = originalAsteroidVertices.indexOf(asteroid.edge1);
            while (keepGoing) {
              if (originalAsteroidVertices[i] == asteroid.edge2) {
                keepGoing = false;
              }

              newAsteroidVertices1.push(originalAsteroidVertices[i]);
              originalAsteroidVertices[i] = null;

              i++;
              if (i > originalAsteroidVertices.length - 1) {
                i = 0;
              }
            }

            originalAsteroidVertices.forEach(function (vertex) {
              if (vertex) {
                newAsteroidVertices2.push(vertex);
              }
            });

            asteroid.remove = true;
            bullet.remove = true;
          } else if (!asteroid.collidedBullet) {
            asteroid._remove = true;
            bullet._remove = true;
            asteroid.collidedBullet = bullet;
            asteroid.vertex1 = bullet.pos.clone();

            // iterate thru vertices and add in bullet pos where it fits
            for (i = 0; i < asteroid.numSides; i++) {
              if (i == asteroid.numSides - 1) {
                j = 0;
              } else {
                j = i+1;
              }

              if (asteroid.vertices()[i].x < asteroid.vertex1.x
                && asteroid.vertices()[i].y < asteroid.vertex1.y
                && asteroid.vertex1.x < asteroid.vertices()[j].x
                && asteroid.vertex1.y < asteroid.vertices()[j].y) {

                newPoints = asteroid.dupVertices()
                newPoints.splice(j, 0, asteroid.vertex1)
                asteroid.polygon.setPoints(newPoints);

                asteroid.newVertexIdx = i;
              } else if (asteroid.vertices()[i].x > asteroid.vertex1.x
                && asteroid.vertices()[i].y < asteroid.vertex1.y
                && asteroid.vertex1.x > asteroid.vertices()[j].x
                && asteroid.vertex1.y < asteroid.vertices()[j].y) {

                newPoints = asteroid.dupVertices()
                newPoints.splice(j, 0, asteroid.vertex1)
                asteroid.polygon.setPoints(newPoints);

                asteroid.newVertexIdx = i;
              } else if (asteroid.vertices()[i].x > asteroid.vertex1.x
                && asteroid.vertices()[i].y > asteroid.vertex1.y
                && asteroid.vertex1.x > asteroid.vertices()[j].x
                && asteroid.vertex1.y > asteroid.vertices()[j].y) {

                newPoints = asteroid.dupVertices()
                newPoints.splice(j, 0, asteroid.vertex1)
                asteroid.polygon.setPoints(newPoints);

                asteroid.newVertexIdx = i;
              } else if (asteroid.vertices()[i].x < asteroid.vertex1.x
                && asteroid.vertices()[i].y > asteroid.vertex1.y
                && asteroid.vertex1.x < asteroid.vertices()[j].x
                && asteroid.vertex1.y > asteroid.vertices()[j].y) {

                newPoints = asteroid.dupVertices()
                newPoints.splice(j, 0, asteroid.vertex1)
                asteroid.polygon.setPoints(newPoints);

                asteroid.newVertexIdx = i;
              }
            }
            debugger
            asteroid.numSides++;
            asteroid.edge1 = response.edge;
          }
        }
      });
    }, this);

    this.powerUps.forEach(function (powerUp) {
      if (powerUp.isCollidedWith(this.ship)) {
        this.ship.givePowerUp = true;
        powerUp.remove = true;

        setTimeout(function () {
          this.givePowerUp = false;
        }.bind(this.ship), 5000)
      }
    }, this);
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
    this.removeAsteroids();
    this.removeBullets();
    this.removePowerUps();
    this.maybeAddPowerUp();
  };

  Game.prototype.removeAsteroids = function () {
    var newAsteroids = [];

    this.asteroids.forEach(function (asteroid) {
      if (!asteroid.remove) {
        newAsteroids.push(asteroid)
      }
    });

    this.asteroids = newAsteroids;
  };

  Game.prototype.removeBullets = function () {
    var newBullets = [];

    this.bullets.forEach(function (bullet) {
      if (!bullet.remove) {
        newBullets.push(bullet)
      }
    });

    this.bullets = newBullets;
  };

  Game.prototype.removePowerUps = function () {
    var newPowerUps = [];

    this.powerUps.forEach(function (powerUp) {
      if (!powerUp.remove) {
        newPowerUps.push(powerUp)
      }
    });

    this.powerUps = newPowerUps;
  };

  Game.prototype.maybeAddPowerUp = function () {
    if (Math.random() < 0.01) {
      this.powerUps.push(new Asteroids.PowerUp({pos: this.randomPos()}));
    }
  };

  Game.prototype.allObjects = function () {
    return this.asteroids.concat([this.ship]).concat(this.bullets).concat(this.powerUps);
  };

  Game.prototype.addBullet = function (bullet) {
    this.bullets.push(bullet);
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos.x < 0 || pos.y < 0 || pos.x > Game.DIM_X || pos.y > Game.DIM_Y);
  };

  Game.prototype.handleInputs = function () {
    var bullet;

    this.bullet_cooldown--;
    this.bullet_cooldown = Math.max(this.bullet_cooldown, 0);

    if (key.isPressed("space") && !this.bullet_cooldown) {
      bullet = this.ship.fireBullet();
      this.addBullet(bullet);
      this.bullet_cooldown = Game.BULLET_COOLDOWN;
    }

    if (key.isPressed("up")) {
      this.ship.power(0.1);
    }

    if (key.isPressed("down")) {
      this.ship.power(-0.1);
    }

    if (key.isPressed("left")) {
      this.ship.rotate(-Math.PI/100);
    }

    if (key.isPressed("right")) {
      this.ship.rotate(Math.PI/100);
    }
  };
})();
