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
        this.vertices()[i].add(this.vel());
      }

      this.polygon.setPoints(this.vertices());
    }

    if (this.newVertexIdxs) {
      for (i = 0; i < this.newVertexIdxs.length; i++) {
        this.newVertices[this.newVertexIdxs[i]].add(this.vel());
      }
    }
  };

  MovingPolygon.prototype.vertices = function (idx) {
    if (idx || idx === 0) {
      return this.polygon.points[idx];
    } else {
      return this.polygon.points;
    }
  };

  MovingPolygon.prototype.isCollidedWith = function (otherObject, response) {
    var my = this,
        collided = false,
        response = response || new SAT.Response();

    if (otherObject instanceof Asteroids.Ship) {
      collided = SAT.testPolygonPolygon(
        this.polygon, otherObject.polygon, response);
    } else {
      collided = SAT.pointInPolygon(
        otherObject.circle.pos, this.polygon, response);
    }
    return collided;
  };

  MovingPolygon.prototype.dupVertices = function () {
    var i,
        dup = [];

    for (i = 0; i < this.numSides; i++) {
      dup.push(this.vertices(i));
    }

    return dup;
  };

  MovingPolygon.prototype.calcArea = function () {
    var i,
        xY = 0, yX = 0,
        detVerts = this.dupVertices();

    detVerts.push(detVerts[0]);

    for (i = 0; i < detVerts.length-1; i++) {
      xY = xY + (detVerts[i].x * detVerts[i+1].y);
      yX = yX + (detVerts[i].y * detVerts[i+1].x);
    }

    this.area = 0.5*(xY - yX);
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

    this.vertices().forEach(function (vertex) {
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
