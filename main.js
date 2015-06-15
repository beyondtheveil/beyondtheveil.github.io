//
//Heya! This is my first javascript thing, so the code might be horrible!
//variables
var game = {
	version: 0.1,
	playerlvl:1,
	exp:50,
	skillpts:1,
    health:100,
	maxhealth:100,
    attack:20,
	defence:1,
    mana:100,
	maxmana:100,
	gold:0,
	state:0, //0 = rest, 1 = fight
	
	loot: {
	1:{name:"rubies",amt:0,},
	2:{name:"sapphires",amt:0},
	3:{name:"emeralds",amt:0},
	4:{name:"diamonds",amt:0},
	},
	tempattack:0,
//dungeon vars
	dungeonlvl:1,
	currdungeon:-1,
	
	skill: { //inc = effect per level (percentage?)
	1:{name:"Acrobatics",amt:0,inc:1,max:5},
	2:{name:"Haggling",amt:0,inc:1,max:10}, //not impl
	3:{name:"Survival",amt:0,inc:2,max:10}, //aka natural regen
	4:{name:"Autopsy",amt:0,inc:10,max:5}, //aka loot drop
	5:{name:"Smithing",amt:0,inc:1,max:10}, //not impl
	6:{name:"Magic",amt:0,inc:1,max:10}, //not impl
	7:{name:"Boozing",amt:0,inc:1,max:10}, //not impl
	8:{name:"Mapping",amt:0,inc:1,max:5}, //aka defeats til next lvl
	9:{name:"Backstab",amt:0,inc:2,max:10}, //aka crithit!
	10:{name:"Reading",amt:0,inc:1,max:10}, //aka exp
	},
	maxdungeon: {
	grassland:1,
	forest:1,
	mountain:1,
	desert:1,
	volcano:1,
	ocean:1,
	},
//weapon vars
	weapon: {
		type:null,
		name:"",
		stat1value:0,
		stat2type:null,
		stat2value:null,
		statname:"",
	},
	helm:{
		type:null,
		name:"",
		stat1value:null,
		stat2type:null,
		stat2value:null,
		statname:"",	
	},
	amulet:{
		type:null,
		name:"",
		stat1value:null,
		stat2type:null,
		stat2value:null,
		statname:"",	
	},
	cost: {
	1:{name:"HP",amt:100,},
	2:{name:"Mana",amt:100},
	3:{name:"Attack",amt:100},
	4:{name:"Defence",amt:100},
	}
}
//vars outside game{}, i.e. not saved.
var statuses = {
	rage:-1,
	regen:-1,
	weakened:-1,
	poisoned:-1,
}
var logbook = [];

var defeated = 0;
var playerdamage=0;
statusorder=[];
var ragecooldown = 0;
var enemycooldown = 0;
var weakenedamt = 0;
var	critdambase = 2;
	
//static vars used like a database (just easier to reference and/or change!)
var useables = {
	regen:50,
	poison:30,
	test:10,
}

var dungeon = {
	//monster: 1:human 2:mammal, 3:bird, 4:reptile, 5:demon, 6:marine
	//loot: 1:ruby 2:sapphire 3:emerald 4:diamond
	grassland: {
		monsterbias:1,
		lootbias:0,
		special:0,
	},
	forest: {
		monsterbias:2,
		lootbias:0,
		special:0,
	},
	mountain: {
		monsterbias:3,
		lootbias:0,
		special:0,
	},
	desert: {
		monsterbias:4,
		lootbias:0,
		special:0,
	},
	volcano: {
		monsterbias:5,
		lootbias:0,
		special:0,
	},
	ocean: {
		monsterbias:6,
		lootbias:0,
		special:0,
	}
}
var enemydb = { // drop bias (use modulo? to fit type and frequency? and num/10 floor?)
//drop bias: 10=ruby,20=sapphire,30=emerald,40=diamonds
1: {type:"Human",
	attack:1,
	defence:1.2,
	maxhealth:0.8,
	goldmax:1,
	dropchance:1,
	dropbias:0,
	specialbias:0
	},
2: {type:"Mammal",
	attack:1,
	defence:1,
	maxhealth:1.2,
	goldmax:0.8,
	dropchance:1,
	dropbias:0,
	specialbias:0
	},
3: {type:"Bird",
	attack:0.8,
	defence:1,
	maxhealth:1,
	goldmax:1,
	dropchance:1.2,
	dropbias:0,
	specialbias:0
	},
4: {type:"Reptile",
	attack:1,
	defence:1,
	maxhealth:1,
	goldmax:1.2,
	dropchance:0.8,
	dropbias:0,
	specialbias:0
	},
5: {type:"Demon",
	attack:1.2,
	defence:0.8,
	maxhealth:1,
	goldmax:1,
	dropchance:1,
	dropbias:0,
	specialbias:0
	},
6: {type:"Marine",
	attack:1,
	defence:1,
	maxhealth:1,
	goldmax:1,
	dropchance:0.8,
	dropbias:0,
	specialbias:0
	},	

}
var specialatk = {
	1:{
	name:"Weaken",
	inflicts:"weakened",
	turns:5,
	color:"#933",
	},
	2: {
	name:"Poisonous",
	inflicts:"poisoned",
	turns:5,
	color:"#393",
	},

}
//THE SEA OF FUNCTIONS
//misc
function weightedrandom(lean,resultmin,resultmax,weighting){
//e.g. 6,1,10,1.5 - +50% chance of 6, can be 1-10;
// weightedrandom(6,1,10,10)
var elems = [];
for(i=resultmin;i<resultmax+1;i++){elems.push(i);}
var weights = [];
for(i=resultmin;i<resultmax+1;i++){
	if(i==lean){weights.push(weighting);
	} else{weights.push(1);}
}

totalWeight = weights.reduce( function(total, num){ return total + num }, 0);
var weighedElems = [];
var currentElem = 0;
while (currentElem < elems.length) {
  for (i = 0; i < weights[currentElem]; i++)
    weighedElems[weighedElems.length] = elems[currentElem];
  currentElem++; 
}
var rnd = Math.floor(Math.random() * totalWeight);
return weighedElems[rnd];
}
function changestate(number){ // i.e what panel to use.
	var hide = document.querySelectorAll(".panel");
	defeated = 0;
	for (var i = 0; i < hide.length; i++) {
		hide[i].style.display="none";
	}	
	
	if (number == 0){
		game.state = 0;
		enemy.health = 0;
		updateenemybar(0);
		enemycooldown=0;
		if(game.currdungeon==-1 || game.currdungeon==null){document.getElementById("mappanel").style.display="block";}
		else{changemap(game.currdungeon)}
	} 
	if (number == 1){
		game.state = 1;
		document.getElementById("enemy").style.display="block";
		document.getElementById("enemypanel").style.display="block";
	}
	if (number == 3){
		game.state = 3;
		document.getElementById("craftingpanel").style.display="block";
		document.getElementById("userubies").max = game.loot[1].amt;
		document.getElementById("usesapphires").max = game.loot[2].amt;
		document.getElementById("useemeralds").max = game.loot[3].amt;
		document.getElementById("usediamonds").max = game.loot[4].amt;
	}
	if (number == 4){
			game.state = 4;
			document.getElementById("shoppanel").style.display="block";
			
			var shoproll = [];

			for(var i=1;i<Object.keys(game.cost).length;i++){
				shoproll += "<label>" + game.cost[i].name + "</label>";
				if(game.gold<game.cost[i].amt){
					disable = "disabled";
					} else {disable = ""};
				var itemname = "'"+game.cost[i].name+"'";
				shoproll += "<input type=\"button\" value=\""+ game.cost[i].amt +"\" onClick=\"buyuseable("+itemname+","+game.cost[i].amt+")\""+ disable +" id=\"cost"+i+"\"/><br />";				

			}
			/*			for (var index in useables) { //organising shop chart
				shoproll += "<label>" + index + "</label>";
				if(game.gold<useables[index]){
					disable = "disabled";
					} else {disable = ""};
				shoproll += "<input type=\"button\" value=\""+ useables[index] +"\" onClick=\"buyuseable("+index+","+useables[index]+")\""+ disable +" /><br />";

			}
			*/
			
			document.getElementById("shop").innerHTML = shoproll; 
			
		}
	if (number == 5){ //skills
		game.state = 5;
		document.getElementById("skillpanel").style.display="block";
		displayinfo("skillpts");
		var skill_list = Object.keys(game.skill).length; //how many skills I've put in.
		
		
			var notdis = document.getElementsByClassName("skillbtn");
				for(var i = 1; i < notdis.length; i++) {
					notdis[i].disabled = false;
					
					var btnname = "skill" + i;
					var btntext = game.skill[i].name + "("+game.skill[i].amt+")";
					document.getElementById(btnname).value = btntext;
				}
		for(i = 1; i < skill_list; i++) { //disable skill btns if at max or no skillpts
			if(game.skill[i].amt==game.skill[i].max){
				var btnname = "skill" + i;
				document.getElementById(btnname).disabled = true;
				
			} else if(game.skillpts<=0){
				var disa = document.getElementsByClassName("skillbtn");
				for(var i = 0; i < disa.length; i++) {
					disa[i].disabled = true;
					
				}
			}
			}
	}
	
	if (number == 6){ //stats
			game.state = 6;	
			document.getElementById("statspanel").style.display="block";
			showstats();
	}
	
	if(number !=1){document.getElementById("sparkbtn").disabled = true;}	
	
}
function pushtolog(text,type){
	//create timestamp
	d = new Date();
	if (d.getMinutes() < 10){
		time = d.getHours() + ".0" + d.getMinutes();
	} else {
		time = d.getHours() + "." + d.getMinutes();
	}
	if(type==0){textcolor = "#66FF66;font-weight: bold";
	} else if(type==1){textcolor = "#FF6666;font-weight: bold";
	} else{textcolor = "white";}
	//push text, check logbook length, join array without commas
	logbook.unshift("<br /><span style=\"color:"+textcolor+";\">"+time+"  "+ text + "</span>");
	if(logbook.length > 10){
	logbook.pop();
	}
	logtext = logbook.join("");
	document.getElementById("logbook").innerHTML = logtext;
}

function backtomap(){ //from fighting, to map...
game.currdungeon=-1;
changestate(0);
}
//health and mana bars / display stuff
function updatehealthbar(howmuch){
	game.health += howmuch;
	if(game.health>game.maxhealth){game.health=game.maxhealth}
	bar = Math.floor(game.health/game.maxhealth*100);
	document.getElementById("healthbar").style.width=bar+"%";
	document.getElementById("health").innerHTML = game.health+"/";
	document.getElementById("maxhealth").innerHTML = game.maxhealth;
}
function updatemanabar(howmuch){
	game.mana += howmuch;
	if(game.mana>game.maxmana){game.mana=game.maxmana}
	bar = Math.floor(game.mana/game.maxmana*100);
	document.getElementById("manabar").style.width=bar+"%";
	document.getElementById("mana").innerHTML = game.mana +"/";
	document.getElementById("maxmana").innerHTML = game.maxmana;
}
function updateenemybar(howmuch){
	enemy.health += howmuch;
	if(enemy.health<0){enemy.health=0}
	bar = Math.floor(enemy.health/enemy.maxhealth*100);
	document.getElementById("enemybar").style.width=bar+"%";
	document.getElementById("enemyhealth").innerHTML = enemy.health +"/";
	document.getElementById("enemymaxhealth").innerHTML = enemy.maxhealth;
}
function updateattack(){
	playerdamage = 0;
	//crit stuff
	calccrit();
	
	document.getElementById("attack").innerHTML = playerdamage;
	if(Math.floor(Math.random()*100 +1) <= critchance){ //if crit hit!
		playerdamage = Math.floor(playerdamage*critdam);
		document.getElementById("attack").innerHTML = "<span style=\"color:3b3\">"+playerdamage+"!</span>";		
		if(game.weapon.stat2type==8){
		updatehealthbar(Math.floor(game.weapon.stat2value));
		}
		
	}	
}
function showstats(){ 
	//crit dam etc. Affected by skills and weapon
	calccrit();
	critchance = critchance+"%";
	critdam = critdam*100 + "%";
	document.getElementById("critchance").innerHTML = critchance;
	document.getElementById("critdam").innerHTML = critdam;	
	console.log(critchance);
	console.log(critdam);
	
}
function calccrit(){
	critchance = 10+ game.skill[9].amt * game.skill[9].inc;
	playerdamage += game.attack + game.tempattack + parseInt(game.weapon.stat1value);
	playerdamage -= weakenedamt;
	critdam = critdambase;

	if(game.weapon.stat2type == 15){
		critdam = critdambase + (Math.floor(game.weapon.stat2value)/100);
	}
	if(game.weapon.stat2type == 5){
		critchance = critchance + (Math.floor(game.weapon.stat2value));
	}
}

//status effects
function generatestatus(type,time){
	if(statuses[type]>0){ //if it already exists, reapply it but dont do other stuff.
		statuses[type] = time;
		return;
	}
	if(type=="rage"){
		document.getElementById("ragebtn").disabled = true;
		game.tempattack = 10;
		document.getElementById("attack").innerHTML = game.attack + game.tempattack;
		document.getElementById("attack").style.color = '#0b0';
		ragecooldown=10;
	}
	if(type=="regen"){
		if(game.mana < 50){
		pushtolog("Failed to cast spell: not enough mana",1);
		return;
		}
		updatemanabar(-50);
		document.getElementById("regenbtn").disabled = true;
	}
	if(type=="weakened"){
		weakenedamt += enemy.scale * 5;
		document.getElementById("attack").style.color = '#f00';
	}
	
	if(statuses[type] == -1){ //does status not already exist? Placement.
	addquotes = ""+type+"";
	statusorder.push(addquotes);
	statusplace = statusorder.indexOf(type);
	statusplace2 = statusplace * 100;
	}
	
	statuses[type] = time;
	printspan = "<div class=\"statuswidth\"><span class=\"status\" id=\""+type+"\" style=\"display:inline-block;\">"+type+":</span><span class=\"statustime\" id=\""+type+"time\"\">"+time+"</span></div>";	
	document.getElementById("statusbook").innerHTML += printspan;
}
function removestatus(type){
	var wherespan1 = document.getElementById("statusbook").childNodes.length; //remove spans
	var where = statusorder.indexOf(type);
	var where2 = where+1;
	statusbook.removeChild(statusbook.childNodes[where2]);
	statuses[type] = -1
	statusorder.splice(where,1); //remove from statusorder
}
function regenhp(amt){
	if(game.health < game.maxhealth){
		game.health = game.health + amt;
		document.getElementById("health").innerHTML = game.health;
	}
}	
//enemy stuff
function generateenemy(){
	enemy = {
	type:null,
	name:"",
	rarity:1,
	scale:null,
	health:null,
	maxhealth:100,
	attack:1,
	defence:1,
	special:0,
	goldmin:1,
	goldmax:5,
	}
	enemy.scale = game.dungeonlvl;
	dungeoncurr = game.currdungeon;
	enemy.type = weightedrandom(dungeon[dungeoncurr].monsterbias,1,6,4); //monster bias from area
	enemy.attack = Math.floor((enemy.attack * enemy.scale)* (enemydb[enemy.type].attack));
	enemy.maxhealth = Math.floor((enemy.maxhealth * enemy.scale)* (enemydb[enemy.type].maxhealth));
	enemy.defence = Math.floor((enemy.defence * enemy.scale)* (enemydb[enemy.type].defence));
	enemy.health = enemy.maxhealth;
	enemy.goldmax = Math.floor((enemy.goldmax * enemy.scale)* (enemydb[enemy.type].goldmax));	
	enemy.goldmin = Math.floor(enemy.goldmax/2);
	enemy.rarity = weightedrandom(1,1,3,5);
	enemy.name = flavortext(enemyadj) +" "+  flavortext(eval(enemydb[enemy.type].type.concat("s")));
	enemy.special = Math.floor(Math.random()+0.5); //note number of specials. Will later want to weight.
	updatehealthbar(0);updatemanabar(0);updateenemybar(0);
	rarecolor = "<span>";
	rarecolor2 = "</span>";
	//if(enemy.rarity==2){rarecolor = "<span class=\"uncommon\">";}
	//if(enemy.rarity==3){rarecolor = "<span class=\"rare\">";}
	document.getElementById("enemyname").innerHTML = rarecolor + enemy.name + rarecolor2;
	document.getElementById("enemyatk").innerHTML = "<label>Attack: </label>"+enemy.attack;
	//document.getElementById("enemydef").innerHTML = "<label>Defence: </label>"+enemy.defence;
	document.getElementById("enemytype").innerHTML = "<label>Type: </label>"+ (enemydb[enemy.type].type);	
	enemyspecial(enemy.special);
}
function enemyspecial(num){
	if(enemy.special != 0){
	document.getElementById("enemyspecial").innerHTML = "<label style=\"color:"+specialatk[enemy.special].color+"\"> "+specialatk[enemy.special].name+"</label>";
	}
	if(enemy.special == 1){
		generatestatus(specialatk[enemy.special].inflicts,specialatk[enemy.special].turns)
	}
//enemy special att
	if(enemy.special == 0){		
		document.getElementById("attack").style.color = '#000';
		document.getElementById("enemyspecial").innerHTML = "";
	}
}
//dungeon stuff
function changemap(type){
 game.currdungeon= type;
 game.dungeonlvl = game.maxdungeon[game.currdungeon];
 changestate(1);
 document.getElementById("maxdungeonlvl").innerHTML = game.maxdungeon[game.currdungeon];
 displayinfo("dungeonlvl");
 document.getElementById("setting").innerHTML = game.currdungeon;
 document.getElementById("sparkbtn").disabled = false;		
}
function nextdungeon(last){
	if(game.dungeonlvl<game.maxdungeon[game.currdungeon]){
		if(typeof last=== 'undefined'){game.dungeonlvl += 1;}
		else{game.dungeonlvl = game.maxdungeon[game.currdungeon];}
			defeated = 0;
			document.getElementById("dungeonlvl").innerHTML = game.dungeonlvl;
			document.getElementById("previousdungeon").disabled = false;
			enemy.health = 0;
			enemycooldown = 5;
			game.state = 0;
			if(game.dungeonlvl==game.maxdungeon[game.currdungeon]){document.getElementById("nextdungeon").disabled = true;}
	}
}
function prevdungeon(first){
	if(game.dungeonlvl >1){
		if(typeof first=== 'undefined'){game.dungeonlvl -= 1;}
		else{game.dungeonlvl = 1;}
		defeated = 0;
		enemy.health = 0;
		updateenemybar(0);
		enemycooldown = 5;
		game.state = 0;
		document.getElementById("dungeonlvl").innerHTML = game.dungeonlvl;
		document.getElementById("nextdungeon").disabled = false;
	}	
	if(game.dungeonlvl==1){document.getElementById("previousdungeon").disabled = true;		}

}

//generate crafted items
function craft(){

	var craftr = {name:"rubies",amt:document.getElementById("userubies").value};
	var crafts = {name:"sapphires",amt:document.getElementById("usesapphires").value};
	var crafte = {name:"emeralds",amt:document.getElementById("useemeralds").value};
	var craftd = {name:"diamonds",amt:document.getElementById("usediamonds").value};
	
	if (craftr.amt<=0 && crafts.amt<=0 && crafte.amt<=0 && craftd.amt<=0){
	pushtolog("Crafting error. No gems used.",1);
	return;
	}
	if (craftr.amt>game.loot[1].amt || crafts.amt>game.loot[2].amt || crafte.amt>game.loot[3].amt || craftd.amt>game.loot[4].amt){
	pushtolog("Crafting error. No gems used.",1);
	return;
	}
	
	game.loot[1].amt -= craftr.amt;
	game.loot[2].amt -= crafts.amt;
	game.loot[3].amt -= crafte.amt;
	game.loot[4].amt -= craftd.amt;
	
	gemarray = [craftr,crafts,crafte,craftd];
	gemarray.sort(function(x, y) { return y.amt - x.amt; });
	console.log(gemarray);

	game.weapon.stat1value = gemarray[0].amt;

	if(gemarray[0].amt==gemarray[1].amt){ //if at least two amounts match
		if(gemarray[0].amt==gemarray[2].amt){ //if three match
			if(gemarray[0].amt==gemarray[3].amt){ //if all match! else if 3 match
			game.weapon.stat2type = 1;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/4);
			game.weapon.statname = "drop bonus";
			} else if(gemarray[3].name=="diamonds"){ // i.e. r/s/e
			game.weapon.stat2type = 2;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "buffing";				
			} else if(gemarray[3].name=="rubies"){
			game.weapon.stat2type = 3;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "rarity";				
			} else if(gemarray[3].name=="sapphires"){
			game.weapon.stat2type = 4;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "leeching";			
			} else if(gemarray[3].name=="emeralds"){
			game.weapon.stat2type = 5;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/10);
			game.weapon.statname = "crit chance";			
			}
		} else if( (gemarray[0].name=="rubies" || gemarray[1].name=="rubies") && (gemarray[0].name=="sapphires" || gemarray[1].name=="sapphires") ){
			game.weapon.stat2type = 6;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "mana regen";			
		}  else if( (gemarray[0].name=="rubies" || gemarray[1].name=="rubies") && (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") ){
			game.weapon.stat2type = 7;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "life on kill";			
		}  else if( (gemarray[0].name=="rubies" || gemarray[1].name=="rubies") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 8;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "life on crit";			
		}  else if( (gemarray[0].name=="sapphires" || gemarray[1].name=="sapphires") && (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") ){
			game.weapon.stat2type = 9;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*2);
			game.weapon.statname = "exp";			
		}  else if( (gemarray[0].name=="sapphires" || gemarray[1].name=="sapphires") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 10;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "cooldown";			
		}	else if( (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 11;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "ignore defence";
		}
	} else if(gemarray[0].name=="rubies"){
			game.weapon.stat2type = 12;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "max HP";			
	} else if(gemarray[0].name=="sapphires"){
			game.weapon.stat2type = 13;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "max MP";			
	} else if(gemarray[0].name=="emeralds"){
			game.weapon.stat2type = 14;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "gold bonus";			
	} else if(gemarray[0].name=="diamonds"){
			game.weapon.stat2type = 15;
			game.weapon.stat2value = Math.floor(gemarray[0].amt);
			game.weapon.statname = "Crit Dam";
	}

	game.weapon.name = "sword";
	document.getElementById("weapon").innerHTML = "+"+ game.weapon.stat1value +" weapon of " + game.weapon.stat2value +"% "+ game.weapon.statname;

	document.getElementById("userubies").value = 0;
	document.getElementById("usesapphires").value = 0;
	document.getElementById("useemeralds").value = 0;
	document.getElementById("usediamonds").value = 0;
	
	document.getElementById("rubies").innerHTML = game.loot[1].amt;
	document.getElementById("sapphires").innerHTML = game.loot[2].amt;
	document.getElementById("emeralds").innerHTML = game.loot[3].amt;
	document.getElementById("diamonds").innerHTML = game.loot[4].amt;
	updateattack();
	
}
//skills and shop
function buyskill(num){
game.skill[num].amt += 1;
game.skillpts -= 1;
var btnname = "skill" + num;
var btntext = game.skill[num].name + "("+game.skill[num].amt+")";
document.getElementById(btnname).value = btntext;
if(game.skill[num].amt==game.skill[num].max){
pushtolog("You have reached the max level for this skill");
document.getElementById(btnname).disabled = true;
}
if(game.skillpts<=0){
	var disa = document.getElementsByClassName("skillbtn");
	for(var i = 0; i < disa.length; i++) {
		disa[i].disabled = true;
	}
}
displayinfo("skillpts");
}
function buyuseable(type,cost){
	game.gold -= cost;
	displayinfo("gold");
	
	//if(type==regen){
	//statuses.regen = 15;
	// }
	if(type=="HP"){
	console.log("h");
	game.maxhealth += 10;
	game.cost[1].amt+=1;
	updatehealthbar(0);
	}
	if(type=="Mana"){
	console.log("m");
	game.maxmana += 20;
	game.cost[2].amt+=1;
	updatemanabar(0);
	}
	if(type=="Attack"){
	console.log("a");
	game.attack += 5;
	game.cost[3].amt+=1;
	updateattack();
	}
	if(type=="Defence"){
	console.log("d");
	game.attack += 20;
	game.cost[4].amt+=1;
	displayinfo("defence");
	}

	//update shop pricing and disabling etc.
	for(var i=1;i<Object.keys(game.cost).length;i++){
	document.getElementById("cost"+i).value = game.cost[i].amt;
	var itemname = "'"+game.cost[i].name+"'";
	document.getElementById("cost"+i).onClick = "\"buyuseable("+itemname+","+game.cost[i].amt+")";
		if(game.gold<game.cost[i].amt){
			document.getElementById("cost"+i).disabled = true;
			}
	}
}

//spells
function spark(){
	if(game.mana >=10){
	updateenemybar(-10);
    updatemanabar(-10);
	}
};

//monster phat lewt
function loot(goldmin,goldmax,bias){
	defeated += 1;
	//gold
	var gainedgold = Math.floor(Math.random() * (goldmax - goldmin + 1)) + goldmin;
	if(game.weapon.stat2type == 14){
		bonusgold = Math.floor(gainedgold * (1 + game.weapon.stat2value/100));
		gainedgold = bonusgold;
	}
	game.gold += gainedgold;
	document.getElementById("gold").innerHTML = game.gold; 
	//rubies / items
	var drophappens = Math.floor(Math.random()*100 +1);
	drophappens += game.skill[4].amt + game.skill[4].inc;
	if(drophappens>=90){ //50% chance of drop
		if(dungeon[game.currdungeon].lootbias>0){ //if there is a bias via dungeon
		var whatdrops = weightedrandom(dungeon[game.currdungeon].lootbias>0,1,4,2);
		} else {
		whatdrops = Math.floor(Math.random() * 4) + 1;
		}
		var howmuch = Math.floor(Math.random()*game.dungeonlvl+1);
		var orig = game.loot[whatdrops].amt;
		game.loot[whatdrops].amt+=howmuch
		var diff = game.loot[whatdrops].amt - orig;
	}
	document.getElementById("rubies").innerHTML = game.loot[1].amt;
	document.getElementById("sapphires").innerHTML = game.loot[2].amt;
	document.getElementById("emeralds").innerHTML = game.loot[3].amt;
	document.getElementById("diamonds").innerHTML = game.loot[4].amt;
	
	//exp gain
	expgain = game.dungeonlvl;
	if(game.weapon.stat2type==9){
		expgain = Math.floor(expgain * (1 + game.weapon.stat2value/100));
	}
	game.exp -= expgain;
	if(game.exp<=0){ //if you gain a level + exp calc
		pushtolog("You gained a level!",0);
		game.playerlvl += 1;
		game.skillpts += 1;
		game.exp = game.playerlvl + Math.floor(Math.pow(game.playerlvl/0.1,2));
		updatehealthbar(0);
		updatemanabar(0);
		displayinfo("playerlvl");
		displayinfo("skillpts");
	}
	displayinfo("exp");	
	//change enemy view
	document.getElementById("enemyname").innerHTML = "";
	document.getElementById("enemyatk").innerHTML = "";
	document.getElementById("enemyspecial").innerHTML = "";
	document.getElementById("enemytype").innerHTML = "";
	//log details
	if(gainedgold>0){loggold = " | <span class=\"gold\">Gold: " + gainedgold+"</span>"}else{loggold=""};
	//what loot dropped (if any)
	if(drophappens>90){
		var logloot = "|<span class=\""+game.loot[whatdrops].name+"\"> "+game.loot[whatdrops].name+": " + diff+"</span>";
	}else{
		var logloot = "";
	}
	if(expgain>0){logexp = " | Exp: " + expgain}else{logexp=""};
	rarecolor = "<span>"; //enemy rare color
	rarecolor2 = "</span>";
	if(enemy.rarity==2){rarecolor = "<span class=\"uncommon\">";}
	if(enemy.rarity==3){rarecolor = "<span class=\"rare\">";}
	pushtolog("You killed: " + rarecolor+enemy.name+rarecolor2 + logexp + loggold + logloot);
	
	//hp after kill
	if(game.weapon.stat2type==7){
	updatehealthbar(Math.floor(game.weapon.stat2value));
	}
}
//each second
window.setInterval(function(){
	//statuses
	if(statuses.regen>0){
		statuses.regen -= 1;
		document.getElementById("regentime").innerHTML = statuses.regen;
		regenhp(4);

	} else if(statuses.regen==0){
		document.getElementById("regenbtn").disabled = false;
		//where = statusorder.indexOf("Regen");
		//statusorder.splice(where,1);	
		removestatus("regen");
	}
	if(statuses.rage>0){
		document.getElementById("ragetime").innerHTML = statuses.rage;
		statuses.rage -= 1;
	} else if(statuses.rage==0){
		game.tempattack = 0;
		document.getElementById("attack").style.color = '#000';
		updateattack();
		removestatus("rage");
	}
	if(statuses.weakened>0){
		document.getElementById("weakenedtime").innerHTML = statuses.weakened;
		statuses.weakened -=1;
	} else if(statuses.weakened==0){
		weakenedamt = 0;
		document.getElementById("attack").style.color = '#000';
		updateattack();
		removestatus("weakened");
	}

	if(ragecooldown>=1){ragecooldown -= 1;}
	if(ragecooldown<=0){
		document.getElementById("ragebtn").disabled = false;
		ragecooldown=0;
	}
	//if fighting
	if(game.currdungeon != null && enemycooldown<=0 && game.state==1){
		if(enemy.health == null || enemy.health == undefined || enemy.health == 0){ //if no enemy
			
			generateenemy();
		}	
		//attacking, checking buttons etc
		updateattack();
		updateenemybar(-playerdamage);
		updatehealthbar(-enemy.attack);

		//have you died?
		if(game.health <= 0){
		game.currdungeon = null;
		changestate(0);
		game.gold = Math.floor(game.gold/2);
		displayinfo("gold");
		pushtolog("Oh joy, youre dead. You lose 50% of gold",1);
		}
	}
	if(game.dungeonlvl > 1){document.getElementById("previousdungeon").disabled = false;		
	}else{document.getElementById("previousdungeon").disabled = true;
	}
	if(game.dungeonlvl<game.maxdungeon[game.currdungeon]){document.getElementById("nextdungeon").disabled = false;	
	}else{document.getElementById("nextdungeon").disabled = true;
	}
	
	if(enemy.health <= 0 && game.state == 1){ //if enemy is dead - rewards, plus cooldown
			if(enemycooldown==0){
			loot(enemy.goldmin,enemy.goldmax,enemy.type);
			enemycooldown= 6 - (game.skill[1].amt * game.skill[1].inc);
			randomtext = flavortext(killedenemy);
			}
			enemycooldown -= 1;
			updatehealthbar(1);
			document.getElementById("defeated").innerHTML = defeated + randomtext +"! Another enemy in " + enemycooldown;
			if(game.dungeonlvl==game.maxdungeon[game.currdungeon] && defeated== 10 - game.skill[8].amt * game.skill[8].inc){ //can you go to next dungeon level?
				game.maxdungeon[game.currdungeon] += 1;
				document.getElementById("maxdungeonlvl").innerHTML = game.maxdungeon[game.currdungeon];
				document.getElementById("nextdungeon").disabled = false;
			}
		}else{
		document.getElementById("defeated").innerHTML = "";
		}
		
	if(game.state == 0){ //if resting
		updatehealthbar(1);
			if(enemycooldown>0){ //aka moving dungeon level
				document.getElementById("defeated").innerHTML = "Searching for enemies... " + enemycooldown;
				enemycooldown -= 1;
				if(enemycooldown==0){
				changestate(1);	
				}
			}
	}

	if(game.state!=1){updatehealthbar(2);}
	updatemanabar(1);
	if(game.weapon.stat2type==6){
	updatemanabar(Math.floor(game.weapon.stat2value));
	}
	updatehealthbar(game.skill[3].amt * game.skill[3].inc);
	document.getElementById("setting").innerHTML = game.currdungeon;
}, 500);

//each minute - do something with random events here? Or every five mins?
window.setInterval(function(){
manualsave();
}, 60000); 

function displayinfo(name){
document.getElementById( name ).innerHTML = game[name];
}
//save
function manualsave(){
	window.localStorage['game'] = JSON.stringify(game);
}

//if first load

loadfirst();
function loadfirst(){ //all the visual details.
	displayinfo("playerlvl");
	displayinfo("exp");
	displayinfo("skillpts");
	updatehealthbar(0);
	updatemanabar(0);
	
	updateattack();
	displayinfo("gold");
	document.getElementById("rubies").innerHTML = game.loot[1].amt;
	document.getElementById("sapphires").innerHTML = game.loot[2].amt;
	document.getElementById("emeralds").innerHTML = game.loot[3].amt;
	document.getElementById("diamonds").innerHTML = game.loot[4].amt;
	displayinfo("dungeonlvl");
	displayinfo("version");
	
	if(game.weapon.stat1value!=0){
	document.getElementById("weapon").innerHTML = "+"+ game.weapon.stat1value +" weapon of " + game.weapon.stat2value +"% "+ game.weapon.statname;
	}
}

function loadGame(){
	window.loadgame = JSON.parse(window.localStorage['game']);
	if(loadgame != null){
		game = loadgame;
		game.state = 0;
	}	
	loadfirst();
	//displayinfo("maxdungeonlvl");
}

//delete save
function deletesave(){
localStorage.removeItem("game");
};

function flavortext(type){
var flavor = type;
var whichone = Math.floor(Math.random() * flavor.length);
var flavtext = type[whichone];
return flavtext;
}
//flavor text arrays
var killedenemy = [" enemies annihilated"," enemies turned to dust"," enemies sent beyond the veil"," enemies counting worms"," enemies meet their maker"," enemies sleeping with the fishes"," enemies slaughtered"];
var enemyadj = ["Angry","Furious","Hungry","Arrogant","Cruel","Greedy","Cunning","Nasty","Haughty","Vain","Sarcastic","Vicious","Dishonest"];
var Humans = ["Bandit","Lord","Cultist","Thief","Murderer","Minion","Banker","Spammer"];
var Mammals = ["Lion","Baboon","Lemur","Wolf","Fox","Bear","Stag","Rabbit","Sloth","Alpaca","Marmoset","Cow","Sphinx","Giant Rat"];
var Birds = ["Hawk","Goose","Bat","Eagle","Cockatrice","Owl","Phoenix","Puffin",];
var Reptiles = ["Basilisk","Chameleon","Alligator","Iguana","Lizard","Rattlesnake","Python"];
var Demons = ["Succubus","Incubus","Fallen Angel","Imp","Goatman","Shadow","Banshee","Demonic cow","Hell Rabbit"];
var Marines = ["Cone Snail","Seal","Otter","Manatee","Polar Bear","Walrus","Dolphin","Shark","Hagfish","Octopus","Platypus","Crab","Lobster","Siren"];
//yes, I know a platypus is a mammal.