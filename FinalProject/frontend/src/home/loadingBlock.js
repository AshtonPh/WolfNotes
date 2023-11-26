const loadingBlock = document.getElementById('loading-block');

export function show() {
    loadingBlock.classList.add('showing');
}

export function hide() {
    loadingBlock.classList.remove('showing');
}