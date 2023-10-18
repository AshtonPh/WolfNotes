import '@material/web/button/filled-button'

const imgContainer = document.querySelector('#img-container')


for (let i = 1; i < 16; i++) {
    const img = document.createElement('img')
    img.src = "../note/images/" + i.toString() + ".jpg";
    img.style = "width: 100%"
    imgContainer.appendChild(img)
}
