import DetailPage from './pages/detail.js'
import FavoritesPage from './pages/favorites.js'
import HomePage from './pages/home.js'
import SearchPage from './pages/search.js'
import { loading } from './utilities.js'

globalThis.BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'
globalThis.mainElement = document.querySelector('main')
globalThis.html = String.raw

const navItems = document.querySelector('nav ul')

navItems.addEventListener('click', ({ target }) => {
    if (target.tagName !== 'LI') {
        if (target.tagName !== 'IMG') return

        // if we click on the logo, set target to the parent li
        target = target.parentElement
    }

    // only allow (home, search, favorites) pages to be opened
    const page = target.dataset.opens
    if (!page || !['home', 'search', 'favorites'].includes(page)) return

    if (page === 'home') {
        openHomePage()
    } else if (page === 'search') {
        openSearchPage()
    } else if (page === 'favorites') {
        openFavoritesPage()
    }

    // remove currently active link(s), and then add "active" to the clicked link(s)
    removeActiveNav()
    navItems.querySelectorAll(`li[data-opens="${page}"]`).forEach((item) => item.classList.add('active'))
})

function removeActiveNav() {
    navItems.querySelectorAll('li.active').forEach((item) => item.classList.remove('active'))
}

export async function openHomePage() {
    loading()
    await HomePage()
}

export async function openDetailPage(cocktailId) {
    removeActiveNav()
    loading()
    await DetailPage(cocktailId)
}

function openSearchPage() {
    SearchPage()
}

function openFavoritesPage() {
    FavoritesPage()
}

openHomePage()
