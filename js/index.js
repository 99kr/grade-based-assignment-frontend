import HomePage from './pages/home.js'
import { loading } from './utilities.js'

globalThis.BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

const navItems = document.querySelector('nav ul')
navItems.addEventListener('click', (event) => {
    let target = event.target
    if (target.tagName !== 'LI') {
        if (target.tagName !== 'IMG') return

        // if we click on the logo, set target to the parent li
        target = target.parentElement
    }

    // only allow (home, search) pages to be opened
    const page = target.dataset.opens
    if (!page || !['home', 'search'].includes(page)) return

    if (page === 'home') {
        openHomePage()
    } else if (page === 'search') {
        // TODO
        //openSearchPage()
    }
})

async function openHomePage() {
    loading()
    await HomePage()
}

openHomePage()
