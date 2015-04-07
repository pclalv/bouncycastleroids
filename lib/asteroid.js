(function () {
  "use strict";

  if (typeof(window.Asteroids) === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function (keys) {
    keys.color         = Asteroid.COLOR;
    keys.numSides      = keys.numSides || Math.ceil(7*Math.random() + 2);
    keys.maxSideLen    = 100*Math.random();
    keys.r             = Asteroid.MAX_RADIUS*Math.random();
    keys.head          = this.startingHead();
    keys.speed         = this.startingSpeed();
    keys.polygon       = new SAT.Polygon();
    keys.newVertexIdxs = [];

    if (keys._vertices) {
      keys.pos = keys._vertices[0].clone()
    } else {
      keys.pos = new SAT.V(keys.pos[0], keys.pos[1]);
    }

    Asteroids.MovingPolygon.call(this, keys);

    if (keys._vertices) {
      this.polygon = new SAT.Polygon(new SAT.V(), keys._vertices);
    } else {
      this.calculateVertices();
    }
  };

  Asteroid.COLOR      = 'black';
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

    if (!this.vertices()[0]) {
      debugger
    }

    ctx.moveTo(
      this.vertices()[0].x,
      this.vertices()[0].y);

    for (var i = 1; i < this.numSides; i++) {
      ctx.lineTo(
        this.vertices()[i].x,
        this.vertices()[i].y);
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

    if (vertices instanceof Array) {
      this.polygon.setPoints(vertices);
    }
  };

  Asteroid.prototype.registerCollision = function (bullet) {
    var i, j,
        vertex = bullet.pos.clone();

    this._collidedBullet = bullet;

    if (!this.newVertices) {
      this.newVertices = this.dupVertices();
    }

    // iterate thru vertices and add in bullet pos where it fits
    for (i = 0; i < this.newVertices.length; i++) {
      if (i == this.newVertices.length - 1) {
        j = 0;
      } else {
        j = i+1;
      }

      if (this.newVertices[j].x < vertex.x && vertex.x < this.newVertices[i].x
        && this.newVertices[j].y < vertex.y && vertex.y < this.newVertices[i].y) {

        this.newVertices.splice(j, 0, vertex)
        this.newVertexIdxs.push(j);
        break
      } else if (this.newVertices[j].x < vertex.x && vertex.x < this.newVertices[i].x
        && this.newVertices[i].y < vertex.y && vertex.y < this.newVertices[j].y) {

        this.newVertices.splice(j, 0, vertex)
        this.newVertexIdxs.push(j);
        break
      } else if (this.newVertices[i].x < vertex.x && vertex.x < this.newVertices[j].x
        && this.newVertices[i].y < vertex.y && vertex.y < this.newVertices[j].y) {

        this.newVertices.splice(j, 0, vertex)
        this.newVertexIdxs.push(j);
        break
      } else if (this.newVertices[i].x < vertex.x && vertex.x < this.newVertices[j].x
        && this.newVertices[j].y < vertex.y && vertex.y < this.newVertices[i].y) {

        this.newVertices.splice(j, 0, vertex)
        this.newVertexIdxs.push(j);
        break
      }
    }

    if (this.newVertexIdxs[1] && this.newVertexIdxs[1] <= this.newVertexIdxs[0]) {
      this.newVertexIdxs[0]++;
    }

    if (this.newVertices.length === 0) {
      debugger
    } else if (vertex.x != this.newVertices[this.newVertexIdxs[0]].x
      && typeof this.newVertexIdxs[1] === "undefined") {
      debugger
    }

  }

  Asteroid.prototype.splitBy = function (bullet) {
    var i, temp,
        keepGoing = true,
        newAsteroidVertices1 = [],
        newAsteroidVertices2 = [];

    this.registerCollision(bullet);
    // this.newVertices = Asteroids.Util.dupVertices(this.vertices());

    if (this.newVertexIdxs[0] > this.newVertexIdxs[1]) {
      temp = this.newVertexIdxs[0];
      this.newVertexIdxs[0] = this.newVertexIdxs[1];
      this.newVertexIdxs[1] = temp;
    }

    i = this.newVertexIdxs[0];

    console.log(this.newVertices, "new vtxs");
    console.log(this.newVertexIdxs, "new idxs");

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
