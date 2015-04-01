(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function (keys) {
    var key

    for (key in keys) {
      this[key] = keys[key];
    }
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(
      this.pos[0],
      this.pos[1],
      this.r,
      0,
      2 * Math.PI,
      false
    );

    ctx.fill();
  };

  MovingObject.prototype.move = function () {
    Asteroids.Util.vecAdd(this.pos, this.vel());
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
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

  MovingObject.prototype.isWrappable = function () {
    return true
  };

  MovingObject.prototype.vel = function () {
    return [this.speed*this.head[0], this.speed*this.head[1]];
  };
})();
