var TileData = function (imageName) {
	this.imageName = imageName;
	this.objects = new Array();
};

TileData.prototype.addObject = function(tileObject) {
	this.objects.push(tileObject);
};

/* Types:
 1 - City
 2 - Road 
 3 - City with shield
 4 - Cloister
 5 - Nothing / Crossroad */
var TileObject = function(type, coveredSubtiles) {
	this.type = type;
	this.coveredSubtiles = coveredSubtiles;
};

TileObject.prototype.coversSubtile = function(subtileIndex) {
	return this.coveredSubtiles.indexOf(subtileIndex) != -1;
};

var Subtile = function(type, position) {
	var self = this;
	this.type = type;
	this.position = position;

	var typeClass = 'TileType ';
	typeClass += ' ' + getTypeClass(type);
	this.element = $('<div class="' + typeClass + '"></div>');
};

// Subtile.prototype.onMouseEnter = function(tile, board) {
// 	var self = this;
// 	this.element.mouseenter(function () {
// 		var object = tile.findObjectOnSubtile(self.position);
// 		if(object != null) {
// 			$.each(object.coveredSubtiles, function(index, subtileIndex) {
// 				 tile.subTiles[subtileIndex].element.css('background', 'black');
// 			});
// 			tile.lastHoverObject = object;
// 		}
// 	});

// 	this.element.mouseleave(function () {
// 		var object = tile.lastHoverObject;
// 		if(object != null) {
// 			$.each(object.coveredSubtiles, function(index, subtileIndex) {
// 				 tile.subTiles[subtileIndex].element.css('background', '');
// 			});
// 			tile.lastHoverObject = null;
// 		}
// 	});	
// };

var Tile = function (tileData) {
	var self = this;
	this.tileData = tileData;
	this.element = $('<div style="overflow: hidden; background: url(images/' + 
		tileData.imageName + '.png)"><div style="overflow: hidden;" class="subtiles"></div></div>');
	this.rotation = 0;
	this.sides = new Array(4);
	this.subTiles = new Array();
	this.follower = null;
	this.lastHoverObject = null;
	this.x = 0;
	this.y = 0;
	this.isExpanded = false;

	var subtileTypes = new Array(9);
	$.each(tileData.objects, function(index, object) {
		$.each(object.coveredSubtiles, function(index, subtileIndex) {
			 subtileTypes[subtileIndex] = object.type;
		});
	});

	var subtileContainer = $(this.element.find('.subtiles')[0]);
	for(var i = 0; i < 9; i++) {
		var subtile = new Subtile(subtileTypes[i], i);
		this.subTiles.push(subtile);
		subtileContainer.append(subtile.element);
		
		// subtile.onMouseEnter(self);
	}

	this.sides[0] = this.subTiles[5].type;
	this.sides[1] = this.subTiles[7].type;
	this.sides[2] = this.subTiles[3].type;
	this.sides[3] = this.subTiles[1].type;

	for(var i = 0; i < 4; i++) {
		if(this.sides[i] == 3)
			this.sides[i] = 1;
	}
};

var getTypeClass = function (tileType) {
	switch(tileType) {
		case 0:
			return 'Grass';
		case 1:
			return 'City';
		case 3:
			return 'CityShield';
		case 2:
			return 'Road';
		case 4:
			return 'Cloister';
	}
	return '';
};

Tile.prototype.findObjectOnSubtile = function(subtileIndexToFind) {
	var objectToReturn = null;
	$.each(this.tileData.objects, function(index, object) {
		$.each(object.coveredSubtiles, function(index, subtileIndex) {
			if(subtileIndex == subtileIndexToFind)
				objectToReturn = object;
		});
	});
	return objectToReturn;
};

Tile.prototype.haveMatchingSides = function (otherTile, relativePosition, rotation) {
	var sideToCompare = 0;
	var otherSideToCompare = 0;

	switch(relativePosition) {
		case 'above':
			sideToCompare = 1;
			otherSideToCompare = 3;
			break;

		case 'below':
			sideToCompare = 3;
			otherSideToCompare = 1;
			break;

		case 'left':
			sideToCompare = 0;
			otherSideToCompare = 2;
			break;

		case 'right':
			sideToCompare = 2;
			otherSideToCompare = 0;
			break;
	}
		
	sideToCompare += rotation;
	if(sideToCompare > 3)
		sideToCompare = sideToCompare - 4;

	otherSideToCompare += otherTile.rotation;
	if(otherSideToCompare > 3)
		otherSideToCompare = otherSideToCompare - 4;

	return this.sides[sideToCompare] == otherTile.sides[otherSideToCompare];
};

// Tile.prototype.setRotation = function(rotation) {
// 	this.rotation = rotation;

// 	var tmp = new Array(9);
// 	tmp[4] = this.subTiles[4];
// 	switch(rotation) {
// 		case 1:
// 			tmp[0] = this.subTiles[6];
// 			tmp[1] = this.subTiles[3];
// 			tmp[2] = this.subTiles[0];

// 			tmp[5] = this.subTiles[1];
// 			tmp[8] = this.subTiles[2];

// 			tmp[6] = this.subTiles[8];
// 			tmp[7] = this.subTiles[5];

// 			tmp[3] = this.subTiles[7];
// 			break;

// 		case 2:
// 			tmp[0] = this.subTiles[8];
// 			tmp[1] = this.subTiles[7];
// 			tmp[2] = this.subTiles[6];

// 			tmp[5] = this.subTiles[3];
// 			tmp[8] = this.subTiles[0];

// 			tmp[6] = this.subTiles[2];
// 			tmp[7] = this.subTiles[1];

// 			tmp[3] = this.subTiles[5];
// 			break;

// 		case 3:
// 			tmp[0] = this.subTiles[2];
// 			tmp[1] = this.subTiles[5];
// 			tmp[2] = this.subTiles[8];

// 			tmp[5] = this.subTiles[7];
// 			tmp[8] = this.subTiles[6];

// 			tmp[6] = this.subTiles[0];
// 			tmp[7] = this.subTiles[3];

// 			tmp[3] = this.subTiles[1];
// 			break;
// 	}

// 	for (var i = this.subTiles.length - 1; i >= 0; i--) {
// 		this.subTiles[i].position = i;
// 	};

// 	var subtileContainer = $(this.element.find('.subtiles')[0]);
// 	subtileContainer.html('');
// 	for(var i = 0; i < 9; i++) {
// 		subtileContainer.append(this.subTiles[i].element);
// 	}

// 	this.subTiles = tmp;
// };

Tile.prototype.rotateSubtilePosition = function(position) {
	switch(this.rotation) {
		case 0:
			return position;

		case 1:
			if(position == 0) return 2;
			if(position == 1) return 5;
			if(position == 2) return 8;

			if(position == 5) return 7;
			if(position == 8) return 6;

			if(position == 6) return 0;
			if(position == 7) return 3;

			if(position == 3) return 1;
			break;

		case 2:
			if(position == 0) return 8;
			if(position == 1) return 7;
			if(position == 2) return 6;

			if(position == 5) return 3;
			if(position == 8) return 0;

			if(position == 6) return 2;
			if(position == 7) return 1;

			if(position == 3) return 5;
			break;

		case 3:
			if(position == 0) return 6;
			if(position == 1) return 3;
			if(position == 2) return 0;

			if(position == 5) return 1;
			if(position == 8) return 2;

			if(position == 6) return 8;
			if(position == 7) return 5;

			if(position == 3) return 7;
			break;
	}
}

Tile.prototype.placeFollower = function() {
	this.follower = true;

	var follower = $('<img src="images/follower.png" width="30" class="follower" />');
	this.element.append(follower);
};

var createTiles = function () {
	var tiles = new Array();

	/* Types:
	 0 - Grass
	 1 - City
	 2 - Road 
	 3 - City with shield
	 4 - Cloister
	 5 - Nothing / Crossroad */

	// Start tile
	//var connectedSides = new Array();
	tileData = new TileData('city1rwe');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3, 4, 5]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('city1rswe');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3]));
	tileData.addObject(new TileObject(2, [5]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1rsw');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [3, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1rse');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city1');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tiles = tiles.concat(createTileFromTileData(5, tileData));

	tileData = new TileData('cloister');
	tileData.addObject(new TileObject(4, [4]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('cloisterr');
	tileData.addObject(new TileObject(4, [4]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city11we');
	tileData.addObject(new TileObject(1, [0, 3, 6]));
	tileData.addObject(new TileObject(1, [2, 5, 8]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city11ne');
	tileData.addObject(new TileObject(1, [0, 1, 2]));
	tileData.addObject(new TileObject(1, [2, 5, 8]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('road2sw');
	tileData.addObject(new TileObject(2, [3, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(9, tileData));

	tileData = new TileData('city2nwsr');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 6]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2nwr');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 6]));
	tileData.addObject(new TileObject(2, [4, 5, 7]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('city2nws');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 6]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2nw');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 6]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('road2ns');
	tileData.addObject(new TileObject(2, [1, 4, 7]));
	tiles = tiles.concat(createTileFromTileData(8, tileData));

	tileData = new TileData('city2wes');
	tileData.addObject(new TileObject(3, [0, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city2we');
	tileData.addObject(new TileObject(1, [0, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('road3');
	tileData.addObject(new TileObject(2, [3]));
	tileData.addObject(new TileObject(2, [5]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(4, tileData));

	tileData = new TileData('city3sr');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 4, 5, 6, 8]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(2, tileData));

	tileData = new TileData('city3r');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 8]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city3s');
	tileData.addObject(new TileObject(3, [0, 1, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city3');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 8]));
	tiles = tiles.concat(createTileFromTileData(3, tileData));

	tileData = new TileData('road4');
	tileData.addObject(new TileObject(2, [1]));
	tileData.addObject(new TileObject(2, [3]));
	tileData.addObject(new TileObject(2, [5]));
	tileData.addObject(new TileObject(2, [7]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));

	tileData = new TileData('city4');
	tileData.addObject(new TileObject(1, [0, 1, 2, 3, 4, 5, 6, 7, 8]));
	tiles = tiles.concat(createTileFromTileData(1, tileData));
	
	return tiles;
};

var createTileFromTileData = function(tileCount, tileData) {
	var tiles = new Array();
	for(var i = 0; i < tileCount; i++) {
		var tile = new Tile(tileData);
		tiles.push(tile);
	}
	return tiles;
};

