var totalCash = 100.00;

var fruits = {
	apple: new generateFruit("Apple", initializePrice()),
	bananas: new generateFruit("Bananas", initializePrice()),
	// grape: new generateFruit("grape", initializePrice()),
	orange: new generateFruit("Orange", initializePrice()),
	pear: new generateFruit("Pear", initializePrice())
};

function generateFruit(name, price){
	this.fruitName = name;
	this.fruitPrice = price;
	this.fruitQty = 0;
	this.totalSpent = 0;
}

function randomNumber(min, max) {
	return Math.floor(Math.random() * (1 + max - min) + min);
}

function initializePrice(){
	var price = (randomNumber(50,999))/100
	return Number(price.toFixed(2));
}

function updatePrice(currentPrice){
	var newPrice = currentPrice;
	var increment = randomNumber(1,50)/100;

	//random check to determine wether to add or subtract
	if(Math.random()>=.50){
		newPrice += increment;
	}else{
		newPrice -= increment;
	}

	//readjusts price to stay within bounds
	if(newPrice>9.99){
		newPrice = 9.99;
	}
	if(newPrice<.50){
		newPrice = .50;
	}

	return Number(newPrice.toFixed(2));
}


function appendFruits () {
	for(object in fruits){
		var selectedFruit = fruits[object];
		// console.log(selectedFruit);
		var price = selectedFruit.fruitPrice;
		price=updatePrice(price);
		fruits[object].fruitPrice = price;
		// console.log(selectedFruit);
	}
}

function sellFruit(context){
	var $el = $(context).parent();
	var name = $el.data('name');

	if(fruits[name].fruitQty < 1) {
		alert("Sorry!  You have no " + name + " to sell!");
		return;
	}
	fruits[name].fruitQty--;
	fruits[name].totalSpent -= fruits[name].fruitPrice;
	totalCash += fruits[name].fruitPrice;
	// console.log(totalCash.toFixed(2));
	appendDom();
}

function sellAll(){
	for(objects in fruits){
		console.log("this is the fruit", objects);
		totalCash+= fruits[objects].fruitQty*fruits[objects].fruitPrice;
		console.log("Qty before zero", fruits[objects].fruitQty);
		fruits[objects].fruitQty=0;
		console.log("This is quantity ", fruits[objects].fruitQty);
		console.log("This is cash ", totalCash);
	}	
}


function buyFruit(context){
	var $el = $(context).parent();
	var name = $el.data('name');

	if(totalCash < fruits[name].fruitPrice){
		alert("Sorry! You are broke!");
		return;
	}

	fruits[name].fruitQty++;
	fruits[name].totalSpent += fruits[name].fruitPrice;
	totalCash -= fruits[name].fruitPrice;
	// console.log(totalCash.toFixed(2));
	appendDom();
}

function getAvgPrice(object){
	var avgPrice;
	if(object.fruitQty==0){
		avgPrice = 0;
	}else{
		avgPrice = (object.totalSpent/object.fruitQty).toFixed(2);
	}
	return avgPrice;
}

function formatPrice(number){
	number = number.toString();
	if(number.length==1){
		number = number + ".00"
	}else if(number.length==3){
		number = number + "0"
	}
	return number;
}

function appendDom(){
	$("#container").empty();
	for(object in fruits){
		$("#container").append("<div class='col-md-3 col-sm-6 col-xs-6 well fruit' data-name='" + object + "'></div>");
		var $el = $("#container").children().last();

		var link = "<img src='images/"+ object +".png' height=32 width=32>"


		$el.append("<p class='fruit-name'>" + fruits[object].fruitName + ": <span class='badge'><big>" + fruits[object].fruitQty + "</big></span></p>");
		$el.append("<p class='price'>$" + formatPrice(fruits[object].fruitPrice) + "</p>");
		$el.append("<div class='btn btn-success buy' id='"+object+"Button'>"+ link + " Buy</div>");
		$el.append("<div class='btn btn-info sell' id='"+object+"SellButton'>"+ link + " Sell</div>");
		$el.append("<p class='price'> Average Price Per Fruit: $" + formatPrice(getAvgPrice(fruits[object])) + "</p>")
	}
	$("#container").append("<div class='lead cash'></div>");
	$el = $("#container").children().last();
	$el.append("<p>Total Cash Money Available: $ " + formatPrice(totalCash.toFixed(2)) + "</p>");
}

function finalizeDom(){
	$("#container").empty();
	for(object in fruits){
		$("#container").append("<div class='col-md-3 col-sm-6 col-xs-6 well fruit' data-name='" + object + "'></div>");
		var $el = $("#container").children().last();

		var link = "<img src='images/"+ object +".png' height=32 width=32>"


		$el.append("<p class='fruit-name'>" + fruits[object].fruitName + ": <span class='badge'><big>" + fruits[object].fruitQty + "</big></span></p>");
		$el.append("<p class = 'price'>$" + formatPrice(fruits[object].fruitPrice) + "</p>");
		$el.append("<div class='btn btn-success buy' id='"+object+"Button'>"+ link + " Buy</div>");
		$el.append("<div class='btn btn-info sell' id='"+object+"SellButton'>"+ link + " Sell</div>");
		$el.append("<p class = 'price'> Average Price Per Fruit: $" + formatPrice(getAvgPrice(fruits[object])) + "</p>")
	}
	$("#container").append("<div class='lead cash'></div>");
	$el = $("#container").children().last();
	var finalCash = formatPrice(totalCash.toFixed(2));
	if(finalCash<100){
		$el.append("<p>Total Cash Money Available: <span class='text-danger strong'>$" + finalCash + "</span></p>");
		var lost = (100-totalCash).toFixed(2);
		$el.append("<p>You Lost A Total Of: <span class='text-danger strong'>$" + formatPrice(lost) + "</span></p>");

	}else if (finalCash ==100){
		$el.append("<p>Total Cash Money Available: $" + finalCash + "</span></p>");
		$el.append("<p>You Broke Even</p>");
	}else{
		$el.append("<p>Total Cash Money Available: <span class='text-success strong'>$" + finalCash + "</span></p>");
		var earned = (totalCash-100).toFixed(2);
		$el.append("<p>You Earned A Total Of: <span class='text-success strong'>$" + formatPrice(earned) + "</span></p>");
	}

	$("#container").off();
}

$(document).ready(function(){
	appendDom();

	var setChange = setInterval(function(){
		appendFruits();
		appendDom();
	},1000);

	$("#container").on('click', '.buy', function(){
		buyFruit(this);
	});
	$("#container").on('click', '.sell', function(){

		sellFruit(this);
	});

	var setTimer = setInterval(function(){
		alert("Buying stopped, all items sold!");
		sellAll();
		finalizeDom();
		clearInterval(setTimer);
		clearInterval(setChange);
		
	}, 5000);

});










