/*
 * OBS.: Ao criar uma função da seguinte forma
 * (function(){}());
 * a mesma é chamada logo quando o documento html é iniciado
 * */
(function(){
	var cnv = document.querySelector("canvas");//armazena a referencia do canvas utilizado no doc
	var ctx = cnv.getContext("2d");//Armazena o contexto de renderização do canvas
	var dimensao = 32;//Tamanho de cada tile, define a dimensão de tudo
	
	var WIDTH = cnv.width, HEIGHT = cnv.height;
	
	var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;// Código das setas do teclado
	var mvLeft = mvUp = mvDown = mvRight = false;// Variaveis que indicam qual tecla esta ativa no momento
	
	var walls = [];//Tudo oque se choca com o player
	
	//Objeto que representa o player
	var player = {
		x: dimensao + 2,
		y: dimensao + 2,
		width: 28,
		height: 28,
		speed: 2
	};
	
	//matriz que representa o labirinto
	var maze = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,1],
		[1,0,0,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1],
		[1,1,1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,1],
		[1,0,0,0,1,1,1,1,1,1,0,1,1,0,1,0,1,0,0,1],
		[1,0,1,1,1,0,0,0,0,1,0,1,1,0,1,0,1,1,0,1],
		[1,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0,1,0,0,1],
		[1,0,1,0,0,0,1,0,1,1,0,1,1,0,1,1,1,1,1,1],
		[1,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1],
		[1,0,0,0,1,1,1,1,0,1,0,1,1,1,1,0,1,0,0,1],
		[1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1],
		[1,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1],
		[1,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,1],
		[1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1],
		[1,0,1,1,1,0,1,1,0,1,0,1,1,0,1,1,1,1,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];
	
	//laço de repetição encadeado que cria um objeto wall para parte da parede 
	for(var row in maze){
		for(var column in maze[row]){
			var tile = maze[row][column];
			if(tile == 1){
				var wall = {
					x: dimensao*column,
					y: dimensao*row,
					width: dimensao,
					height: dimensao
				};
				walls.push(wall);//Adiciona a parede no array de paredes
			}
		}
	}
	
							"Evento, função que atendera o evento, false"
	window.addEventListener("keydown", keydownHandler, false);
	window.addEventListener("keyup", keyupHandler, false);
	
	function keydownHandler(e){
		var key = e.keyCode;
		switch(key){
			case LEFT:
				mvLeft = true;
				break;
			case RIGHT:
				mvRight = true;
				break;
			case UP:
				mvUp = true;
				break;
			case DOWN:
				mvDown = true;
				break;
		}
	}
	
	function keyupHandler(e){
		var key = e.keyCode;
		switch(key){
		case LEFT:
			mvLeft = false;
			break;
		case RIGHT:
			mvRight = false;
			break;
		case UP:
			mvUp = false;
			break;
		case DOWN:
			mvDown = false;
			break;
		}
	}
	
	//Atualiza o jogo 
	function update(){
		if(mvLeft && !mvRight){
			player.x -= player.speed; 
		}else
		if(mvRight && !mvLeft){
			player.x += player.speed;
		}
		
		if(mvUp && !mvDown){
			player.y -= player.speed;
		}else
		if(mvDown && !mvUp){
			player.y += player.speed;
		}
		
		//Checa, entre todas as paredes, qual esta chocando com o player 
		for(var i in walls){
			var wall = walls[i];
			blockRectangle(player, wall);//Função responsavel por checar
		}
	}
	
	function blockRectangle(objA, objB){
					"Posiçao central do objeto a" - "Posição central do objeto b"
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
					"Posiçao central do objeto a" - "Posição central do objeto b"
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);
		var sumWidth = (objA.width + objB.width)/2;
		var sumHeight = (objA.height + objB.height)/2;
		//console.log("Distx: " + Math.abs(distX) + ", sumWidth: " + sumWidth + ", disY: " + distY + ", sumHeight: " + sumHeight);
		//Math.abs = retorna o valor absoluto de um valor, ignorando o sinal que o acompanha
		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			var overlapX = sumWidth - Math.abs(distX);//Retorna o quanto um objeto invadiu o espaço do outro
			var overlapY = sumHeight - Math.abs(distY);//Retorna o quanto um objeto invadiu o espaço do outro
			
			if(overlapX > overlapY){//significa que a invasão ocorreu em cima ou a baixo do objeto
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY ;
			}else{
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX ;
			}
		}
	}
	
	//Responsavel pela renderização
	function render(){
					  "Origem x, origem y, largura tela, altura tela"
		ctx.clearRect(0,0, WIDTH, HEIGHT);//Limpa todo o canvas
		
		ctx.save();//Salva o estado atual do contexto
		
		//Esses laços for encadeados são responsaveis por criar os tiles do jogo a partir dos dados da matriz maze
		for(var row in maze){
			for(var column in maze[row]){
				var tile = maze[row][column];
				if(tile == 1){
					var x = column*dimensao;
					var y = row*dimensao;
								"(cordenada X, cordenada Y, dimensao, dimensao)"
					ctx.fillRect(x,y,dimensao,dimensao);//Adiciona um retangulo no contexto
				}
			}
		}
		
		ctx.fillStyle = "red";//Altera a cor do contexto
		ctx.fillRect(player.x,player.y,player.width,player.height);//Adiciona um retangulo no contexto
		ctx.restore();//Restaura o contexto para o estado antes do salvamento
	}
	
	//Responsavel pelo loop indefinido
	function loop(){
		update();
		render();
		window.requestAnimationFrame(loop, cnv);//Responsavel pelo loop
	}
	window.requestAnimationFrame(loop, cnv);//Primeira chamada para a realização do loop
	
}());