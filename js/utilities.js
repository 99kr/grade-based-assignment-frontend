/**
 * Då json-objektet som representerar en cocktail är lite
 * halvtokigt utformat av de som utvecklat API:et, så har ni
 * här en hjälpfunktion som konverterar den halvtoiga datan
 * till ett mer lättarbetat objekt istället. Bortrensat är
 * alla ingredienser och measures som är null samt ett antal
 * attribut som ni inte kommer att han någon användning för.
 */
export function mapRawCocktailData(rawCocktial) {
    return {
        id: rawCocktial.idDrink,
        name: rawCocktial.strDrink,
        tags: rawCocktial.strTags ? rawCocktial.strTags.split(',') : [],
        category: rawCocktial.strCategory,
        alcoholic: rawCocktial.strAlcoholic === 'Alcoholic',
        glass: rawCocktial.strGlass,
        instructions: rawCocktial.strInstructions,
        thumbnail: rawCocktial.strDrinkThumb,
        ingredients: Array.from({ length: 15 })
            .map((_, i) => ({
                ingredient: rawCocktial[`strIngredient${i + 1}`],
                measure: rawCocktial[`strMeasure${i + 1}`],
            }))
            .filter((item) => item.ingredient),
    }
}

export function createLoader() {
    return `
    <div class="flex justify-center items-center h-full">
        <span class="material-symbols-rounded animate-spin text-6xl text-zinc-300">progress_activity</span>
    </div>`
}

const mainElement = document.querySelector('main')
export function loading() {
    mainElement.innerHTML = createLoader()
}

/**
 * @returns {{id: string, name: string, thumbnail: string}[]}
 */
export function getAllFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) ?? []
}

export function addFavorite(cocktail) {
    const favorites = getAllFavorites()
    favorites.push({ id: cocktail.id, name: cocktail.name, thumbnail: cocktail.thumbnail })
    localStorage.setItem('favorites', JSON.stringify(favorites))
}

export function removeFavorite(id) {
    const favorites = getAllFavorites()
    const index = favorites.findIndex((item) => item.id === id)
    if (index === -1) return

    favorites.splice(index, 1)
    localStorage.setItem('favorites', JSON.stringify(favorites))
}

export function isFavorite(id) {
    const favorites = getAllFavorites()
    const index = favorites.findIndex((item) => item.id === id)

    return index !== -1
}
