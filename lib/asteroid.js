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
    keys.vertices    = [];
    keys.edges       = [];
    keys.edgeCenters = [];

    Asteroids.MovingPolygon.call(this, keys);

    this.calculateVertices();
    this.calculateEdges();
    this.calculateEdgeCenters();
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

  Asteroid.prototype.isCollidedWith = function (otherObject) {
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

  Asteroid.prototype.startingSpeed = function () {
    return Math.random() + 1;
  };

  Asteroid.prototype.draw = function (ctx) {
    ctx.strokeStyle = Asteroid.COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();

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

    // this.drawContacts(ctx);
  };

  // see hit box points of contact
  //
  // Asteroid.prototype.drawContacts = function (ctx) {
  //   ctx.fillStyle = 'black';
  //
  //   ctx.beginPath();
  //
  //   this.edgeCenters.forEach(function (edgeCenter) {
  //     ctx.arc(
  //       edgeCenter[0],
  //       edgeCenter[1],
  //       2,
  //       0,
  //       2 * Math.PI,
  //       false
  //     );
  //   });
  //
  //   ctx.fill();
  //
  //   ctx.beginPath();
  //
  //   this.vertices.forEach(function (vertex) {
  //     ctx.arc(
  //       vertex[0],
  //       vertex[1],
  //       2,
  //       0,
  //       2 * Math.PI,
  //       false
  //     );
  //   });
  //
  //   ctx.fill();
  // };

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
