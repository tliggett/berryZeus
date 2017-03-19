
//Copyright T.J. Liggett Mar 2017

// Recursion Project: Berry Zeus

/* Using fractal lightning, become Zeus and destroy all berries in your path
  




*/

// In javascript, all variables are vars. This is where I create all of them.


var x,y, count, c, s, isActive, grasspic, cloudpic, berrypics, b, lightX, lightY;
var canvas, windH, windW;
var level, berries, progress, lives;
var zeuspic, mixed;


/* In the preload() function, I load in all of the images for the game before the game begins,
   so there are no loading problems. The berry pics array is a maplike structure that allows me
   to load in the images in the most effective way.
*/

function preload(){
   mixed = loadImage("data/mixed.png");
   zeuspic = loadImage("data/zeus.gif");
   grasspic = loadImage("data/grass.jpg");
   cloudpic = loadImage("data/cloud.png");
   berrypics = [];
   berrypics["rollR_00"] = loadImage("data/blueberry/rollR_00.png");
   berrypics["rollR_01"] = loadImage("data/blueberry/rollR_01.png");
   berrypics["rollR_02"] = loadImage("data/blueberry/rollR_02.png");
   berrypics["rollR_03"] = loadImage("data/blueberry/rollR_03.png");
   berrypics["rollR_04"] = loadImage("data/blueberry/rollR_04.png");
   berrypics["sliced"] = loadImage("data/blueberry/sliced.png");
}

function setup() {
    // Creates what is basically the scoreboard for the game.    
    level = 1;
    lives = 3;
    progress = 0;
    
    // Create the berry array. This array is used like a java arraylist.
    berries = [];
    berries[0] = new berry();
    
    //Sets up the width and height adjustable by window size.
    windW = windowWidth;
    windH = windW/2;
    if(windH > windowHeight){
     windH = windowHeight; 
    }
    canvas = createCanvas(windW, windH);
    canvas.parent('sketch-holder');
    
    
    //Sets up all of the lightning variables.
    x = [];
    y = [];
    lightX = 0;
    lightY = 0;
    isActive = false;
    count = 17;
    c = 0;
    s = 0;
    strokeWeight(1);
    
}


function draw() {
  //If the game is alive, then it will run through this part of the draw function.
  if(lives > 0){
  
  //Draws all of the background images including clouds, grass, etc...
  background(135, 206, 235);
  noStroke();
  fill(0,0,175);
  textSize(height/15);
  image(grasspic, 0, height*2/3, width, height/3);
  push();
  tint(255, 125);
  image(mixed, width*3/7, height*2/3 + height/100, width/7, width/7);
  pop();
  image(cloudpic, (width/2) - (height*3.5*(2/5))/2,0, height*3.5*(2/5), height*2/5);
  
  
  
  //Calls every berry's tick function, updating their position and health and displaying them.
  for(var i = 0; i < level; i++){
  berries[i].tick();
  if(berries[i].deathCount > 50){
   berries[i] = new berry(); 
   progress++;
  }
  }
  
  //Checks progress and updates the level
  if(progress > level*3){
    progress = 0;
    level ++;
    berries[level-1] = new berry();
  }
  
  //Displays lightning
  stroke(255, 193, 40);
  for(var i = 0; i < count-1; i++){
    if(i < s)
    line(x[i], y[i], x[i+1], y[i+1]);
  }
  if(isActive)
  s+= 2;
  
  if(s >= count){
    //Creates flash effect of lightning
    strokeWeight(random(-15*height/500,15*height/500));
  }
  if(s > 75){
   //Kills lightning
   strokeWeight(height/500);
   isActive = false;
   s = 0;
  }
  
  }else{
   //Displays if Game is over
   text("GAME OVER", width/2 -width/10, height/3); 
  }
  //Title and level HUD
  text("Berry Zeus", width*5/6, height/12);
  text("Level " + level, width*5/6, height/6);
  
  for(var i = 0; i <lives; i++){
    //Shows how many lives are left
    image(zeuspic, width/20 * i, height/30, width/20, width/20); 
  }
}

function mousePressed(){
  //When mouse is pressed creates a new lightning bolt
  s= 0;
  strokeWeight(height/500);
  createBolt(mouseX, mouseY);
  isActive = true;
  lightX = mouseX;
  lightY = mouseY;
  
}

function windowResized(){
    //Resizes game with the window
    windW = windowWidth;
    windH = windW/2;
    if(windH > windowHeight){
     windH = windowHeight; 
    }
  canvas = resizeCanvas(windW, windH); 
  
}


function createBolt(q,w){
 //Sets minimum and maximum x and y values.
 x[0] = random((width/2) - (height*3.5*(2/5))/2 + height/7,(width/2) + (height*3.5*(2/5))/2 - height/7);
 x[count-1] = q;
 y[0] = height/4;
 y[count-1] = w;
 
 //Starts recursive methods
 setX(0, count-1);
 setY(0, count-1);
}

function setX(min, max){
  //because this is recursive if statement basically serves as a while loop
  if(max-min >= 2){
  //sets midpoint value  
  var mid = (max+min)/2;
  x[mid] = ((x[max] + x[min])/2) + random(-width/12,width/12); 
  //splits into two more recursive methods
  setX(mid, max);
  setX(min,mid);
 
 
  }
}



function setY(min, max){
  //because this is recursive if statement basically serves as a while loop
  if(max-min >= 2){
  //sets midpoint value 
  var mid = (max+min)/2;
  y[mid] = ((y[max] + y[min])/2) + random(height/500);
  //splits into two more recursive methods
  setY(mid, max);
  setY(min,mid);
 
 
  }
}
//this is the berry class for the game
function berry(){
 //location vector is a percentage of the total screen size
  this.x = 0;
 this.y = random(2/3, 14/15);
 this.alive = true;
 //k is the image in the roll
 this.k = 0;
 //speed is a percentage of the total screen size
 this.speed = random(1/600, 1/400 * sqrt(level));
 this.move = move; 
 this.display = display;
 this.tick = tick;
 //helps with death animation
 this.deathCount = 0;
 
 
}

function move(){
  //moves x and k
  this.x += this.speed; 
  this.k += this.speed*width/12;
  if(this.k > 4){
   this.k = 0; 
  }
  //If a berry makes it across the screen a life is deducted
  if(this.x > 1){
   this.x = 0;
   lives--;
  }

}

function display(){
  //If alive it displays an image in the roll animation
  if(this.alive){
  image(berrypics["rollR_0" + int(this.k)], (this.x)*width-height/16, (this.y)*height-height/16, height/8,height/8);
  }else{
    //if dead it displays the sliced image which fades away
    push();
    tint(255, 255-(this.deathCount*5));
   image(berrypics["sliced"], (this.x)*width-height/16, (this.y)*height-height/16, height/8,height/8);
   pop();
  this.deathCount++;
  }
  
  
}

function tick(){
  //checks if the berry is zapped and then moves and displays berry
 if(isActive && s > count){
  if(abs(lightX/width-this.x) < 0.029 && lightY/height - this.y < 0.05 && lightY/height - this.y > -0.07)
    this.alive = false;
 }
 if(this.alive)
 this.move();
 this.display();
 
  
}