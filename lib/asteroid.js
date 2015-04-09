(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (keys) {
    keys.color         = Asteroid.COLOR;
    keys.numSides      = keys.numSides || Math.ceil(7*Math.random() + 2);
    keys.maxSideLen    = (Asteroid.MAX_RADIUS-Asteroid.MIN_RADIUS)*Math.random() + (Asteroid.MIN_RADIUS);
    keys.r             = Asteroid.MAX_RADIUS*Math.random();
    keys.head          = this.startingHead();
    keys.speed         = this.startingSpeed();
    keys.polygon       = new SAT.Polygon();
    keys.newVertexIdxs = [];
    keys.color         = Asteroids.Util.randomRGBA();

    if (keys._vertices) {
      keys.pos = keys._vertices[0].clone()
    } else {
      keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);
    }

    Asteroids.MovingPolygon.call(this, keys);

    if (keys._vertices) {
      this.polygon = new SAT.Polygon(new SAT.V(), keys._vertices);
      this.calcArea();
    } else {
      this.calculateVertices();
      this.calcArea();
    }
  };

  Asteroid.MAX_RADIUS = 200;
  Asteroid.MIN_RADIUS = 13;

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
    ctx.fillStyle = this.color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    ctx.moveTo(
      this.vertices(0).x,
      this.vertices(0).y);

    for (var i = 1; i < this.numSides; i++) {
      ctx.lineTo(
        this.vertices(i).x,
        this.vertices(i).y);
    }

    ctx.closePath();
    ctx.fill();
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
      vertices[i] = new SAT.V(radius[0], radius[1]);
      vertices[i].rotate(radians[i]);
      vertices[i].add(this.pos);
    }

    this.polygon.setPoints(vertices);
  };

  Asteroid.prototype.registerCollision = function (bullet, response) {
    var i, j, k, temp, p1, p2, xIntercept, yIntercept, segSlope, segIntercept, bulletOut,
        bulletIn = bullet.pos.clone(),
        bulletSlope = bullet.slope,
        bulletIntercept = bullet.intercept,
        vertexAdded = false;

    // iterate thru vertices and add in bullet pos where it fits
    for (i = 0; i < this.numSides && this.newVertexIdxs.length < 2; i++) {
      j = (i === this.numSides - 1 ? 0 : i+1);
      k = (this.newVertexIdxs[0] && j > 0 ? j+1 : j);

      p1 = this.vertices(i);
      p2 = this.vertices(j);
      segSlope = (p2.y - p1.y)/(p2.x - p1.x);
      segIntercept = p2.y - segSlope*p2.x;
      xIntercept = (segIntercept - bulletIntercept)/(bulletSlope - segSlope);

      if (this.vertices(j).x < xIntercept && xIntercept < this.vertices(i).x) {

        this.newVertexIdxs.push(k);
        this.newVertices.splice(k, 0, new SAT.V(
          xIntercept, bulletSlope*xIntercept + bulletIntercept));
      } else if (this.vertices(j).x < xIntercept && xIntercept < this.vertices(i).x) {

        this.newVertexIdxs.push(k);
        this.newVertices.splice(k, 0, new SAT.V(
          xIntercept, bulletSlope*xIntercept + bulletIntercept));
      } else if (this.vertices(i).x < xIntercept && xIntercept < this.vertices(j).x) {

        this.newVertexIdxs.push(k);
        this.newVertices.splice(k, 0, new SAT.V(
          xIntercept, bulletSlope*xIntercept + bulletIntercept));
      } else if (this.vertices(i).x < xIntercept && xIntercept < this.vertices(j).x) {

        this.newVertexIdxs.push(k);
        this.newVertices.splice(k, 0, new SAT.V(
          xIntercept, bulletSlope*xIntercept + bulletIntercept));
      }
    }

    if (this.newVertexIdxs[1] < this.newVertexIdxs[0]) {
      temp = (this.newVertexIdxs[0] + 1);
      this.newVertexIdxs[0] = this.newVertexIdxs[1];
      this.newVertexIdxs[1] = temp;
    }
  }

  Asteroid.prototype.splitBy = function (bullet, response) {
    var i, temp,
        keepGoing = true,
        newAsteroidVertices1 = [],
        newAsteroidVertices2 = [];

    this.newVertices = this.dupVertices();
    this.registerCollision(bullet, response);

    i = this.newVertexIdxs[0];

    while (keepGoing) {
      // get vertices for the first new asteroid
      // the second bullet collision location is the last vertex
      if (i == this.newVertexIdxs[1]) {
        keepGoing = false;
      }

      newAsteroidVertices1.push(this.newVertices[i].clone());

      // nullify all of the vertices that now belong to the first new asteroid
      if (i != this.newVertexIdxs[0] && i != this.newVertexIdxs[1]) {
        this.newVertices[i] = null;
      }

      i++;

      if (i == this.newVertices.length - 1) {
        i = 0;
      }
    }

    // take the remaining vertices and build the second new asteroid
    this.newVertices.forEach(function (vertex) {
      if (vertex) {
        newAsteroidVertices2.push(vertex.clone());
      }
    });

    return [
      new Asteroids.Asteroid({
        _vertices: newAsteroidVertices1,
        numSides: newAsteroidVertices1.length }),
      new Asteroids.Asteroid({
        _vertices: newAsteroidVertices2,
        numSides: newAsteroidVertices2.length })];
  }
})();
