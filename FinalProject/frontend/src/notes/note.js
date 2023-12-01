import * as ns from '../common/js/noteState';

let nextBtn = document.querySelector('#next-btn');
let prevBtn = document.querySelector('#prev-btn');

let editors = document.querySelectorAll('.editor');
let activeNote = editors.length - 1;

let slide_length

let params = new URLSearchParams(document.location.search);
var noteId = params.get("noteid"); 

ns.getNote(noteId).then(note => {
	slide_length = note.slideCount -1;
	console.log(slide_length);

	nextBtn.addEventListener('click', () => {
		activeNote++;
	
		if (activeNote > slide_length) {
			activeNote = 0;
		}
		if (!document.querySelector('#editor' + (activeNote))) {
			addNote();
		}
		updateActiveNote();
	});
	
	prevBtn.addEventListener('click', () => {
		activeNote--;
		if (activeNote < 0) {
			activeNote = slide_length;
		}
		if (!document.querySelector('#editor' + (activeNote))) {
			addNote();
		}
		updateActiveNote();
	});
	
	
	tinymce.init({
		selector: '.edit-content',
		inline: true,
		plugins: 'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
		toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
		branding: false
	});
 
  })
  .catch(error => {
	// Handle any errors that occurred during the Promise
	console.error(error);
  });




function addNote()
{
	let outerDiv = document.querySelector('.edit-content');

	let newDiv = document.createElement('div');
	newDiv.className = 'slide-note fade';

	let newEditor = document.createElement('div');
	newEditor.className = 'editor';
	newEditor.contentEditable = true;

	newEditor.id = 'editor' + activeNote;

	newDiv.appendChild(newEditor);
	outerDiv.appendChild(newEditor);
}



function updateActiveNote() {
	editors = document.querySelectorAll('.editor');
	editors.forEach((editor) => {
	editor.contentEditable = false;
	if (editor.id !== 'editor' + activeNote) {
	 editor.setAttribute('hidden', '');
	} else {
	 editor.removeAttribute('hidden');
	}
	});
	document.querySelector('#editor' + activeNote).contentEditable = true;
}





