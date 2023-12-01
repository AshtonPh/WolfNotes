import '@material/web/button/text-button'
const connectionBanner = document.getElementById('connection-banner');

async function testOnline() {
    let onlineReq = await fetch('/api/online');
    let online = await onlineReq.json();
    if (online.check) {
        connectionBanner.classList.add('open');
    }
    else {
        connectionBanner.classList.remove('open');
    }
    setTimeout(testOnline, 5000);
}

testOnline();