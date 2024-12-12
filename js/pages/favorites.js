import { openDetailPage } from '../index.js'
import { getAllFavorites, removeFavorite } from '../utilities.js'

export default function FavoritesPage() {
    const favorites = getAllFavorites()

    const favoritesPage = html`
        <div class="flex flex-col gap-4">
            <h1 class="text-2xl">Favorites</h1>
            <ul id="favorites" class="flex flex-col gap-2">
                ${favorites.map(createFavorite).join('')}
            </ul>
        </div>
    `

    mainElement.innerHTML = favoritesPage

    const favoritesElement = mainElement.querySelector('#favorites')
    favoritesElement.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            if (!event.target.dataset.id) return
            const id = event.target.dataset.id
            removeFavorite(id)

            favoritesElement.removeChild(event.target.parentElement)
            return
        }

        if (event.target.tagName !== 'LI') return
        if (!event.target.dataset.id) return

        openDetailPage(event.target.dataset.id)
    })
}

function createFavorite(cocktail) {
    return html`
        <li class="flex justify-between hover:bg-zinc-700 rounded-md p-2 cursor-pointer" data-id="${cocktail.id}">
            <div class="flex items-center gap-4 pointer-events-none">
                <img
                    src="${cocktail.thumbnail}"
                    alt="${cocktail.name}"
                    class="size-10 rounded-md pointer-events-none"
                />

                <p class="text-lg pointer-events-none">${cocktail.name}</p>
            </div>

            <button class="btn-danger px-2 py-0" data-id="${cocktail.id}">
                <span class="material-symbols-rounded text-xl pointer-events-none">delete</span>
            </button>
        </li>
    `
}
