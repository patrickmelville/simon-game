
//sound stuff
var s1 = document.createElement('audio');
var s2 = document.createElement('audio');
var s3 = document.createElement('audio');
var s4 = document.createElement('audio');
s1.src = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
s2.src = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
s3.src = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
s4.src = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";

var currentButton = "NaA";

var simon = function(){
  //game variables
  this.masterList = [];
  this.playerList = [];
  this.currentM = 0;
  this.currentP = 0;
  this.playspeed = 1000; //decreases as the game gets harder || I have not enabled this feature yet.
  this.deviceLock = true;
  this.strict = false;
  var num2win = 20;
  
  var timeID;
  var colorLookup = {"red": "pink", "green":"lightgreen", "blue":"lightblue", "yellow":"lightyellow",
                    1:"red", 2:"green", 3:"blue", 4:"yellow"};
  var soundLookup = {"red": s1, "green":s2, "blue":s3, "yellow":s4};
  var numLookup = {"red":1, "green":2, "blue":3, "yellow":4};

  
  //game methods
  this.reset = function(){
    //console.log("variables have been reset");
    this.clearMaster();
    this.clearPlayer();
    this.playspeed = 1000; 
    this.deviceLock = true;
    clearInterval(timeID);
  };
  
  this.play = function(){
    //first check in the game is won
    if (this.masterList.length > num2win){
      this.reset();
      $(".streak").removeClass("font");
      $(".streak").html('<i class="fa fa-thumbs-o-up"></i>');
      s4.play();
      setTimeout(function(){s3.play();},200);
      setTimeout(function(){s2.play();},400);
      setTimeout(function(){s1.play();},600);
      return;
    } 
    var currentColor = colorLookup[this.masterList[this.currentM]];
    //console.log("play function initiated - " + this.currentM + ":" + this.masterList + " -->" + currentColor);
    $(".red").css("backgroundColor", "red");
    $(".blue").css("backgroundColor", "blue");
    $(".green").css("backgroundColor", "green");
    $(".yellow").css("backgroundColor", "yellow");
    //play next tone in the list until current meets list.length
    if (this.currentM < this.masterList.length){
      $("."+currentColor).css("backgroundColor", colorLookup[currentColor]);
      soundLookup[currentColor].play();
      this.currentM++;
    } else {
      clearInterval(timeID);
      this.deviceLock = false;
      this.currentM = 0;
      console.log("device unlocked for player input");
    }
  };
  this.start = function(){
    this.reset();
    console.log("game started");
    //this.add2Master(); //delayed this to show the thumbs down icon
    setTimeout(function(){mySimon.add2Master();},750);
    timeID = setInterval(function(){mySimon.play();},this.playspeed);

  };
  
  this.add2Master = function(){
    this.masterList.push(randNum());
    if (this.masterList.length <= num2win){
      $(".streak").addClass("font");
      $(".streak").html(this.masterList.length);
    }
    //console.log("MasterList has been updated: " + this.masterList);
  };
  this.add2player = function(num){
    this.playerList.push(num);
  };
  
  this.clearMaster = function(num){
    this.masterList = [];
    this.currentM = 0;
  };
  this.clearPlayer = function(num){
    this.playerList = [];
    this.currentP = 0;
  };
  
  this.bPush = function(color){
    if (!this.deviceLock){
      currentButton = color;
      $("."+color).css("backgroundColor", colorLookup[color]);
      stopallsounds();
      soundLookup[color].play();
      //console.log("Player has pushed: " + this.playerList);
      
      this.playerList.push(numLookup[color]);
      
      // call check() if yes, add another to master and if not GameOver()
      if (!this.check()){
        s1.play();
        setTimeout(function(){s2.play();},100);
        setTimeout(function(){s3.play();},200);
        setTimeout(function(){s4.play();},300);
        $(".streak").removeClass("font");
        $(".streak").html('<i class="fa fa-thumbs-o-down"></i>');
        console.log("game over");
        if(this.strict){
          this.start();
        } else{
          this.clearPlayer();
          this.currentM = 0;
          timeID = setInterval(function(){mySimon.play();},this.playspeed);
        }
        //
      } else if (this.check()){
        console.log("Check Passed.");
      }
    }
  };
  
  this.check = function(){ 
    if (this.playerList.length < this.masterList.length){ // not the last on the list, so keep pressing
      for (var i = 0; i < this.playerList.length; i++){
        if (this.playerList[i] != this.masterList[i]){
          return false;
        }
      }
      return true;
    } else if(this.playerList.length == this.masterList.length){ // last button on the list, so add on if true
      for (var i = 0; i < this.playerList.length; i++){
        if (this.playerList[i] != this.masterList[i]){
          return false;
        }
      }
      this.deviceLock = true;
      this.add2Master();
      this.clearPlayer();
      timeID = setInterval(function(){mySimon.play();},this.playspeed);
      return true;
    } else {  // something strange happened so the game should end anyway.... ?
      return false;
    }
  };
  
  function randNum(){
    return Math.floor(Math.random() * (4 - 1 + 1) + 1);
  };
  function stopallsounds(){
    s1.pause();
    s1.currentTime = 1;
    s2.pause();
    s2.currentTime = 1;
    s3.pause();
    s3.currentTime = 0;
    s4.pause();
    s4.currentTime = 0;
  }
};


var mySimon = new simon();
$(document).ready(function() {
  //Settings BUTTONS - functionality
  $(".start").click(function(){
    mySimon.start();
  });
  $(".strict").click(function(){
    mySimon.strict = !mySimon.strict;
    if (mySimon.strict){
      $(".strict").removeClass("btn-primary");
      $(".strict").addClass("btn-warning");
    }else {
      $(".strict").addClass("btn-primary");
      $(".strict").removeClass("btn-warning");
    }
    console.log("strict mode is " + mySimon.strict);
  });
  
  //colored BUTTONS - functionality 
  $(".red").mousedown(function() {
    event.preventDefault();
    mySimon.bPush("red");
  });
  $(".green").mousedown(function() {
    event.preventDefault();
    mySimon.bPush("green");
  });
  $(".blue").mousedown(function() {
    event.preventDefault();
    mySimon.bPush("blue");
  });
  $(".yellow").mousedown(function() {
    event.preventDefault();
    mySimon.bPush("yellow");
  });

  $(document).mouseup(function() {
    $("."+currentButton).css("backgroundColor", currentButton);
  });
});