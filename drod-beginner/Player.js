class Player {

  playTurn(warrior) {
    if (typeof this.brain == 'undefined') {
        this.brain = new PlayerBrain(20, warrior);
    }

    let brain = this.brain;

    if (brain.shouldHeal()) {
      warrior.rest();
    } else {
      this.moveAction(warrior);
    }

    brain.setPreviousHealth(warrior.health())
  }

  moveAction(warrior) {
    if (warrior.feel().isCaptive()) {
      warrior.rescue();
    }
    else if (warrior.feel().isEmpty() || warrior.attack()) {
      warrior.walk();
    }
  }

}

class PlayerBrain {

  constructor(startingHealth, warrior) {
    this.startingHealth = startingHealth;
    this.previousHealth = startingHealth;
    this.warrior = warrior;
  }

  beingAttacked() {
    return this.previousHealth >  this.warrior.health();
  }

  setPreviousHealth(health) {
    this.previousHealth = health;
  }

  shouldHeal() {
    return (this.warrior.health() < this.startingHealth && !this.beingAttacked());
  }

}
