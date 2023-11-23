// Material design components
import '@material/web/tabs/primary-tab'
import '@material/web/tabs/tabs'
import '@material/web/iconbutton/icon-button'
import '@material/web/icon/icon'
import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/chips/chip-set'
import '@material/web/chips/filter-chip'
import '@material/web/chips/input-chip'
import '@material/web/chips/assist-chip'
import '@material/web/textfield/outlined-text-field'
import '@material/web/textfield/filled-text-field'
import '@material/web/menu/menu'
import '@material/web/menu/menu-item'
import '@material/web/ripple/ripple'
import '@material/web/button/filled-tonal-button'
import '@material/web/button/filled-button'
import '@material/web/button/text-button'
import '@material/web/dialog/dialog'
import '@material/web/fab/fab'
import '@material/web/checkbox/checkbox'

// My own scripts
import './deleteDialog';
import './newPropertiesDialog';
import './noteItems';
import './noteMenu';
import './sortAndFilter';
import './userMenu';

const main = document.getElementsByTagName('main')[0];
const body = document.getElementsByTagName('body')[0];
let scrollDebounce;
main.onscroll = (ev) => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(() => {
        if (main.scrollTop > 40) {
            if (!body.classList.contains("scrolled"))
                body.classList.add("scrolled");
        }
        else if (body.classList.contains("scrolled")) {
            body.classList.remove("scrolled");
        }
    }, 20)
}
