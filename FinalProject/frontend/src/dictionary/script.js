
document.getElementById('dictionaryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var term = document.getElementById('term').value;
    var definition = document.getElementById('definition').value;
    if (term && definition) {
        var li = document.createElement('li');
        li.textContent = term + ': ' + definition;
        document.getElementById('dictionaryList').appendChild(li);
        document.getElementById('term').value = '';
        document.getElementById('definition').value = '';
    }
 });
 