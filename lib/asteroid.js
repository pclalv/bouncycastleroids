"use strict";

(function () {
  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (keys) {
    keys.color       = Asteroids.Asteroid.COLOR;
    keys.numSides    = Math.ceil(7*Math.random() + 2);
    keys.maxSideLen  = 100*Math.random();
    keys.r           = Asteroid.MAX_RADIUS*Math.random();
    keys.head        = this.startingHead();
    keys.speed       = this.startingSpeed();
    keys.vertices    = [];
    keys.edgeCenters = [];

    Asteroids.MovingObject.call(this, keys);

    this.calculateVertices();
  };

  Asteroid.COLOR         = 'black';
  Asteroid.MAX_RADIUS = 100;

  Asteroids.Util.inherits(Asteroids.Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.startingHead = function() {
    return Asteroids.Util.randomVec(1);
  };

  Asteroid.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Ship) {
      otherObject.relocate();
    }
  };

  Asteroid.prototype.startingSpeed = function () {
    return Math.random() + 1;
  };

  Asteroid.prototype.move = function () {
    var i;

    for (i = 0; i < this.numSides; i++) {
      Asteroids.Util.vecAdd(this.vertices[i], this.vel());
    }
  };

  Asteroid.prototype.draw = function (ctx) {
    ctx.strokeStyle = Asteroid.COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

    // this.calculateVertices();
    // this.calculateEdgeCenters();

    ctx.moveTo(
      this.vertices[0][0],
      this.vertices[0][1]);

    for (var i = 1; i < this.numSides; i++) {
      ctx.lineTo(
        this.vertices[i][0],
        this.vertices[i][1]);
    }

    ctx.closePath();
    ctx.stroke();
  };

  Asteroid.prototype.calculateVertices = function () {
    var i, vertex,
        radius = [this.r, 0],
        radians = [];

    for (i = 0; i < this.numSides; i++) {
      radians.push(2*Math.PI*Math.random());
    }

    radians.sort();

    for (i = 0; i < this.numSides; i++) {
      this.vertices.push(
        Asteroids.Util.vecAdd(
          Asteroids.Util.rotateVec(radius.slice(), radians[i]),
          this.pos));
    }
  };

})();
