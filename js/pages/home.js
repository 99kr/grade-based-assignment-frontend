import { openDetailPage, openHomePage } from '../index.js'
import { mapRawCocktailData } from '../utilities.js'

const mainElement = document.querySelector('main')

export default async function HomePage() {
    const randomCocktail = await getRandomCocktail()

    const html = `
    <div class="flex flex-col gap-4 items-center">
        <h1 class="text-2xl">${randomCocktail.name}</h1>
        <img src="${randomCocktail.thumbnail}" alt="${randomCocktail.name}" class="size-96 rounded-md" />
        <div class="flex gap-2">
            <button id="see-more" class="btn-primary">See more</button>
            <button id="refresh" class="btn">I want another one</button>
        </div>
    </div>`

    mainElement.innerHTML = html

    mainElement.querySelector('#refresh').addEventListener('click', openHomePage)
    mainElement.querySelector('#see-more').addEventListener('click', () => {
        openDetailPage(randomCocktail.id)
    })
}

async function getRandomCocktail() {
    const randomCocktail = await fetch(BASE_URL + '/random.php').then((response) => response.json())
    return mapRawCocktailData(randomCocktail.drinks[0])
}
