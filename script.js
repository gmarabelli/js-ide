run.addEventListener("click", play);
window.addEventListener("error", (e) => {
	debug.style.backgroundColor = "#f66";
	debug.innerText = (e.lineno - 1).toString().padStart(4, ' ') + ": " + program.value.split("\n")[e.lineno - 2] + "\n      " + " ".repeat(e.colno - 1) + "^\n" + e.message;
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

document.getElementById('upload_input').addEventListener('change', async (event) => {
	let file = event.target.files[0];
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
});

program.addEventListener("input", () => {
	const rows = program.value.split("\n")
	const rowNum = rows.length;
	line_numbers.style.height = program.style.height = (rowNum * 16) + "px";
	line_numbers.innerText = "1";
	let rowMaxLen = rows[0].length;
	for(let i = 1; i < rowNum; i++){
		line_numbers.innerText += `\n${i + 1}`;
		if(rowMaxLen < rows[i].length){
			rowMaxLen = rows[i].length;
		}
	}
	program.style.width = (rowMaxLen * 8) + "px";
	putMarker();
});
function putMarker(){
	const stringBefore = program.value.substring(0, program.selectionStart);
	const stringSelected = program.value.substring(program.selectionStart, program.selectionEnd);
	line_marker.style.top = (countLines(stringBefore) * 16) + "px";
	line_marker.style.height = ((countLines(stringSelected) + 1) * 16) + "px";
}
document.addEventListener("selectionchange", putMarker);
function countLines(string){
	let numLines = 0;
	for(let i = 0; i < string.length; i++){
		if(string[i] === "\n"){
			numLines++;
		}
	}
	return numLines;
}

document.addEventListener("keydown", e => {
	if(e.ctrlKey){
		switch(e.key){
			case "s":
				e.preventDefault();
				download();
				break;
			case "r":
				e.preventDefault();
				play();
				break;
			case "o":
				e.preventDefault();
				upload_input.focus;
				break;
		}
	}
});
program.addEventListener("keydown", e => {
	if(e.key === "Tab"){
		e.preventDefault();
		const start = program.selectionStart;
		const end = program.selectionEnd;
		program.value = program.value.substring(0, start) + "\t" + program.value.substring(end);
		program.selectionStart = start + 1;
		program.selectionEnd = start + 1;
	}
});