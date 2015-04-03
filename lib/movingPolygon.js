(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var MovingPolygon = Asteroids.MovingPolygon = function (keys) {
    Asteroids.MovingObject.call(this, keys);
  };

  Asteroids.Util.inherits(Asteroids.MovingPolygon, Asteroids.MovingObject);

  MovingPolygon.prototype.vel = function () {
    this._vel = new SAT.V(this.speed*this.head[0], this.speed*this.head[1]);

    return this._vel
  };

  MovingPolygon.prototype.move = function () {
    var i;

    Asteroids.MovingObject.prototype.move.call(this);

    for (i = 0; i < this.numSides; i++) {
      if (this instanceof Asteroids.Asteroid) {
        this.vertices[i].add(this.vel());
      }

      this.polygon.setPoints(this.vertices);
    }
  };

  MovingPolygon.prototype.isCollidedWith = function (otherObject) {
    var my = this,
        collided = false;

    if (otherObject instanceof Asteroids.Ship) {
      collided = SAT.testPolygonPolygon(
        this.polygon, otherObject.polygon);
    } else {
      collided = SAT.testPolygonCircle(this.polygon, otherObject.circle);
    }
    return collided;
  };

  MovingPolygon.prototype.calculateEdges = function () {
    return this.polygon.edges;
  };

  MovingPolygon.prototype.calculateEdgeCenters = function () {
    var i

    for (i = 0; i < this.numSides; i++) {
      this.edgeCenters[i] = Asteroids.Util.vectorMidPoint(
        this.edges[i]);
    }
  };

  // see hit box points of contact
  // to update for SAT.js compatibility
  MovingPolygon.prototype.drawContacts = function (ctx) {
    ctx.fillStyle = 'black';

    this.edgeCenters.forEach(function (edgeCenter) {
      ctx.beginPath();

      ctx.arc(
        edgeCenter[0],
        edgeCenter[1],
        2,
        0,
        2 * Math.PI,
        false
      );

      ctx.fill();
      ctx.closePath();
    });


    ctx.beginPath();

    this.vertices.forEach(function (vertex) {
      ctx.beginPath();

      ctx.arc(
        vertex[0],
        vertex[1],
        2,
        0,
        2 * Math.PI,
        false
      );

      ctx.fill();
      ctx.closePath();
    });

    ctx.fill();
  };

  // see pos
  // to update for SAT.js compatibility
  MovingPolygon.prototype.drawPos = function (ctx) {
    ctx.arc(
      this.pos[0],
      this.pos[1],
      2,
      0,
      2 * Math.PI,
      false
    );

    ctx.stroke();
  };

})();
