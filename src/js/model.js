import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';
import { getJson, sendJson } from './helpers.js';
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};
const createRecipeObject = function (recipe) {
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        bookmarked: false,
        ...(recipe.key && { key: recipe.key })
    };
};
export const loadRecipe = async function (id) {
    try {
        if (state.bookmarks.some(r => r.id === id)) {
            state.recipe = state.bookmarks.find(r => r.id === id);
            state.recipe.bookmarked = true;
            return;
        }
        const data = await getJson(`${API_URL}/${id}`);
        let { recipe } = data.data
        state.recipe = createRecipeObject(recipe);
        // console.log(recipe);
    } catch (error) {
        // alert(error);
        console.error(error);
        throw error;
    }
};

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;
        const data = await getJson(`${API_URL}?search=${query}&key=${API_KEY}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });

    } catch (error) {
        throw error;
    }
};

export const getResultsPerPage = function (page = 1) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);

    });
    state.recipe.servings = newServings;
};
export const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    persistBookmarks();
};
export const removeBookmark = function (id) {
    const idx = state.bookmarks.findIndex(r => r.id === id);
    state.bookmarks.splice(idx, 1);
    if (id === state.recipe.id)
        state.recipe.bookmarked = false;
    persistBookmarks();
};
export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) throw Error('Wrong Ingredient Format');
                const [quantity, unit, description] = ingArr;
                return { quantity: quantity ? +quantity : null, unit, description };
            });
        const recipeToUpdata = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        const { data } = await sendJson(`${API_URL}?key=${API_KEY}`, recipeToUpdata);
        state.recipe = createRecipeObject(data.recipe);
        addBookmark(state.recipe);
    } catch (error) {
        throw error;
    }
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clear = function () {
    localStorage.clear('bookmarks');
};
// clear();