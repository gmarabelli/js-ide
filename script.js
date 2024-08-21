function play(){
	debug.style.backgroundColor = "#fff";
	debug.innerText = "";
	eval?.("'use strict';\n" + program.value);
}
run.addEventListener("click", play);
window.addEventListener("error", (e) => {
	debug.style.backgroundColor = "#f66";
	let code = program.value.split("\n")[e.lineno - 2];
	let tabNum = countChar(code.substring(0, e.colno), "\t");
	debug.innerText = (e.lineno - 1).toString().padStart(4, ' ') + ": " + code.replace(/\t/g, "        ") + "\n      " + " ".repeat((e.colno - 1) + (tabNum * 7)) + "^\n" + e.message;
});

function download(){
	var fileContent = "<script>\n	" + program.value.replace(/\n/g, "\n	") + "\n<\/script>";
	var bb = new Blob([fileContent ], { type: 'text/plain' });
	let fileName = (title.value == "" ? "script" : title.value);

	var a = document.createElement('a');
	a.download = fileName + ".html";
	a.href = window.URL.createObjectURL(bb);
	a.click();
	a.remove();
}
save.addEventListener("click", download);

document.getElementById('upload_input').addEventListener("change", async (e) => {
	const file = e.target.files[0];
	await loadFile(file);
	e.target.value = "";
});
async function loadFile(file){
	let content = await file.text();
	if(!file.name.match(/\.html$/) || !content.match(/^<script>/) || !content.match(/<\/script>$/)){
		alert("È possibile caricare solo file HTML contenenti unicamente un tag '<script>'.");
		return;
	}

	title.value = file.name.replace(/\.html$/, "");
	content = content.replaceAll(/\n\t/g, "\n")
		.replace(/^<script>\n/, "")
		.replace(/\n<\/script>$/, "");
	program.value = content;
	adaptIDE();
}

program.addEventListener("input", () => {
	adaptIDE();
});
function adaptIDE(){
	const rows = program.value.split("\n")
	const rowNum = rows.length;
	line_numbers.style.height = program.style.height = (rowNum * 16) + "px";
	line_numbers.innerText = "1";
	let rowMaxLen = rowLength(rows[0]);
	for(let i = 1; i < rowNum; i++){
		line_numbers.innerText += `\n${i + 1}`;
		if(rowMaxLen < rowLength(rows[i])){
			rowMaxLen = rowLength(rows[i]);
		}
	}
	program.style.width = (rowMaxLen * 8) + "px";
	putMarker();
}
function putMarker(){
	line_marker.style.top = (countChar(program.value.substring(0, program.selectionStart), "\n") * 16) + "px";
	line_marker.style.height = ((countChar(program.value.substring(program.selectionStart, program.selectionEnd), "\n") + 1) * 16) + "px";
}
document.addEventListener("selectionchange", putMarker);
function countChar(string, char){
	let numLines = 0;
	for(let i = 0; i < string.length; i++){
		if(string[i] === char){
			numLines++;
		}
	}
	return numLines;
}
function rowLength(string){
	return string.length + (countChar(string, "\t") * 7);
}

document.addEventListener("keydown", e => {
	if(e.ctrlKey){
		switch(e.key){
			case "s":
				e.preventDefault();
				download();
				break;
			case "e":
				e.preventDefault();
				play();
				break;
			case "o":
				e.preventDefault();
				upload_input.click();
				break;
		}
	}
});
document.addEventListener("drop", async (e) => {
	e.preventDefault();
	if(e.dataTransfer.files.length == 0){
		alert("È possibile caricare solo file HTML contenenti unicamente un tag '<script>'.");
		return;
	}
	const file = e.dataTransfer.files[0];
	await loadFile(file);
});
program.addEventListener("keydown", e => {
	if(e.key === "Tab"){
		e.preventDefault();
		const start = program.selectionStart;
		const end = program.selectionEnd;
		program.value = program.value.substring(0, start) + "\t" + program.value.substring(end);
		program.selectionStart = start + 1;
		program.selectionEnd = start + 1;
		adaptIDE();
	}
});