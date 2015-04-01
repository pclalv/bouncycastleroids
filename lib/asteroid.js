"use strict";

(function () {
  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (keys) {
    keys.color       = Asteroids.Asteroid.COLOR;
    keys.numSides    = Math.ceil(6*Math.random() + 2);
    keys.maxSideLen  = 100*Math.random();
    keys.head        = this.startingHead();
    keys.speed       = this.startingSpeed();
    keys.edgeLengths = [];
    keys.vertices    = [];
    keys.edgeCenters = [];

    Asteroids.MovingObject.call(this, keys);

    this.calculateEdgeLengths();
    this.calculateVertices();
  };

  Asteroid.COLOR         = 'black';
  Asteroid.MAX_PERIMETER = 100;

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

  Asteroid.prototype.calculateEdgeLengths = function () {
    var edgeLength,
        perimeterToDraw = this.perimeter;

    while (this.edgeLengths.length < this.numSides) {
      edgeLength = this.maxSideLen*Math.random() ;
      this.edgeLengths.push(edgeLength);
      perimeterToDraw -= edgeLength;
    }
  };

  Asteroid.prototype.calculateVertices = function () {
    var i, vertex;

    this.vertices.push(this.pos);

    for (i = 0; i < this.numSides - 1; i++) {
      vertex = [ 0, this.edgeLengths[i] ];
      Asteroids.Util.rotateVec(
        vertex,
        2*Math.PI*Math.random()/this.numSides);

      Asteroids.Util.vecAdd(vertex, this.pos)

      this.vertices[i+1] = vertex;
    }
  };

})();
