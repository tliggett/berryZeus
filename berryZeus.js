
//Copyright T.J. Liggett Mar 2017


var x,y, count, c, s, isActive, grasspic, cloudpic, berrypics, b, lightX, lightY;
var canvas, windH, windW;
var level, berries, progress, lives;
var zeuspic, mixed;

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
    
    level = 1;
    lives = 3;
    progress = 0;
    berries = [];
    berries[0] = new berry();
    
    windW = windowWidth;
    windH = windW/2;
    if(windH > windowHeight){
     windH = windowHeight; 
    }
    canvas = createCanvas(windW, windH);
    canvas.parent('sketch-holder');
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
  
  if(lives > 0){
  
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
  for(var i = 0; i < level; i++){
  berries[i].tick();
  if(berries[i].deathCount > 50){
   berries[i] = new berry(); 
   progress++;
  }
  }
  
  if(progress > level*3){
    progress = 0;
    level ++;
    berries[level-1] = new berry();
  }
  
  stroke(255, 193, 40);
  
  for(var i = 0; i < count-1; i++){
    if(i < s)
    line(x[i], y[i], x[i+1], y[i+1]);
  }
  if(isActive)
  s+= 2;
  
  if(s >= count){
    strokeWeight(random(-15*height/500,15*height/500));
  }
  if(s > 75){
   strokeWeight(height/500);
   isActive = false;
   s = 0;
  }
  
  }else{
   text("GAME OVER", width/2 -width/10, height/3); 
  }
  
  text("Berry Zeus", width*5/6, height/12);
  text("Level " + level, width*5/6, height/6);
  
  for(var i = 0; i <lives; i++){
   image(zeuspic, width/20 * i, height/30, width/20, width/20); 
  }
}

function mousePressed(){
  s= 0;
  strokeWeight(height/500);
  createBolt(mouseX, mouseY);
  isActive = true;
  lightX = mouseX;
  lightY = mouseY;
  
}

function windowResized(){
    windW = windowWidth;
    windH = windW/2;
    if(windH > windowHeight){
     windH = windowHeight; 
    }
  canvas = resizeCanvas(windW, windH); 
  
}


function createBolt(q,w){
 x[0] = random((width/2) - (height*3.5*(2/5))/2 + height/7,(width/2) + (height*3.5*(2/5))/2 - height/7);
 x[count-1] = q;
 y[0] = height/4;
 y[count-1] = w;
 setX(0, count-1);
 setY(0, count-1);
}

function setX(min, max){
  if(max-min >= 2){
  var mid = (max+min)/2;
  x[mid] = ((x[max] + x[min])/2) + random(-width/12,width/12); 
  setX(mid, max);
  setX(min,mid);
 
 
  }
}



function setY(min, max){
  if(max-min >= 2){
  var mid = (max+min)/2;
  y[mid] = ((y[max] + y[min])/2) + random(height/500);
  setY(mid, max);
  setY(min,mid);
 
 
  }
}

function berry(){
 this.x = 0;
 this.y = random(2/3, 14/15);
 this.alive = true;
 this.k = 0;
 this.speed = random(1/600, 1/400 * sqrt(level));
 this.move = move; 
 this.display = display;
 this.tick = tick;
 this.deathCount = 0;
 
 
}

function move(){
  this.x += this.speed; 
  this.k += this.speed*width/12;
  if(this.k > 4){
   this.k = 0; 
  }
  if(this.x > 1){
   this.x = 0;
   lives--;
  }

}

function display(){
  if(this.alive){
  image(berrypics["rollR_0" + int(this.k)], (this.x)*width-height/16, (this.y)*height-height/16, height/8,height/8);
  }else{
    push();
    tint(255, 255-(this.deathCount*5));
   image(berrypics["sliced"], (this.x)*width-height/16, (this.y)*height-height/16, height/8,height/8);
   pop();
  this.deathCount++;
  }
  
  
}

function tick(){
 if(isActive && s > count){
  if(abs(lightX/width-this.x) < 0.029 && lightY/height - this.y < 0.05 && lightY/height - this.y > -0.07)
    this.alive = false;
 }
 if(this.alive)
 this.move();
 this.display();
 
  
}