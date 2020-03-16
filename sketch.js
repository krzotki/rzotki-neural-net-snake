
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 
document.getElementById("speed").onchange = function(){
	drawSpeed = parseInt(document.getElementById("speed").value);
	clearInterval(drawInter);
	drawInter = setInterval(draw,1000/drawSpeed);
}


var canvas =  document.getElementById("canv");
canvas.width =  800;
canvas.height = 800;
var drawInter;
var snakes = [];
var deadSnakes =[];
var maxPopulation = 100;
// var inputNumber = (canvas.width/25)*(canvas.width/25)+8;
var inputNumber = 13;
var outputNumber =4;
var hiddenLayers =1;
var hiddenNodes = 18;
var mutationRate = 3;
var generation=0;
var drawSpeed=100;
var wannaDraw = true;
var bestSnake;
var wannaSave=false;
var wannaLoad=false;
var loadedGeneration = null;
var savedGeneration = null;
var wannaOpen = true; //from zero to hero or open trained brain


function draw()
{
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,canvas.width,canvas.height);

	for(var i in snakes)
	{
		var result;
		if(i==0)
		{
			result = snakes[i].update(ctx);
		}
		else
		{
			result = snakes[i].update();
		}
	}
	for(var i=0;i<snakes.length;i++)
	{
		// if(i==0)wannaDraw = true;
		// else wannaDraw = false;
		if(snakes[i].collide)
		{
			snakes[i].calculateFitness();
			deadSnakes.push(snakes[i]);
			snakes.splice(i,1);
		}
	}
	if(snakes.length==0)
	{
		snakes = nextGeneration(deadSnakes);
		bestSnake = deadSnakes[deadSnakes.length-1];
		deadSnakes = [];
	}
}

function openGeneration(string)
{
	loadedGeneration = JSON.parse(string);
}
function loadGeneration()
{
	newPopulation();  
	for(var i in snakes)
	{
		var loaded = loadedGeneration[i].brain;
		
		snakes[i].brain = NeuralNetwork.copy(loaded);
	}
}
function saveGeneration(tab)
{
	var json = JSON.stringify(tab);
	savedGeneration=json;
}

function skipEvolution(gen)
{
	clearInterval(drawInter);
	wannaDraw = false;
	while(generation<gen)
	{
		justCalculate();
	}
	wannaDraw = true;
	drawInter = setInterval(draw,1000/drawSpeed);

}

function justCalculate()
{
	for(var i in snakes)
	{
		var result = snakes[i].update();
	}
	for(var i=0;i<snakes.length;i++)
	{
		if(snakes[i].collide)
		{
			snakes[i].calculateFitness();
			deadSnakes.push(snakes[i]);
			snakes.splice(i,1);
		}
	}
	if(snakes.length==0)
	{
		snakes = nextGeneration(deadSnakes);
		deadSnakes = [];
	}
	
}

function newPopulation()
{
	for(var i =0;i<maxPopulation;i++)
	{
		var nn = new NeuralNetwork(inputNumber,hiddenNodes,outputNumber,hiddenLayers);
		snakes.push(new Snake(nn))
	}
	
}


if(wannaOpen)
{
	openGeneration(goodGenes);
	loadGeneration();
}
else
{
	newPopulation();
}

drawInter = setInterval(draw,1000/drawSpeed);

onkeydown = function(event)
{
	var key = event.key;
	if(key=="ArrowUp")snakes[0].steer("U");
	else if(key=="ArrowDown")snakes[0].steer("D");
	else if(key=="ArrowLeft")snakes[0].steer("L");
	else if(key=="ArrowRight")snakes[0].steer("R");
	
}