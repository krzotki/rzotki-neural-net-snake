function mutateByRandom(value)
{
	var random = getRandomInt(0,100);
	if(random<mutationRate)
	{
		var gaussian = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
		var x = value * gaussian;
		return x;
	}
	else
	{
		return value;
	}
}


function nextGeneration(oldGeneration)
{
	if(wannaSave)
	{
		wannaSave = false;
		saveGeneration(oldGeneration);
	}
	var isThereAnyGood = false;
	while(oldGeneration[oldGeneration.length-1].fitness>100)
	{
		for(var i =0;i<oldGeneration.length;i++)
		{
			oldGeneration[i].fitness/=10;
			oldGeneration[i].fitness = Math.ceil(oldGeneration[i].fitness);
			if(oldGeneration[i].fitness>0)isThereAnyGood = true;
			
		}
	}
	for(var i =0;i<oldGeneration.length;i++)
	{
		if(oldGeneration[i].fitness>0)isThereAnyGood = true;
	}
	if(!isThereAnyGood)
	{	
		newPopulation();
		console.log("TRASH")
		return;
	}
	var matingPool =[];
	
	for(var i =0;i<oldGeneration.length;i++)
	{
		for(var g=0;g<oldGeneration[i].fitness;g++)
		{
			matingPool.push(oldGeneration[i].brain);
		}
	}

	var kids = [];
	
	for(var h=0;h<maxPopulation;h++)
	{
		var random = getRandomInt(0,matingPool.length-1);
		var parent1 = matingPool[random].copy();
		random = getRandomInt(0,matingPool.length-1);
		var parent2 = matingPool[random].copy();
		var tempBrain = new NeuralNetwork(inputNumber,hiddenNodes,outputNumber,hiddenLayers);		
		
		
		random = getRandomInt(0,tempBrain.weightsToHidden.matrix.length-1);

		for(var i=0;i<tempBrain.weightsToHidden.matrix.length;i++)
		{
			if(i<random)
			{
				tempBrain.weightsToHidden.matrix[i] = parent1.weightsToHidden.matrix[i];
			}
			else
			{
				tempBrain.weightsToHidden.matrix[i] = parent2.weightsToHidden.matrix[i];
			}
		}
		
		for(var n =0;n<tempBrain.AdditionalHiddenLayers.length;n++)
		{
			var temp = tempBrain.AdditionalHiddenLayers[n].weights.matrix;
			var parent1Layer = parent1.AdditionalHiddenLayers[n].weights.matrix;
			var parent2Layer = parent2.AdditionalHiddenLayers[n].weights.matrix;
			random = getRandomInt(0,temp.length-1);
			for(var i=0;i<temp.length;i++)
			{
				if(i<random)
				{
					tempBrain.AdditionalHiddenLayers[n].weights.matrix[i] = parent1Layer[i];
				}
				else
				{
					tempBrain.AdditionalHiddenLayers[n].weights.matrix[i] = parent2Layer[i];
				}
			}
			
		}
		for(var n =0;n<tempBrain.AdditionalHiddenLayers.length;n++)
		{
			var temp = tempBrain.AdditionalHiddenLayers[n].biases.matrix;
			var parent1Layer = parent1.AdditionalHiddenLayers[n].biases.matrix;
			var parent2Layer = parent2.AdditionalHiddenLayers[n].biases.matrix;
			
			random = getRandomInt(0,temp.length-1);
			for(var i=0;i<temp.length;i++)
			{
				if(i<random)
				{
					tempBrain.AdditionalHiddenLayers[n].biases.matrix[i] = parent1Layer[i];
				}
				else
				{
					tempBrain.AdditionalHiddenLayers[n].biases.matrix[i] = parent2Layer[i];
				}
			}
			
		}
		
		
		random = getRandomInt(0,tempBrain.weightsToOutput.matrix.length-1);
		for(var i=0;i<tempBrain.weightsToOutput.matrix.length;i++)
		{
			if(i<random)
			{
				tempBrain.weightsToOutput.matrix[i] = parent1.weightsToOutput.matrix[i];
			}
			else
			{
				tempBrain.weightsToOutput.matrix[i] = parent2.weightsToOutput.matrix[i];
			}
		}
		random = getRandomInt(0,tempBrain.biasToHidden.matrix.length-1);
		for(var i=0;i<tempBrain.biasToHidden.matrix.length;i++)
		{
			if(i<random)
			{
				tempBrain.biasToHidden.matrix[i] = parent1.biasToHidden.matrix[i];
			}
			else
			{
				tempBrain.biasToHidden.matrix[i] = parent2.biasToHidden.matrix[i];
			}
		}
		random = getRandomInt(0,tempBrain.biasToOutput.matrix.length-1);
		for(var i=0;i<tempBrain.biasToOutput.matrix.length;i++)
		{
			if(i<random)
			{
				tempBrain.biasToOutput.matrix[i] = parent1.biasToOutput.matrix[i];
			}
			else
			{
				tempBrain.biasToOutput.matrix[i] = parent2.biasToOutput.matrix[i];
			}
		}
		
		tempBrain.mutate(mutateByRandom);
		
		kids.push(new Snake(tempBrain));
		
		
	}
	generation++;
	console.log("Generation: "+generation);
	return kids;

}