function play(){
	let program = document.getElementById("program");
	try{
		eval?.(program.value);
	}catch(error){
		console.log(error);
	}
}

function download(){
	var fileContent = "<script>\n	" + program.value.replace(/\n/g, "\n	") + "\n<\/script>";
	var bb = new Blob([fileContent ], { type: 'text/plain' });
	let fileName = (title.value == "" ? "page" : title.value);

	var a = document.createElement('a');
	a.download = fileName + ".html";
	a.href = window.URL.createObjectURL(bb);
	a.click();
	a.remove();
}
document.addEventListener('keydown', e => {
	if(e.ctrlKey && e.key === 's'){
		e.preventDefault();
		download();
	}
});

document.getElementById('upload-input').addEventListener('change', async (event) => {
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