(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (keys) {
    keys.color       = Asteroid.COLOR;
    keys.numSides    = Math.ceil(7*Math.random() + 2);
    keys.maxSideLen  = 100*Math.random();
    keys.r           = Asteroid.MAX_RADIUS*Math.random();
    keys.head        = this.startingHead();
    keys.speed       = this.startingSpeed();
    keys.polygon     = new SAT.Polygon();
    keys.vertices    = [];
    keys.edges       = [];
    keys.edgeCenters = [];
    keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);

    Asteroids.MovingPolygon.call(this, keys);

    this.calculateVertices();
    // this.calculateEdges();
    // this.calculateEdgeCenters();
  };

  Asteroid.COLOR         = 'black';
  Asteroid.MAX_RADIUS = 100;

  Asteroids.Util.inherits(Asteroids.Asteroid, Asteroids.MovingPolygon);

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

  Asteroid.prototype.draw = function (ctx) {
    ctx.strokeStyle = Asteroid.COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(
      this.vertices[0].x,
      this.vertices[0].y);

    for (var i = 1; i < this.numSides; i++) {
      ctx.lineTo(
        this.vertices[i].x,
        this.vertices[i].y);
    }

    ctx.closePath();
    ctx.stroke();

    // this.drawPos(ctx)
    // this.drawContacts(ctx);
  };

  Asteroid.prototype.calculateVertices = function () {
    var i, vertex,
        vertices = [],
        radius = [this.r, 0],
        radians = [];

    for (i = 0; i < this.numSides; i++) {
      radians.push(2*Math.PI*Math.random());
    }

    radians.sort();

    for (i = 0; i < this.numSides; i++) {
      vertices.push(
        new SAT.V(radius[0], radius[1]));
      vertices[i].rotate(radians[i]);
      vertices[i].add(this.pos);
    }

    this.polygon.setPoints(vertices);
    this.vertices = this.polygon.points;
  };

})();
