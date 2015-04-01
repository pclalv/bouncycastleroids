(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var MovingPolygon = Asteroids.MovingPolygon = function (keys) {
    Asteroids.MovingObject.call(this, keys);
  };

  Asteroids.Util.inherits(Asteroids.MovingPolygon, Asteroids.MovingObject);

  MovingPolygon.prototype.move = function () {
    var i;

    Asteroids.MovingObject.prototype.move.call(this);

    for (i = 0; i < this.numSides; i++) {
      if (this instanceof Asteroids.Asteroid) {
        Asteroids.Util.vecAdd(this.vertices[i], this.vel());
      }

      this.calculateEdges()
      this.calculateEdgeCenters();
    }
  };

  MovingPolygon.prototype.isCollidedWith = function (otherObject) {
    var my = this,
        collided = false;

    if (otherObject instanceof Asteroids.Ship) {
      otherObject.edgeCenters.forEach(function (edgeCenter) {
        var d = Asteroids.Util.distance(my.pos, edgeCenter);

        if (d < my.r) {
          collided = true;
        }
      });

      otherObject.vertices.forEach(function (vertex) {
        var d = Asteroids.Util.distance(my.pos, vertex);

        if (d < my.r) {
          collided = true;
        }
      });
    } else {
      var d = Asteroids.Util.distance(this.pos, otherObject.pos);
      collided = (d < (this.r + otherObject.r));
    }
    return collided;
  };

  MovingPolygon.prototype.calculateEdges = function () {
    var i;

    for (i = 0; i < this.numSides; i++) {
      if (i == this.numSides - 1) {
        this.edges[i] = [this.vertices[i], this.vertices[0]];
      } else {
        this.edges[i] = [this.vertices[i], this.vertices[i+1]];
      }
    }
  };

  MovingPolygon.prototype.calculateEdgeCenters = function () {
    var i

    for (i = 0; i < this.numSides; i++) {
      this.edgeCenters[i] = Asteroids.Util.vectorMidPoint(
        this.edges[i]);
    }
  };

  // see hit box points of contact
  //
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
  //
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

  MovingPolygon.prototype.vel = function () {
    return new SAT.V(this.speed*this.head[0], this.speed*this.head[1]);
  };


})();
