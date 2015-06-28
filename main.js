//
//Heya! This is my first javascript thing, so the code might be horrible!
//save object
var game = {
	version: 0.11,
	playerlvl:1,
	exp:20,
	skillpts:1,
    health:1000,
	maxhealth:1000,
    attack:20,
	defence:1,
    mana:1000,
	maxmana:1000,
	gold:0,
	state:0, //0 = rest, 1 = fight
	loot: {
	1:{name:"rubies",amt:0,},
	2:{name:"sapphires",amt:0},
	3:{name:"emeralds",amt:0},
	4:{name:"diamonds",amt:0},
	},
	tempattack:0,
	rage: {
	unlock:0,
	attune: 0,
	},
	//dungeon vars
	dungeonlvl:1,
	currdungeon:-1,
	skill: { //see skill name.
	1:0,
	2:0, //not impl
	3:0, //aka natural regen
	4:0, //aka loot drop
	5:0, //not impl
	6:0, //aka spell effect
	7:0, //not impl
	8:0, //aka defeats til next lvl
	9:0, //aka crithit!
	10:0, //aka exp
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
		sign:0,
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
	item: { //stuff bought in shop that has permanent effect. see var shop.
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
	},
	stats: {
		kills: 0,
		gemsused:0,
	}
}

//statics vars/objects/etc that I may want to change later
var skilldata = {
name: ["nullz","Acrobatics","Haggling","Survival","Autopsy","Smithing","Magic","Boozing","Mapping","Backstab","Reading"],
inc: ["nulla",1,1,2,5,1,50,1,1,5,50],
max: ["nullb",5,10,10,5,10,10,10,5,5,10],
};
var shop = { //shop item data
item: ["+100 HP","+200 Mana","+5 Attack","Forest Map","Mountain Map","Desert Map","Volcano Map","Ocean Map","Musk Potion","Inspiration Potion"],
price: [100,100,100,200,200,400,400,500,50,50],
inc: [5,5,5,0,0,0,0,0,0,0],
repeat: [1,1,1,0,0,0,0,0,1,1],
}

//flavor text arrays
var flav = {
killedenemy: [" enemies annihilated"," enemies turned to dust"," enemies sent beyond the veil"," enemies counting worms"," enemies meet their maker"," enemies sleeping with the fishes"," enemies slaughtered"],
enemyadj: ["Angry","Furious","Hungry","Arrogant","Cruel","Greedy","Cunning","Nasty","Haughty","Vain","Sarcastic","Vicious","Dishonest"],
Humans: ["Bandit","Lord","Cultist","Thief","Murderer","Minion","Banker","Spammer"],
Mammals: ["Lion","Baboon","Lemur","Wolf","Fox","Bear","Stag","Rabbit","Sloth","Alpaca","Marmoset","Cow","Sphinx","Giant Rat"],
Birds: ["Hawk","Goose","Bat","Eagle","Cockatrice","Owl","Phoenix","Puffin",],
Reptiles: ["Basilisk","Chameleon","Alligator","Iguana","Lizard","Rattlesnake","Python"],
Demons: ["Succubus","Incubus","Fallen Angel","Imp","Goatman","Shadow","Banshee","Demonic cow","Hell Rabbit"],
Marines: ["Cone Snail","Seal","Otter","Manatee","Polar Bear","Walrus","Dolphin","Shark","Hagfish","Octopus","Platypus","Crab","Lobster","Siren"],
}
//yes, I know a platypus is a mammal.

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
		lootbias:3,
		special:0,
	},
	mountain: {
		monsterbias:3,
		lootbias:4,
		special:0,
	},
	desert: {
		monsterbias:4,
		lootbias:0,
		special:0,
	},
	volcano: {
		monsterbias:5,
		lootbias:1,
		special:0,
	},
	ocean: {
		monsterbias:6,
		lootbias:2,
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

var specialatk = [
["Weaken",2,5,"#933"],
]

/*var specialatk = {
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

}*/

//vars outside game{}, i.e. not saved.
var statuses = [
["regen",-1],
["weakened",-1],
["poisoned",-1],
["inspired",-1],
["smelly",-1]
]

var logbook = [];
var defeated = 0;
var playerdamage=0;
statusorder=[];
var enemycooldown = 0;
var weakenedamt = 0;
var	critdambase = 2;
var enemysearch = 3;
var rage = 500;
game.rage.attune=0;

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
	for (var i = 0; i < hide.length; i++) {
		hide[i].style.display="none";
	}	
	
	if (number == 0){
		game.state = 0;
		searchforenemy();
		if(game.currdungeon==-1 || game.currdungeon=="null"){
			document.getElementById("mappanel").style.display="block";
		}
		else{ changestate(1);document.getElementById("maxdungeonlvl").innerHTML = game.maxdungeon[game.currdungeon];}
	} 
	if (number == 1){ //fighting
		game.state = 1;
		document.getElementById("enemy").style.display="block";
		document.getElementById("enemypanel").style.display="block";
	}
	if (number == 3){ //crafting
		game.state = 3;
		document.getElementById("craftingpanel").style.display="block";
		document.getElementById("userubies").max = game.loot[1].amt;
		document.getElementById("usesapphires").max = game.loot[2].amt;
		document.getElementById("useemeralds").max = game.loot[3].amt;
		document.getElementById("usediamonds").max = game.loot[4].amt;
	}
	if (number == 4){ //shop
		game.state = 4;
		document.getElementById("shoppanel").style.display="block";	
		rollshop();		
	}
	if (number == 5){ //skills
		game.state = 5;
		document.getElementById("skillpanel").style.display="block";
		displayinfo("skillpts");
		var skill_list = Object.keys(game.skill).length; //how many skills I've put in.
		var notdis = document.getElementsByClassName("skillbtn");
		for(var i = 1; i <= notdis.length; i++) {
				if(i<10){notdis[i].disabled = false;}
				var btnname = "skill" + i;
				btntext = skilldata.name[i] + "("+game.skill[i]+")";
				document.getElementById(btnname).value = btntext;
				
			}
		for(i = 1; i <= notdis.length; i++) { //disable skill btns if at max or no skillpts
			if(game.skill[i]==skilldata.max[i]){
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
game.currdungeon="null";
defeated=0;
changestate(0);

}
//health and mana bars / display stuff
function updatehealthbar(howmuch){
	tempmaxhealth = game.maxhealth;
	if(game.weapon.stat2type==12){
		tempmaxhealth+= game.weapon.stat2value;
	}	

	game.health += Math.floor(howmuch);
	if(game.health>tempmaxhealth){game.health=tempmaxhealth}
	if(game.health<0){game.health=0};
	bar = Math.floor(game.health/tempmaxhealth*100);
	document.getElementById("healthbar").style.width=bar+"%";
	document.getElementById("health").innerHTML = game.health+"/";
	document.getElementById("maxhealth").innerHTML = tempmaxhealth;
}
function updatemanabar(howmuch){
	tempmaxmana = game.maxmana;
	if(game.weapon.stat2type==13){
		tempmaxmana+= game.weapon.stat2value;
	}		
	
	game.mana += howmuch;
	if(game.mana>tempmaxmana){game.mana=tempmaxmana}
	bar = Math.floor(game.mana/tempmaxmana*100);
	document.getElementById("manabar").style.width=bar+"%";
	document.getElementById("mana").innerHTML = game.mana +"/";
	document.getElementById("maxmana").innerHTML = tempmaxmana;
}
function updateenemybar(howmuch){
	enemy.health += howmuch;
	if(enemy.health<0){enemy.health=0}
	bar = Math.floor(enemy.health/enemy.maxhealth*100);
	document.getElementById("enemybar").style.width=bar+"%";
	document.getElementById("enemyhealth").innerHTML = enemy.health +"/";
	document.getElementById("enemymaxhealth").innerHTML = enemy.maxhealth;
}
function updateragebar(howmuch){

	if(game.weapon.stat2type==11 && howmuch>0){howmuch +=game.weapon.stat2value;}
	rage += howmuch;	
	if(rage<0){rage=0};
	if(rage>1000){rage=1000};
	bar = Math.floor(rage/10);
	document.getElementById("ragebar").style.height=bar+"%";
}
function updateattack(){
	playerdamage = 0;
	//crit and color stuff
	calccrit();
	if(playerdamage>game.attack + game.weapon.stat1value){
		document.getElementById("attack").style.color = '#0b0';
	}
	if(playerdamage<game.attack + game.weapon.stat1value){
		document.getElementById("attack").style.color = '#f00';	
	}
	if(playerdamage== game.attack + parseInt(game.weapon.stat1value)){
		document.getElementById("attack").style.color = '#000';	
	}
	
	document.getElementById("attack").innerHTML = playerdamage;
	if(Math.floor(Math.random()*100 +1) <= critchance){ //if crit hit!
		playerdamage = Math.floor(playerdamage*critdam);
		document.getElementById("attack").innerHTML = "<span style=\"color:3b3\">"+playerdamage+"!</span>";		
		if(game.weapon.stat2type==8){ // life on crit
			updatehealthbar(Math.floor(game.weapon.stat2value));
		}
		if(game.weapon.stat2type==10){
			updatemanabar(Math.floor(game.weapon.stat2value));
		}
	}
}
function showstats(){
	//crit dam etc. Affected by skills and weapon
	calccrit();
	critchance = critchance+"%";
	critdam = Math.ceil(critdam*100) + "%";
	document.getElementById("critchance").innerHTML = critchance;
	document.getElementById("critdam").innerHTML = critdam;
	//exp, gold and drops %
	expbonus = 0;
	goldbonus = 0;
	dropchance = 10;	
	expbonus = 0;
	rareenemychance = 10;
	epicenemychance = 1;
	
	if(game.weapon.stat2type == 3){
			rareenemychance += game.weapon.stat2value;
			epicenemychance = rareenemychance/10;
	}

	if(game.weapon.stat2type==9){ //exp
		expbonus = Math.floor(game.weapon.stat2value);
	}
	if(game.skill[10]>0){
		expbonus += game.skill[10] * skilldata.inc[10];
	}
	if(game.weapon.stat2type == 14){ //gold
		goldbonus = Math.floor(game.weapon.stat2value);
	}
	if(game.skill[4]>0){ //drop chance
		dropchance += game.skill[4] * skilldata.inc[4];
	}
	if(game.weapon.stat2type==1){
		dropchance += Math.floor(game.weapon.stat2value);
	}
	
	document.getElementById("expbonus").innerHTML = expbonus + "%";
	document.getElementById("goldbonus").innerHTML = goldbonus + "%";
	document.getElementById("dropchance").innerHTML = dropchance + "%";
	document.getElementById("kills").innerHTML = game.stats.kills;
	document.getElementById("rareenemychance").innerHTML = rareenemychance + "%";
	document.getElementById("epicenemychance").innerHTML = epicenemychance + "%";	
	
	var spellbonus = (game.skill[6] * skilldata.inc[6]);
	document.getElementById("spellbonus").innerHTML = spellbonus + "%";
}
function calccrit(){
	critchance = 10+ game.skill[9] * skilldata.inc[9];
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
function updatespells(){
	if(game.playerlvl>=1){
		document.getElementById("sparkspell").style.display="block";
		document.addEventListener('keydown', function(event) {if (event.keyCode == 81) { //Q
				spark();
			}}, true);
	}
	if(game.playerlvl>=2){
		document.getElementById("regenspell").style.display="block";
		document.addEventListener('keydown', function(event) {if (event.keyCode == 87) { //Q
			generatestatus(1,10);
		}}, true);
	}
	if(game.playerlvl>=3){document.getElementById("freezespell").style.display="block";
	}
	if(game.playerlvl>=4){
	document.getElementById("ragespell").style.display="block";
	}
	if(game.playerlvl>=5){
	document.getElementById("itemspell").style.display="block";
	}	
}
function searchforenemy(){
	enemy.health = 0;
	updateenemybar(0);
	enemycooldown = 3;
}
function rageattune(){
    game.rage.attune = document.getElementById("attune").value;
}
//status effects
function generatestatus(type,time){
	if(statuses[type][1]>0){ //if it already exists, reapply it but dont do other stuff.
		statuses[amt][type][1] = time;
		return;
	}
	if(type==1){
		if(game.mana < 100){
		pushtolog("Failed to cast spell: not enough mana",1);
		return;
		}
		updatemanabar(-100);
	}
	if(type==2){
		weakenedamt += enemy.scale * 5;
	}
	
	if(statuses[type][1] == -1){ //does status not already exist? Placement.;
	statusorder.push(type);
	statusplace = statusorder.indexOf(type);
	statusplace2 = statusplace * 100;
	}
	
	statuses[type][1] = time;
	printspan = "<div class=\"statuswidth\"><span class=\"status\" id=\""+statuses[type][0]+"\" style=\"display:inline-block;\">"+statuses[type][0]+":</span><span class=\"statustime\" id=\""+statuses[type][0]+"time\"\">"+statuses[type][1]+"</span></div>";	
	document.getElementById("statusbook").innerHTML += printspan;
}
function removestatus(type){
	var wherespan1 = document.getElementById("statusbook").childNodes.length; //remove spans
	var where = statusorder.indexOf(type);
	var where2 = where+1;
	statusbook.removeChild(statusbook.childNodes[where2]);
	statuses[type][1] = -1; //set time to negative;
	statusorder.splice(where,1); //remove from statusorder
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
	enemy.attack = 5* Math.floor((enemy.attack * enemy.scale)* (enemydb[enemy.type].attack));
	enemy.maxhealth = Math.floor((enemy.maxhealth * enemy.scale)* (enemydb[enemy.type].maxhealth));
	enemy.defence = Math.floor((enemy.defence * enemy.scale)* (enemydb[enemy.type].defence));
	
	enemy.goldmax = Math.floor((enemy.goldmax * enemy.scale)* (enemydb[enemy.type].goldmax));	
	enemy.goldmin = Math.floor(enemy.goldmax/2);
	var rarity = Math.floor(Math.random()*100);
	if(game.weapon.stat2type == 3){
		rarity += game.weapon.stat2value;
	}
		if (rarity<90){enemy.rarity = 1;}	
		if (rarity>=90){
			rarity = Math.floor(Math.random()*100);
			if (rarity>=90){enemy.rarity = 3;} else{enemy.rarity = 2;}
		}
	
	if(game.dungeonlvl>10){ // progressively harder after dungeonlvl 10
		enemy.attack = Math.floor(enemy.attack * Math.pow(game.dungeonlvl/10,2));
		enemy.maxhealth = Math.floor(enemy.maxhealth * Math.pow(game.dungeonlvl/10,2));
	}
	
	enemy.health = enemy.maxhealth;
	enemy.name = flavortext("enemyadj") +" "+  flavortext(enemydb[enemy.type].type.concat("s"));
	//"\""+enemydb[1].type.concat("s")+"\""
	enemy.special = Math.floor(Math.random()-0.5); //note number of specials. Will later want to weight?
	updatehealthbar(0);updatemanabar(0);updateenemybar(0);
	rarecolor = "<span>";
	rarecolor2 = "</span>";
	document.getElementById("enemyname").innerHTML = rarecolor + enemy.name + rarecolor2;
	document.getElementById("enemyatk").innerHTML = "<label>Attack: </label>"+enemy.attack;
	//document.getElementById("enemydef").innerHTML = "<label>Defence: </label>"+enemy.defence;
	document.getElementById("enemytype").innerHTML = "<label>Type: </label>"+ (enemydb[enemy.type].type);	
	enemyspecial(enemy.special);
}
function enemyspecial(num){

	if(enemy.special != -1){
	document.getElementById("enemyspecial").innerHTML = "<label style=\"color:"+specialatk[enemy.special][3]+"\"> "+specialatk[enemy.special][0]+"</label>";
	}
	if(enemy.special == 0){
		generatestatus(specialatk[enemy.special][1],specialatk[enemy.special][2])
	}
//enemy special att
	if(enemy.special == -1){		
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
			searchforenemy();
			game.state = 1;
			if(game.dungeonlvl==game.maxdungeon[game.currdungeon]){document.getElementById("nextdungeon").disabled = true;}
	}
}
function prevdungeon(first){
	if(game.dungeonlvl >1){
		if(typeof first=== 'undefined'){game.dungeonlvl -= 1;}
		else{game.dungeonlvl = 1;}
		defeated = 0;
		searchforenemy();
		game.state = 1;
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
	game.weapon.sign = 0;
	
	if (craftr.amt<=0 && crafts.amt<=0 && crafte.amt<=0 && craftd.amt<=0){
	pushtolog("Crafting error. No gems used.",1);
	return;
	}
	if (craftr.amt>game.loot[1].amt || crafts.amt>game.loot[2].amt || crafte.amt>game.loot[3].amt || craftd.amt>game.loot[4].amt){
	pushtolog("Crafting error. No gems used.",1);
	return;
	}
	
	game.stats.gemsused += parseInt(craftr.amt) +parseInt(crafts.amt)+parseInt(crafte.amt)+parseInt(craftd.amt);
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
			game.weapon.stat2value = Math.floor(gemarray[0].amt/5);
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
			game.weapon.stat2value = Math.round(gemarray[0].amt) / 100;
			game.weapon.statname = "mana regen";			
		}  else if( (gemarray[0].name=="rubies" || gemarray[1].name=="rubies") && (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") ){
			game.weapon.stat2type = 7;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*5);
			game.weapon.statname = "Life on kill";
			game.weapon.sign = 1;
		}  else if( (gemarray[0].name=="rubies" || gemarray[1].name=="rubies") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 8;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*5);
			game.weapon.statname = "Life on critical hit";
			game.weapon.sign = 1;
		}  else if( (gemarray[0].name=="sapphires" || gemarray[1].name=="sapphires") && (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") ){
			game.weapon.stat2type = 9;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*2);
			game.weapon.statname = "exp";			
		}  else if( (gemarray[0].name=="sapphires" || gemarray[1].name=="sapphires") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 10;
			game.weapon.stat2value = Math.floor(gemarray[0].amt);
			game.weapon.statname = "Mana on crit";
			game.weapon.sign = 1;
		}	else if( (gemarray[0].name=="emeralds" || gemarray[1].name=="emeralds") && (gemarray[0].name=="diamonds" || gemarray[1].name=="diamonds") ){
			game.weapon.stat2type = 11;
			game.weapon.stat2value = Math.floor(gemarray[0].amt);
			game.weapon.statname = "RAGE boost";
		}
	} else if(gemarray[0].name=="rubies"){
			game.weapon.stat2type = 12;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*25);
			game.weapon.statname = "Max HP";
			game.weapon.sign = 1;
	} else if(gemarray[0].name=="sapphires"){
			game.weapon.stat2type = 13;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*50);
			game.weapon.statname = "Max MP";
			game.weapon.sign = 1;			
	} else if(gemarray[0].name=="emeralds"){
			game.weapon.stat2type = 14;
			game.weapon.stat2value = Math.floor(gemarray[0].amt/2);
			game.weapon.statname = "gold bonus";			
	} else if(gemarray[0].name=="diamonds"){
			game.weapon.stat2type = 15;
			game.weapon.stat2value = Math.floor(gemarray[0].amt*2);
			game.weapon.statname = "Crit Dam";
	}

	game.weapon.name = "sword";
	if(game.weapon.sign == 1){sign="+";sign2=" "};
	if(game.weapon.sign == 0){sign2="%";sign=" "};
	document.getElementById("weapon").innerHTML = "+"+ game.weapon.stat1value +" weapon of "+sign+ " "+game.weapon.stat2value + sign2 + game.weapon.statname;

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
game.skill[num] += 1;
game.skillpts -= 1;
var btnname = "skill" + num;
var btntext = skilldata.name[num] + "("+game.skill[num]+")";
document.getElementById(btnname).value = btntext;
if(game.skill[num]==skilldata.max[num]){
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
	if(type==shop.item[0]){
		game.maxhealth += 100;
		game.item[0] += 1;
		updatehealthbar(0);
	}
	if(type==shop.item[1]){
		game.maxmana += 200;
		game.item[1] += 1;
		updatemanabar(0);
	}
	if(type==shop.item[2]){
		game.attack += 5;
		game.item[2] += 1;
		updateattack();
	}
	if(type==shop.item[3]){document.getElementById("forest").style.display="block";game.item[3] = 1;}	
	if(type==shop.item[4]){document.getElementById("mountain").style.display="block";game.item[4] = 1;}
	if(type==shop.item[5]){document.getElementById("desert").style.display="block";game.item[5] = 1;}
	if(type==shop.item[6]){document.getElementById("volcano").style.display="block";game.item[6] = 1;}
	if(type==shop.item[7]){document.getElementById("ocean").style.display="block";game.item[7] = 1;}
	if(type==shop.item[8]){ //aka musk potion
	document.getElementById("ocean").style.display="block";game.item[7] = 1;
	}

	
	/*
	if(type==game.cost[3].name){
	game.attack += 5;
	game.cost[3].amt+=1;
	updateattack();
	}
	if(type==game.cost[4].name){
	game.cost[4].amt=0;
	document.getElementById("forest").style.display="block";
	}*/
	rollshop();
}

function rollshop(){
	var shoproll = [];

	for(var i=0;i<shop.price.length;i++){
		shoproll += "<label>" + shop.item[i] + "</label>";
		var newprice = shop.price[i]+(shop.inc[i]*game.item[i]);
		if(game.gold<newprice || (game.item[i]==1 && shop.repeat[i]==0)){
			disable = "disabled";
			} else {disable = ""};
		var itemname = "'"+shop.item[i]+"'";
		shoproll += "<input type=\"button\" value=\""+ newprice +"\" onClick=\"buyuseable("+itemname+","+newprice+")\""+ disable +" id=\"cost"+i+"\"/><br />";				

	}
	document.getElementById("shop").innerHTML = shoproll;
}

//spells
function spark(){
	if(enemy.health<=0 || enemy.health==null || typeof enemy.health=="undefined"){
	pushtolog("There is no enemy to cast it on!",1);
	return;
	}
	if(game.mana >=50){
	var spellbonus = (game.skill[6] * skilldata.inc[6])/100;
	updateenemybar(-Math.floor((game.playerlvl*20)*(1+spellbonus)));
    updatemanabar(-50);
	}
	if(enemy.health<=0){
		enemy.cooldown = 0;
	}
};
function freeze(){
	if(enemy.health<=0 || enemy.health==null || typeof enemy.health=="undefined"){
	pushtolog("There is no enemy to cast it on!",1);
	return;
	}
	if(game.mana >=20){
    updatemanabar(-20);
	
	}	
}

//monster phat lewt
function loot(goldmin,goldmax,bias){
	defeated += 1;game.stats.kills +=1;
	//before bonuses
	expgain = 0;
	expgain = game.dungeonlvl;	
	gainedgold = Math.floor(Math.random() * (goldmax - goldmin + 1)) + goldmin;
	
	//after bonus
	showstats();
	
	var multiply = enemy.rarity;
	if(game.rage.attune==2){multiply += Math.floor(rage/100)};
		expgain = Math.floor((expgain * (1+(expbonus/100))*multiply));
		
	game.exp -= expgain;

	multiply = 1;
	if(game.rage.attune==1){multiply += rage/100};	
	gainedgold = Math.floor((gainedgold * (1 + goldbonus/100))*multiply);
	game.gold += gainedgold;
	document.getElementById("gold").innerHTML = game.gold; 
	//rubies / items /drops
	var drophappens = dropchance + Math.floor(Math.random()*100 +1);
	
	if(drophappens>=100){ //10% chance of drop
		if(dungeon[game.currdungeon].lootbias>0){ //if there is a bias via dungeon
		var whatdrops = weightedrandom(dungeon[game.currdungeon].lootbias,1,4,3);
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
	if(game.exp<=0){ //if you gain a level + exp calc
		pushtolog("You gained a level!",0);
		game.playerlvl += 1;
		game.skillpts += 1;
		game.exp = game.playerlvl + Math.floor(Math.pow(game.playerlvl/0.15,2));
		displayinfo("playerlvl");
		displayinfo("skillpts");
		updatespells();
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
	if(drophappens>=100){
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
	/*
	if(statuses.rage>0){
		document.getElementById("ragetime").innerHTML = statuses.rage;
		statuses.rage -= 1;
	} else if(statuses.rage==0){
		game.tempattack = 0;
		updateattack();
		removestatus("rage");
	}
*/
	//check statuses
	for(var i=0;i<statuses.length;i++){
		if(statuses[i][1]>0){
			statuses[i][1] -= 1;
			document.getElementById(statuses[i][0]+"time").innerHTML = statuses[i][1];
			var spellbonus = (game.skill[6] * skilldata.inc[6])/100;
			if(i==1){updatehealthbar(Math.floor(tempmaxhealth/100)*(1+spellbonus));
			}
		}
		if(statuses[i][1]==0){
			removestatus(i);
			if(i==0){updateattack();removestatus(0);}
			if(i==2){weakenedamt = 0;updateattack();}
		}
	}
	
	if(enemy.health <= 0 && game.state == 1){ //if enemy is dead - rewards, plus cooldown
			if(enemycooldown<=0){
			loot(enemy.goldmin,enemy.goldmax,enemy.type);
			enemycooldown= 6 - (game.skill[1] * skilldata.inc[1]);
			randomtext = flavortext("killedenemy");
			}
			enemycooldown -= 1;
			if(defeated>0){document.getElementById("defeated").innerHTML = defeated + randomtext +"! Another enemy in " + enemycooldown;}
			else{document.getElementById("defeated").innerHTML = "Searching for enemies... " + enemycooldown;}
			
			if(game.dungeonlvl==game.maxdungeon[game.currdungeon] && defeated== 10 - game.skill[8] * skilldata.inc[8]){ //can you go to next dungeon level?
				game.maxdungeon[game.currdungeon] += 1;
				document.getElementById("maxdungeonlvl").innerHTML = game.maxdungeon[game.currdungeon];
				document.getElementById("nextdungeon").disabled = false;
			}
		}else{
		document.getElementById("defeated").innerHTML = "";
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
		if(enemy.attack>0){updateragebar(25);} // if hit, RAGE
		//have you died?
		if(game.health <= 0){
		updatehealthbar(0);
		backtomap();
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
	
		

	updatehealthbar(Math.floor(tempmaxhealth/1000));
	updatemanabar(Math.floor(tempmaxmana/1000));
	if(game.weapon.stat2type==6){
	updatemanabar(Math.floor((tempmaxmana/100)*game.weapon.stat2value));
	}
	updatehealthbar(Math.floor((tempmaxhealth/1000)*game.skill[3] * skilldata.inc[3]));
	document.getElementById("setting").innerHTML = game.currdungeon;
	updateragebar(-20);
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
//Runs anyway, but is overridden if there is a save game.
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
	if(game.weapon.sign == 1){sign="+";var sign2=" "};
	if(game.weapon.sign == 0){sign2="%";var sign=" "};
	document.getElementById("weapon").innerHTML = "+"+ game.weapon.stat1value +" weapon of "+sign+ game.weapon.stat2value + sign2 + game.weapon.statname;

	}

	updatespells();
	
	if(game.item[3]==1){document.getElementById("forest").style.display="block";}	//aka bought forest map
	if(game.item[4]==1){document.getElementById("mountain").style.display="block";}
	if(game.item[5]==1){document.getElementById("desert").style.display="block";}
	if(game.item[6]==1){document.getElementById("volcano").style.display="block";}
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
var whichone = Math.floor(Math.random() * flav[type].length);
var flavtext = flav[type][whichone];
return flavtext;
}
