let pstate = {
	brand_text: true,
	eyes_and_errs: false,
	bracket_text: true,
	photo_squares: false,
};

let frameCount = 0;

let faceapi;
let image_bank = [];
let action_bank = [];
let pics_count = 76;
let action_count = 13;
let mo_font;
let processed = 0;

let facepart_inst = [];
let errpart_inst = [];
let showing_parts = false;

let eyes = [];
let error_bank = [];


let spacing;
let selected_func;

let photo_funcs = [photoA,photoB,photoC,photoD,photoE,photoF,photoG,photoH];

let loading_text = 'LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING LOADING ';
let mo_text = 'MOWDER OYAL MOWDER OYAL MOWDER OYAL MOWDER OYAL MOWDER OYAL MOWDER OYAL MOWDER OYAL ';
let text_active = loading_text;
let current_font = 'Arial'


const detection_options = {
	withLandmarks: true,
	withDescriptors: true,
	minConfidence: 0.1,

}


let action_selection = null;


function preload() {
  mo_font = loadFont('assets/fonts/UnifrakturMaguntia-Regular.ttf');


	for (let i = 0; i<pics_count; i++) {
		image_bank[i] = loadImage('assets/faces/'+i+'.jpg')
	}

	
	for(let i = 1; i<=action_count; i++){
		action_bank[i] = loadImage('assets/moaction/'+i+'.jpg');
	}
	
	
}

function setup() {
  createCanvas(1280, 720);
  frameRate(5);
  createCanvas(windowWidth-20,windowHeight-20)
  spacing = random(.55,.85);
  //selected_func = random(photo_funcs);


	  for (let i = 0; i<pics_count; i++) {
			image_bank[i].resize(width,0);
		}
	
		faceapi = ml5.faceApi(detection_options, model_ready);


	
		for(let i = 1; i<=action_count; i++){
			action_bank[i].resize(width,height);
		}
	

	main_controller();
  
}


/*

██████╗░██╗░░░██╗███╗░░██╗  ███╗░░░███╗██╗░░░░░███████╗
██╔══██╗██║░░░██║████╗░██║  ████╗░████║██║░░░░░██╔════╝
██████╔╝██║░░░██║██╔██╗██║  ██╔████╔██║██║░░░░░██████╗░
██╔══██╗██║░░░██║██║╚████║  ██║╚██╔╝██║██║░░░░░╚════██╗
██║░░██║╚██████╔╝██║░╚███║  ██║░╚═╝░██║███████╗██████╔╝
╚═╝░░╚═╝░╚═════╝░╚═╝░░╚══╝  ╚═╝░░░░░╚═╝╚══════╝╚═════╝░
*/


function model_ready(){
	console.log('ready!');

	for (let i = 0; i<pics_count; i++) {
		faceapi.detectSingle(image_bank[i])
		.then((results) => {
			if(results == null) {
			} else {
				make_eyes(results,image_bank[i]);
				processed++
			}
		})
		.catch((err) => {
			error_bank.push(image_bank[i]);
			processed++
		})
	}

}






function make_eyes(detections,img) {
	let img_width = detections.detection._imageDims._width;
	let img_height = detections.detection._imageDims._height

	let mask = createGraphics(img_width,img_height);

	mask.noStroke();
	mask.fill(0);

	//left eye
	mask.beginShape();
	detections.parts.leftEye.forEach(item=>{
		mask.vertex(item._x, item._y);
	});
	mask.endShape(CLOSE);

	//right eye
	mask.beginShape();
	detections.parts.rightEye.forEach(item=>{
		mask.vertex(item._x, item._y);
	});
	mask.endShape(CLOSE);

	img.mask(mask);

	eyes.push(img);


}





/*

██████╗░██████╗░░█████╗░░██╗░░░░░░░██╗
██╔══██╗██╔══██╗██╔══██╗░██║░░██╗░░██║
██║░░██║██████╔╝███████║░╚██╗████╗██╔╝
██║░░██║██╔══██╗██╔══██║░░████╔═████║░
██████╔╝██║░░██║██║░░██║░░╚██╔╝░╚██╔╝░
╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░

*/


function draw() {

	background(255);
	main_controller();

	if(pstate.photo_squares == true) {
		photo_squares();
	}
	if(pstate.eyes_and_errs == true) {
		eyes_and_errs();
	}



	
	if(pstate.brand_text == true) {
		brand_text();
	}

	if(pstate.bracket_text == true) {
		bracket_text();
	}


	frameCount++;
}



/********************
 * 

██╗░░░░░██╗██████╗░██████╗░░█████╗░██████╗░██╗░░░██╗
██║░░░░░██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗░██╔╝
██║░░░░░██║██████╦╝██████╔╝███████║██████╔╝░╚████╔╝░
██║░░░░░██║██╔══██╗██╔══██╗██╔══██║██╔══██╗░░╚██╔╝░░
███████╗██║██████╦╝██║░░██║██║░░██║██║░░██║░░░██║░░░
╚══════╝╚═╝╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░
 * 
********************/


function eyes_and_errs(){
	if(facepart_inst.length > 25) {
		facepart_inst.shift();
	}

	if(errpart_inst.length > 25) {
		errpart_inst.shift();
	}

	if(processed == pics_count) {

			if(facepart_inst.length == 0) {
				create_part(2)
			}

			if(errpart_inst.length == 0) {
				create_errpart(1);
			}


			if(errpart_inst.length > 0) {
				for(let i = 0; i<errpart_inst.length; i++) {
					//console.log(errpart_inst[i])
					errpart_inst[i].display();
					errpart_inst[i].increment();
				}
				create_errpart(1);
			}

			if(facepart_inst.length > 0) {
				for(let i = 0; i<facepart_inst.length; i++) {
					//console.log(fa a	cepart_inst[i]);
					facepart_inst[i].display();
					facepart_inst[i].increment();
				}
				create_part(1);
			}

			
	}

}












function brand_text() {
	push();
	fill(0);
	noStroke();
	textFont(mo_font);
	textSize(80);
	textAlign(CENTER);
	text('Mowder Oyal',width/2,height/2);
	pop();
}





function bracket_text() {

	if(frameCount % 10 == 0){
    text_active = replace_char(text_active);
	}

	if(frameCount % 40 == 0){
    current_font = change_font();
	}

	if(frameCount % 1000 == 0){
    text_active = mo_text;
	}


	push();
	fill(0);
	noStroke();
	textFont(current_font);
	textSize(30);
	text(text_active,10,40);
	text(text_active,10,height-20)
	pop();
}

function change_font() {
	let font_choice = random(['Arial','Wingdings']);
	return font_choice;
}


function replace_char(text) {
	let text_orig = mo_text;
	let text_curr = text;
	let replacements = 'vlmnDALMNO>:';
	replacements = replacements.split("");

	let rand = random();
	if(rand < .5) {
		let i = int(random(0,text_orig.length));
		//text_curr = text_curr.replaceAt(i,text_orig[i])
	} else {
		text_curr = text_curr.replaceAt(random(text_orig.length-1),random(replacements))
	}

	return text_curr
}

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
}














let action_spiral = 8;

function photo_squares() {
	if(frameCount % 15== 0){
    action_selection = random(action_bank);
    spacing = random(.50,.75);
    action_spiral = round(random(3,8))
	}

	if(action_selection) {
		display_photos(action_spiral,action_selection)
	} else {
		action_selection = random(action_bank);
	}
}


function photoA(img){
	image(img,-width*spacing,-height*spacing);
}

function photoB(img){
	image(img,width*.25,-height*spacing,width*.5,0)
}

function photoC(img){
	image(img,width*spacing,-height*spacing);
}

function photoD(img){
	image(img,width*spacing,height*.25,0,height*.5)
}

function photoE(img){
	image(img,width*spacing,height*spacing);
}

function photoF(img){
	image(img,width*.25,height*spacing,width*.5,0)
}

function photoG(img){
	image(img,-width*spacing,height*spacing);
}

function photoH(img){
	image(img,-width*spacing,height*.25,0,height*.5)
}

function display_photos(n,img) {

	if(frameCount % 15== 0){
		selected_func = getRandomSubarray(photo_funcs,n)
	}

	for(let i = 0; i<selected_func.length; i++) {
		selected_func[i](img);
	}

}


function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}










/*

░█████╗░██╗░░░░░░█████╗░░██████╗░██████╗███████╗░██████╗
██╔══██╗██║░░░░░██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝
██║░░╚═╝██║░░░░░███████║╚█████╗░╚█████╗░█████╗░░╚█████╗░
██║░░██╗██║░░░░░██╔══██║░╚═══██╗░╚═══██╗██╔══╝░░░╚═══██╗
╚█████╔╝███████╗██║░░██║██████╔╝██████╔╝███████╗██████╔╝
░╚════╝░╚══════╝╚═╝░░╚═╝╚═════╝░╚═════╝░╚══════╝╚═════╝░

*/

class FacePart {
	constructor(img) {
		this.x = random(-width/2,width/2);
		this.y = random(-height,height/2);


		this.graphic = random(eyes);
		this.longevity = 0;

	}


	display() {
		if(showing_parts == false) {
			showing_parts = true;
			//console.log('now showing faceparts')
		}
		
		if(this.longevity < 300) {
			image(this.graphic,this.x,this.y);
		}
		

	}

	increment() {
		this.longevity++;
	}


}

class ErrPart {
	constructor(img) {
		this.x = random(-100,width);
		this.y = random(-100,height);


		this.graphic = random(error_bank);
		this.graphic.resize(100,0)
		this.longevity = 0;
		//console.log(this.graphic)

	}


	display() {
	
		
		if(this.longevity < 300) {
			image(this.graphic,this.x,this.y);
			push()
			noFill();
			stroke(0);
			strokeWeight(5);
			line(this.x,this.y,this.x+this.graphic.width,this.y+this.graphic.height);
			line(this.x,this.y+this.graphic.height,this.x+this.graphic.width,this.y);
			pop();
		}
		

	}

	increment() {
		this.longevity++;
	}


}







function create_part(n,img) {
	for(let i = 0; i<n; i++) {
		let p = new FacePart();
		facepart_inst.push(p);
	}
}

function create_errpart(n,img) {

	for(let i = 0; i<n; i++) {
		let p = new ErrPart();
		errpart_inst.push(p);
	}
}


/*
░██████╗░█████╗░██████╗░░█████╗░████████╗░█████╗░██╗░░██╗
██╔════╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗██║░░██║
╚█████╗░██║░░╚═╝██████╔╝███████║░░░██║░░░██║░░╚═╝███████║
░╚═══██╗██║░░██╗██╔══██╗██╔══██║░░░██║░░░██║░░██╗██╔══██║
██████╔╝╚█████╔╝██║░░██║██║░░██║░░░██║░░░╚█████╔╝██║░░██║
╚═════╝░░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░░╚════╝░╚═╝░░╚═╝
*/


function main_controller(){

	if((processed < pics_count)) {
		pstate.brand_text = true;
		pstate.eyes_and_errs = false;
		pstate.photo_squares = false;
		pstate.bracket_text = true

		//text_active = loading_text;
	} else {

		if(frameCount > 300 && frameCount < 1000) {
			pstate.eyes_and_errs = true;
			//console.log('turn eyes and errs on')
		} 
		
		if(frameCount > 400) {

			if(frameCount % 120 == 0) {
				for(prop in pstate) {
					let random_boolean = Math.random() < .5;
					pstate[prop] = random_boolean;
				}
				console.log(pstate)
			}

		}

		




	}


}


