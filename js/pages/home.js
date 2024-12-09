import { openDetailPage, openHomePage } from '../index.js'
import { addFavorite, isFavorite, mapRawCocktailData, removeFavorite } from '../utilities.js'

const mainElement = document.querySelector('main')

export default async function HomePage() {
    const randomCocktail = await getRandomCocktail()
    let favorited = isFavorite(randomCocktail.id)

    const html = `
    <div class="flex flex-col gap-4 items-center">
        <h1 class="text-2xl">${randomCocktail.name}</h1>
        <img src="${randomCocktail.thumbnail}" alt="${randomCocktail.name}" class="size-96 rounded-md" />
        <div class="flex gap-2">
            <button id="see-more" class="btn-primary">See more</button>
            <button id="refresh" class="btn">I want another one</button>
            <button id="favorite-btn" class="btn px-2 py-0 ${favorited ? 'btn-primary' : ''}">
                <span class="material-symbols-rounded text-xl">star</span>
            </button>
        </div>
    </div>`

    mainElement.innerHTML = html

    mainElement.querySelector('#refresh').addEventListener('click', openHomePage)
    mainElement.querySelector('#see-more').addEventListener('click', () => {
        openDetailPage(randomCocktail.id)
    })

    const favoriteButton = mainElement.querySelector('#favorite-btn')
    favoriteButton.onclick = () => {
        if (favorited) {
            favorited = false
            removeFavorite(randomCocktail.id)
            favoriteButton.classList.remove('btn-primary')
        } else {
            favorited = true
            addFavorite(randomCocktail)
            favoriteButton.classList.add('btn-primary')
        }
    }
}

async function getRandomCocktail() {
    const randomCocktail = await fetch(BASE_URL + '/random.php').then((response) => response.json())
    return mapRawCocktailData(randomCocktail.drinks[0])
}
