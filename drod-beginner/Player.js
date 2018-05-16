class Player {

  playTurn(warrior) {
    if (typeof this.brain == 'undefined') {
        this.brain = new PlayerBrain(20, warrior);
    }

    let brain = this.brain;

    if (brain.shouldHeal()) {
      warrior.rest();
      brain.setPreviousAction("rest");
    } else {
      this.makeAction(warrior, brain);
    }

    brain.setPreviousHealth(warrior.health())
  }

  makeAction(warrior, brain) {
    let direction = brain.direction;

    if (warrior.feel(direction).isWall()) {
      direction = brain.reverseDirection();
    }

    if (warrior.feel(direction).isCaptive()) {
      warrior.rescue(direction);
      brain.setPreviousAction("rescue");
    }
    else if (warrior.feel(direction).isEmpty()) {
      direction = brain.determineDirection(warrior);
      warrior.walk(direction);
      brain.setPreviousAction("walk");
    }
    else {
      warrior.attack(direction);
      brain.setPreviousAction("attack");
    }
  }

}

class PlayerBrain {

  constructor(startingHealth, warrior) {
    this.startingHealth = startingHealth;
    this.previousHealth = startingHealth;
    this.previousAction = "start";
    this.direction = "backward";
    this.warrior = warrior;
  }

  beingAttacked() {
    return this.previousHealth > this.warrior.health();
  }

  determineDirection() {
      if (this.shouldReverse(this.warrior.health())) {
        this.direction = this.reverseDirection();
      }

      return this.direction;
  }

  reverseDirection() {
      if (this.direction == "backward") {
        this.direction = "forward";
      } else {
        this.direction = "backward";
      }

      return this.direction;
  }

  setPreviousAction(action) {
    this.previousAction = action;
  }

  setPreviousHealth(health) {
    this.previousHealth = health;
  }

  shouldReverse(health) {
    return (this.beingAttacked() && health < this.startingHealth / 2);
  }

  shouldHeal() {
    return (this.warrior.health() < this.startingHealth && !this.beingAttacked());
  }

}
