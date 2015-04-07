"use strict";

(function () {
  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  Asteroids.Util = {};

  Asteroids.Util.inherits = function (ChildClass, ParentClass) {
    var Surrogate = function () {};

    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  Asteroids.Util.randomVec = function (length) {
    var vec = [Math.random() * length*length];
    vec[1] = length*length-vec[0];
    var sign = (Math.random() < 0.5 ? -1 : +1);
    vec[0] *= sign;
    sign = (Math.random() < 0.5 ? -1 : +1);
    vec[1] *= sign;

    return vec;
  };

  Asteroids.Util.vecAdd = function (vec0, vec1) {
    vec0[0] += vec1[0];
    vec0[1] += vec1[1];
    return vec0;
  };

  Asteroids.Util.distance = function (pos0, pos1) {
    var dx = pos0[0] - pos1[0],
        dy = pos0[1] - pos1[1];

    return Math.sqrt(dx*dx + dy*dy);
  };

  Asteroids.Util.normVector = function (vec) {
    var d = Asteroids.Util.distance([0, 0], vec);
    vec = vec.slice();
    vec[0] /= d;
    vec[1] /= d;

    return vec;
  };

  Asteroids.Util.rotateVec = function (vec, theta) {
    var r0 = vec[0]*Math.cos(theta) - vec[1]*Math.sin(theta);
    var r1 = vec[0]*Math.sin(theta) + vec[1]*Math.cos(theta);

    vec[0] = r0;
    vec[1] = r1;

    return vec;
  };

  Asteroids.Util.vectorMidPoint = function (lineSegment) {
    return [
      (lineSegment[0][0] + lineSegment[1][0])/2,
      (lineSegment[0][1] + lineSegment[1][1])/2
    ];
  };

  Asteroids.Util.dupVertices = function (vertices) {
    var i,
        dup = [];

    for (i = 0; i < vertices.length; i++) {
      dup.push(vertices[i]);
    }

    return dup;
  }

})();
