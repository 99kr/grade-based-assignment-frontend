import HomePage from './pages/home.js'
import { loading } from './utilities.js'

globalThis.BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1'

async function main() {
    loading()
    await HomePage()
}

main()
