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

    for (i = 0; i < this.numSides; i++) {
      if (this instanceof Asteroids.Asteroid) {
        Asteroids.Util.vecAdd(this.vertices[i], this.vel());
      }
      // Asteroids.Util.vecAdd(this.edges[i], this.vel());
      // Asteroids.Util.vecAdd(this.edgeCenters[i], this.vel());

      this.calculateEdges()
      this.calculateEdgeCenters();
    }
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

})();
