const editor = document.getElementById('editor');


// editor section
function format(command, value) {
	document.execCommand(command, false, value);
}

function changeFont() {
	const Font = document.getElementById('input-font').value;
	document.execCommand('fontName', false, Font);
}

function changeSize() {
	const size = document.getElementById('fontSize').value;
	document.execCommand('fontSize', false, size);
}

