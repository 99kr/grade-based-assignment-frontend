import { addFavorite, isFavorite, mapRawCocktailData, removeFavorite } from '../utilities.js'

export default async function DetailPage(cocktailId) {
    const cocktail = await getCocktailFromId(cocktailId)
    let favorited = isFavorite(cocktailId)

    const instructions = cocktail.instructions.split('.')
    if (instructions[instructions.length - 1].trim() === '') {
        instructions.pop()
    }

    const detailPage = html`
        <div class="flex gap-16">
            <div class="flex flex-col gap-8">
                <div>
                    <p class="text-zinc-400">${cocktail.category}</p>
                    <div class="flex justify-between w-full">
                        <h1 class="text-4xl">${cocktail.name}</h1>
                        <button id="favorite-btn" class="btn px-2 py-0 ${favorited ? 'btn-primary' : ''}">
                            <span class="material-symbols-rounded text-xl">star</span>
                        </button>
                    </div>
                </div>

                <img src="${cocktail.thumbnail}" alt="${cocktail.name}" class="size-96 rounded-md" />

                <ul class="flex flex-wrap gap-2 max-w-96">
                    ${cocktail.tags.map(Tag).join('')}
                </ul>
            </div>

            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Ingredients</h2>
                    <ul class="flex flex-col gap-2 list-disc list-inside">
                        ${cocktail.ingredients.map(Ingredient).join('')}
                    </ul>
                </div>

                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Instructions</h2>
                    <ul class="flex flex-col gap-2 list-disc list-inside">
                        ${instructions.map(Instruction).join('')}
                    </ul>
                </div>

                <div class="flex flex-col gap-2">
                    <h2 class="text-2xl">Served with</h2>
                    <p class="text-zinc-200">${cocktail.glass}</p>
                </div>
            </div>
        </div>
    `

    mainElement.innerHTML = detailPage

    const favoriteButton = mainElement.querySelector('#favorite-btn')
    favoriteButton.onclick = () => {
        if (favorited) {
            favorited = false
            removeFavorite(cocktailId)
            favoriteButton.classList.remove('btn-primary')
        } else {
            favorited = true
            addFavorite(cocktail)
            favoriteButton.classList.add('btn-primary')
        }
    }
}

function Tag(text) {
    return html`<li class="bg-zinc-600 text-zinc-100 px-4 rounded-full text-sm">${text}</li>`
}

function Ingredient(ingredient) {
    return html`
        <li class="text-zinc-200 pl-2">
            ${ingredient.ingredient} ${ingredient.measure ? `(${ingredient.measure.trimEnd()})` : ''}
        </li>
    `
}

function Instruction(instruction) {
    return html`<li class="text-zinc-200 pl-2">${instruction}</li>`
}

async function getCocktailFromId(cocktailId) {
    try {
        const cocktail = await fetch(BASE_URL + `/lookup.php?i=${cocktailId}`).then((response) => response.json())
        return mapRawCocktailData(cocktail.drinks[0])
    } catch {
        mainElement.innerHTML = html`<p class="text-zinc-400">Cocktail not found</p>`
    }
}
