// TO DO:
// I-SHAPE ROTATION NOT WORKING BECAUSE OF 2 CELLS THAT CAN BE COLLIDING. CORRECTION RIGHT NOW MOVES SHAPE ONLY ONE CELL.
// Maybe develope global rotation function that works for all shapes to reduce code
// Animations: Deleting Row, Score, ...
// Introduce Start Countdown

// SOME GLOBALS
const startGameWindow = document.querySelector(".start-lightbox");
const startBtn = document.querySelector(".start-btn");
const scoreCounter = document.querySelector(".score");
const endScore = document.querySelector(".end-score");
const gameOverWindow = document.querySelector(".lightbox");
const playAgainBtn = document.querySelector(".playAgain");
let activeShape = 0;
let interval = 0;
let score = 0;

// EVENT LISTENER
startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", resetGame);
window.addEventListener("keydown", processUserInput);


// SETUP CANVAS
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = "300";
canvas.height = "600";

// CREATE THE GRID
// Creates a 2-dimensional array, representing 10 x 20 cells. Each cell is a Path2D Object.
const grid = createGrid();




//////////////////////////////////////////////////////////////////////////////////
//////////////////// CLASSES ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

class Shape {
  constructor() {
    this.collided = false;
    this.static = false;
    this.rotation = 0;
  }
  moveDown() {
    this.deleteFromGrid();
    this.positionCell1[1]++;
    this.positionCell2[1]++;
    this.positionCell3[1]++;
    this.positionCell4[1]++;
    this.collided = this.checkForCollision();
    if (this.collided) {
      // if shape is colliding after moveDown, undo moveDown and set cells and the shape to static.
      this.positionCell1[1]--;
      this.positionCell2[1]--;
      this.positionCell3[1]--;
      this.positionCell4[1]--;
      this.addToGrid();
      this.setToStatic();
      loop(); // as soon as shape collides at bottom, draw next shape. Otherwise there would be an annoying 1 second pause.
    } else {
      this.addToGrid();
    }
  }
  moveRight(purpose) {
    // Move every cell of the shape to the right. After that, check for collision and undo the movement, if collision is the case.
    // This function can be called by user (pressing key) or in the process of avoiding collision.
    // If the purpose is "collisionTesting", dont delete from or add to grid. Otherwise will result in errors.
    // If the purpose is "collisionTesting", return a false or true statement.
    if (purpose === "userInteraction") {
      this.deleteFromGrid();
    }
    this.positionCell1[0]++;
    this.positionCell2[0]++;
    this.positionCell3[0]++;
    this.positionCell4[0]++;
    this.collided = this.checkForCollision();
    if (this.collided) {
      this.positionCell1[0]--;
      this.positionCell2[0]--;
      this.positionCell3[0]--;
      this.positionCell4[0]--;
      if (purpose === "collisionTesting") {
        return false;
      }
    } else {
      if (purpose === "collisionTesting") {
        return true;
      }
    }
    this.addToGrid();
  }
  moveLeft(purpose) {
    // Code description see moveRight() method.
    if (purpose === "userInteraction") {
      this.deleteFromGrid();
    }
    this.positionCell1[0]--;
    this.positionCell2[0]--;
    this.positionCell3[0]--;
    this.positionCell4[0]--;
    this.collided = this.checkForCollision();
    if (this.collided) {
      this.positionCell1[0]++;
      this.positionCell2[0]++;
      this.positionCell3[0]++;
      this.positionCell4[0]++;
      if (purpose === "collisionTesting") {
        return false;
      }
    } else {
      if (purpose === "collisionTesting") {
        return true;
      }
    }
    this.addToGrid();
  }
  checkForCollision() {
    if (
      this.positionCell1[0] < 0 ||
      this.positionCell2[0] < 0 ||
      this.positionCell3[0] < 0 ||
      this.positionCell4[0] < 0 ||
      this.positionCell1[0] > 9 ||
      this.positionCell2[0] > 9 ||
      this.positionCell3[0] > 9 ||
      this.positionCell4[0] > 9 ||
      this.positionCell1[1] > 19 ||
      this.positionCell2[1] > 19 ||
      this.positionCell3[1] > 19 ||
      this.positionCell4[1] > 19 ||
      grid[this.positionCell1[0]][this.positionCell1[1]].static === true ||
      grid[this.positionCell2[0]][this.positionCell2[1]].static === true ||
      grid[this.positionCell3[0]][this.positionCell3[1]].static === true ||
      grid[this.positionCell4[0]][this.positionCell4[1]].static === true
    ) {
      return true;
    } else {
      return false;
    }
  }
  deleteFromGrid() {
    grid[this.positionCell1[0]][this.positionCell1[1]].filled = false;
    grid[this.positionCell2[0]][this.positionCell2[1]].filled = false;
    grid[this.positionCell3[0]][this.positionCell3[1]].filled = false;
    grid[this.positionCell4[0]][this.positionCell4[1]].filled = false;
  }
  addToGrid() {
    grid[this.positionCell1[0]][this.positionCell1[1]].color = this.color;
    grid[this.positionCell2[0]][this.positionCell2[1]].color = this.color;
    grid[this.positionCell3[0]][this.positionCell3[1]].color = this.color;
    grid[this.positionCell4[0]][this.positionCell4[1]].color = this.color;

    grid[this.positionCell1[0]][this.positionCell1[1]].filled = true;
    grid[this.positionCell2[0]][this.positionCell2[1]].filled = true;
    grid[this.positionCell3[0]][this.positionCell3[1]].filled = true;
    grid[this.positionCell4[0]][this.positionCell4[1]].filled = true;
  }
  setToStatic() {
    this.static = true;
    grid[this.positionCell1[0]][this.positionCell1[1]].static = true;
    grid[this.positionCell2[0]][this.positionCell2[1]].static = true;
    grid[this.positionCell3[0]][this.positionCell3[1]].static = true;
    grid[this.positionCell4[0]][this.positionCell4[1]].static = true;
  }
}

class LShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 1];
    this.positionCell2 = [4, 1];
    this.positionCell3 = [5, 1];
    this.positionCell4 = [5, 0];
    this.color = "#F78400";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0]++;
      this.positionCell1[1]--;
      this.positionCell3[0]--;
      this.positionCell3[1]++;
      this.positionCell4[1] += 2;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]++;
            this.positionCell3[0]++;
            this.positionCell3[1]--;
            this.positionCell4[1] -= 2;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[0]++;
      this.positionCell1[1]++;
      this.positionCell3[0]--;
      this.positionCell3[1]--;
      this.positionCell4[0] -= 2;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]--;
            this.positionCell3[0]++;
            this.positionCell3[1]++;
            this.positionCell4[0] += 2;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0]--;
      this.positionCell1[1]++;
      this.positionCell3[0]++;
      this.positionCell3[1]--;
      this.positionCell4[1] -= 2;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]--;
            this.positionCell3[0]--;
            this.positionCell3[1]++;
            this.positionCell4[1] += 2;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[0]--;
      this.positionCell1[1]--;
      this.positionCell3[0]++;
      this.positionCell3[1]++;
      this.positionCell4[0] += 2;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]++;
            this.positionCell3[0]--;
            this.positionCell3[1]--;
            this.positionCell4[0] -= 2;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}

class InvertedLShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 0];
    this.positionCell2 = [3, 1];
    this.positionCell3 = [4, 1];
    this.positionCell4 = [5, 1];
    this.color = "#0000F0";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0] += 2;
      this.positionCell2[0]++;
      this.positionCell2[1]--;
      this.positionCell4[0]--;
      this.positionCell4[1]++;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] -= 2;
            this.positionCell2[0]--;
            this.positionCell2[1]++;
            this.positionCell4[0]++;
            this.positionCell4[1]--;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[1] += 2;
      this.positionCell2[0]++;
      this.positionCell2[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1]--;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[1] -= 2;
            this.positionCell2[0]--;
            this.positionCell2[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1]++;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0] -= 2;
      this.positionCell2[0]--;
      this.positionCell2[1]++;
      this.positionCell4[0]++;
      this.positionCell4[1]--;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] += 2;
            this.positionCell2[0]++;
            this.positionCell2[1]--;
            this.positionCell4[0]--;
            this.positionCell4[1]++;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[1] -= 2;
      this.positionCell2[0]--;
      this.positionCell2[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1]++;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[1] += 2;
            this.positionCell2[0]++;
            this.positionCell2[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1]--;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}
class IShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 1];
    this.positionCell2 = [4, 1];
    this.positionCell3 = [5, 1];
    this.positionCell4 = [6, 1];
    this.color = "#42F7F7";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0] += 2;
      this.positionCell1[1]--;
      this.positionCell2[0]++;
      this.positionCell3[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1] += 2;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] -= 2;
            this.positionCell1[1]++;
            this.positionCell2[0]--;
            this.positionCell3[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1] -= 2;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[0]++;
      this.positionCell1[1] += 2;
      this.positionCell2[1]++;
      this.positionCell3[0]--;
      this.positionCell4[0] -= 2;
      this.positionCell4[1]--;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1] -= 2;
            this.positionCell2[1]--;
            this.positionCell3[0]++;
            this.positionCell4[0] += 2;
            this.positionCell4[1]++;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0] -= 2;
      this.positionCell1[1]++;
      this.positionCell2[0]--;
      this.positionCell3[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1] -= 2;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] += 2;
            this.positionCell1[1]--;
            this.positionCell2[0]++;
            this.positionCell3[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1] += 2;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[0]--;
      this.positionCell1[1] -= 2;
      this.positionCell2[1]--;
      this.positionCell3[0]++;
      this.positionCell4[0] += 2;
      this.positionCell4[1]++;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1] += 2;
            this.positionCell2[1]++;
            this.positionCell3[0]--;
            this.positionCell4[0] -= 2;
            this.positionCell4[1]--;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}
class OShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [4, 0];
    this.positionCell2 = [4, 1];
    this.positionCell3 = [5, 0];
    this.positionCell4 = [5, 1];
    this.color = "#F7F742";
  }
}
class TShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 1];
    this.positionCell2 = [4, 1];
    this.positionCell3 = [4, 0];
    this.positionCell4 = [5, 1];
    this.color = "#F742F7";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0]++;
      this.positionCell1[1]--;
      this.positionCell3[0]++;
      this.positionCell3[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1]++;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]++;
            this.positionCell3[0]--;
            this.positionCell3[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1]--;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[0]++;
      this.positionCell1[1]++;
      this.positionCell3[0]--;
      this.positionCell3[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1]--;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]--;
            this.positionCell3[0]++;
            this.positionCell3[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1]++;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0]--;
      this.positionCell1[1]++;
      this.positionCell3[0]--;
      this.positionCell3[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1]--;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]--;
            this.positionCell3[0]++;
            this.positionCell3[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1]++;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[0]--;
      this.positionCell1[1]--;
      this.positionCell3[0]++;
      this.positionCell3[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1]++;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]++;
            this.positionCell3[0]--;
            this.positionCell3[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1]--;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}
class SShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 0];
    this.positionCell2 = [4, 0];
    this.positionCell3 = [4, 1];
    this.positionCell4 = [5, 1];
    this.color = "#42F742";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0] += 2;
      this.positionCell2[0]++;
      this.positionCell2[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1]++;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] -= 2;
            this.positionCell2[0]--;
            this.positionCell2[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1]--;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[1] += 2;
      this.positionCell2[0]--;
      this.positionCell2[1]++;
      this.positionCell4[0]--;
      this.positionCell4[1]--;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[1] -= 2;
            this.positionCell2[0]++;
            this.positionCell2[1]--;
            this.positionCell4[0]++;
            this.positionCell4[1]++;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0] -= 2;
      this.positionCell2[0]--;
      this.positionCell2[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1]--;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0] += 2;
            this.positionCell2[0]++;
            this.positionCell2[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1]++;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[1] -= 2;
      this.positionCell2[0]++;
      this.positionCell2[1]--;
      this.positionCell4[0]++;
      this.positionCell4[1]++;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[1] += 2;
            this.positionCell2[0]--;
            this.positionCell2[1]++;
            this.positionCell4[0]--;
            this.positionCell4[1]--;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}
class InvertedSShape extends Shape {
  constructor() {
    super();
    this.positionCell1 = [3, 1];
    this.positionCell2 = [4, 1];
    this.positionCell3 = [4, 0];
    this.positionCell4 = [5, 0];
    this.color = "#F00001";
  }
  rotate90deg() {
    this.deleteFromGrid();
    if (this.rotation === 0) {
      this.positionCell1[0]++;
      this.positionCell1[1]--;
      this.positionCell3[0]++;
      this.positionCell3[1]++;
      this.positionCell4[1] += 2;
      this.rotation = 90;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]++;
            this.positionCell3[0]--;
            this.positionCell3[1]--;
            this.positionCell4[1] -= 2;
            this.rotation = 0;
          }
        }
      }
    } else if (this.rotation === 90) {
      this.positionCell1[0]++;
      this.positionCell1[1]++;
      this.positionCell3[0]--;
      this.positionCell3[1]++;
      this.positionCell4[0] -= 2;
      this.rotation = 180;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]--;
            this.positionCell1[1]--;
            this.positionCell3[0]++;
            this.positionCell3[1]--;
            this.positionCell4[0] += 2;
            this.rotation = 90;
          }
        }
      }
    } else if (this.rotation === 180) {
      this.positionCell1[0]--;
      this.positionCell1[1]++;
      this.positionCell3[0]--;
      this.positionCell3[1]--;
      this.positionCell4[1] -= 2;
      this.rotation = 270;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]--;
            this.positionCell3[0]++;
            this.positionCell3[1]++;
            this.positionCell4[1] += 2;
            this.rotation = 180;
          }
        }
      }
    } else if (this.rotation === 270) {
      this.positionCell1[0]--;
      this.positionCell1[1]--;
      this.positionCell3[0]++;
      this.positionCell3[1]--;
      this.positionCell4[0] += 2;
      this.rotation = 0;
      this.collided = this.checkForCollision();
      if (this.collided) {
        let moveDone = this.moveRight("collisionTesting");
        if (!moveDone) {
          moveDone = this.moveLeft("collisionTesting");
          if (!moveDone) {
            this.positionCell1[0]++;
            this.positionCell1[1]++;
            this.positionCell3[0]--;
            this.positionCell3[1]++;
            this.positionCell4[0] -= 2;
            this.rotation = 270;
          }
        }
      }
    }
    this.addToGrid();
  }
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////// LOOP ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function loop() {
  if (!activeShape.static) {
    activeShape.moveDown();
    drawCells();
  } else {
    deleteFullRows();
    activeShape = createRandomShape();
    let isGameOver = processGameOver();
    if (!isGameOver) {
      activeShape.addToGrid();
      drawCells();
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////// FUNCTIONS //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function startGame() {
  drawBackgroundGrid(); // Draws the horizontal and vertical lines (just the visual appearance of the grid, the actual grid has been defined earlier)
  activeShape = createRandomShape(); // Create a random shape
  activeShape.addToGrid(); // Add this shape to the corresponding cells on the grid (set the property "filled" of these cells to "true")
  drawCells(); // ctx.fill() all the cells which have the property "filled === true"
  interval = setInterval(loop, 1000); // Last three steps were just initializing procedure. Now start the game with looping the loop() function.
  startGameWindow.style.visibility = "hidden";
}

function drawBackgroundGrid() {
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    ctx.moveTo(30.5 + i * 30, 0);
    ctx.lineTo(30.5 + i * 30, 600);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#EEE";
    ctx.stroke();
  }
  for (let i = 0; i < 19; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 30.5 + 30 * i);
    ctx.lineTo(300, 30.5 + 30 * i);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#EEE";
    ctx.stroke();
  }
}

function createGrid() {
  const grid = [];
  for (let k = 0; k < 10; k++) {
    const oneLineOfArray = [];
    for (let i = 0; i < 20; i++) {
      const cell = new Path2D();
      cell.rect(0 + k * 30, 0 + i * 30, 30, 30);
      cell.filled = false; // assigning a new property to the Path2D Object, which will be used later.
      cell.static = false; // assigning a new property to the Path2D Object, which will be used later.
      cell.color = "#000000";
      oneLineOfArray.push(cell);
    }
    grid.push(oneLineOfArray);
  }
  return grid;
}

function drawCells() {
  ctx.clearRect(0, 0, 300, 600);
  for (let column of grid) {
    for (let cell of column) {
      if (cell.filled) {
        ctx.fillStyle = cell.color;
        ctx.strokeStyle = "gray";
        ctx.fill(cell);
        ctx.stroke(cell);
      }
    }
  }
  drawBackgroundGrid();
}

function deleteFullRows() {
  for (let y = 0; y < 20; y++) {
    let allCellsFilled = true;
    for (let x = 0; x < 10; x++) {
      if (grid[x][y].filled === false) {
        allCellsFilled = false;
      }
    }
    if (allCellsFilled) {
      for (let x = 0; x < 10; x++) {
        grid[x][y].filled = false;
        grid[x][y].static = false;
        ctx.fillStyle = "red";
        ctx.fill(grid[x][y]);
      }
      for (let y2 = y; y2 > 2; y2--) {
        for (let x2 = 0; x2 < 10; x2++) {
          grid[x2][y2].filled = grid[x2][y2 - 1].filled;
          grid[x2][y2].static = grid[x2][y2 - 1].static;
          grid[x2][y2].color = grid[x2][y2 - 1].color;
        }
      }
      score += 100;
      scoreCounter.textContent = score;
    }
  }
}

function createRandomShape() {
  let randomNum = Math.floor(Math.random() * 7);
  let randomShape;
  switch (randomNum) {
    case 0:
      randomShape = new LShape();
      break;
    case 1:
      randomShape = new InvertedLShape();
      break;
    case 2:
      randomShape = new SShape();
      break;
    case 3:
      randomShape = new InvertedSShape();
      break;
    case 4:
      randomShape = new OShape();
      break;
    case 5:
      randomShape = new IShape();
      break;
    case 6:
      randomShape = new TShape();
      break;
  }
  return randomShape;
}

function processGameOver() {
  if (
    grid[activeShape.positionCell1[0]][activeShape.positionCell1[1]].static === true ||
    grid[activeShape.positionCell2[0]][activeShape.positionCell2[1]].static === true ||
    grid[activeShape.positionCell3[0]][activeShape.positionCell3[1]].static === true ||
    grid[activeShape.positionCell4[0]][activeShape.positionCell4[1]].static === true
  ) {
    gameOverWindow.style.visibility = "visible";
    endScore.textContent += " " + (score + 1);
    window.removeEventListener("keydown", processUserInput);
    clearInterval(interval);
    return true;
  } else {
    return false;
  }
}

function resetGame() {
  score = 0;
  scoreCounter.textContent = score;
  endScore.textContent = "Your score: ";
  for (let column of grid) {
    for (let cell of column) {
      cell.filled = false;
      cell.static = false;
    }
  }
  drawBackgroundGrid();
  activeShape = createRandomShape();
  activeShape.addToGrid();
  drawCells();
  interval = setInterval(loop, 1000);
  gameOverWindow.style.visibility = "hidden";
  window.addEventListener("keydown", processUserInput);
}

function processUserInput(e) {
  if (e.code === "ArrowLeft") {
    activeShape.moveLeft("userInteraction");
  } else if (e.code === "ArrowRight") {
    activeShape.moveRight("userInteraction");
  } else if (e.code === "ArrowDown") {
    activeShape.moveDown();
    score++;
    scoreCounter.textContent = score;
  } else if (e.code === "ArrowUp") {
    activeShape.rotate90deg();
  }
  drawCells();
}




