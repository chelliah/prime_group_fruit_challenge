var totalCash = 100.00;

var fruits = {
	apple: new generateFruit("apple", initializePrice()),
	bananas: new generateFruit("bananas", initializePrice()),
	// grape: new generateFruit("grape", initializePrice()),
	orange: new generateFruit("orange", initializePrice()),
	pear: new generateFruit("pear", initializePrice())
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
	console.log(totalCash.toFixed(2));
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

function appendDom(){
	$("#container").empty();
	for(object in fruits){
		$("#container").append("<div class='col-md-3 well fruit' data-name='" + object + "'></div>");
		var $el = $("#container").children().last();

		var link = "<img src='images/"+ object +".png' height=32 width=32>"

		$el.append("<p>" + fruits[object].fruitName + ": </p>");
		$el.append("<p>$" + fruits[object].fruitPrice + "</p>");
		$el.append("<div class='btn btn-success buy' id='"+object+"Button'>"+ link + " Buy</div>");
		$el.append("<p> Average Price Per Fruit: $" + getAvgPrice(fruits[object]) + "</p>")
	}
	$("#container").append("<div class='cash'></div>");
	$el = $("#container").children().last();
	$el.append("<p>Total Cash Money Available: $ " + totalCash.toFixed(2) + "</p>");

}

$(document).ready(function(){
	appendDom();
	setInterval(function(){
		appendFruits();
		appendDom();
	},15000);

	$("#container").on('click', '.buy', function(){
		// console.log(this);
		buyFruit(this);
	});

});
