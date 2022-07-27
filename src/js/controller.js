import { async } from "regenerator-runtime";
import * as model from "./model.js";
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from "./config.js";
import searchView from './views/searchView';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import recipeView from "./views/recipeView.js";
// import resultView from "./views/resultsView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView.js";



// password api "3d7f0de4-bf10-42ed-9ff6-6fdf57130d46"
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipes =  async function(){
  try {
    const id =  window.location.hash.slice(1)
    console.log(window.location.hash); 
    // const id ="5ed6604591c37cdc054bcc13"
    if(!id) return

    // 0 update results view to marke selected search result
    resultsView.update(model.getSearchResultsPage())
    // 1 updating bookmarking
    bookmarksView.update(model.state.bookmarks)
    
    //2 loading recipe
    recipeView.renderSpinner()
    await model.loadRecipe(id)

    // 3 render recipe
    recipeView.render(model.state.recipe)
    

    }
  catch(err){
    recipeView.renderError()
  }
}
const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner()
    //1- get search query
    const query =  searchView.getQuery()
    if(!query) return
 
    //2- load search query
    await model.loadSearchResults(query)
     //3- render results
     
    resultsView.render(model.getSearchResultsPage())
    //4- render initial pagination buttons
    paginationView.render(model.state.search)
  }catch(err){

  }
}
 
// 
const controlServings = function(newServings){
  // update the recipe servings (in state)

  // update the recipe view 
  model.updateServings(newServings)
  //  render recipe
  recipeView.update(model.state.recipe)
  
}
const controlAddBookmark = function(){
  // 1 add/remove bookmark
  if(!model.state.recipe.bookmarked){  
     model.addBookmark(model.state.recipe)}
  else {
     model.deleteBookmark(model.state.recipe.id)}
     // update recipe view
  recipeView.update(model.state.recipe)
  // render bookmarks
  bookmarksView.render(model.state.bookmarks)
}
const controlPagination = function(goToPage){
   //1- render results
  resultsView.render(model.getSearchResultsPage(goToPage))
  // /2- render initial pagination buttons
  paginationView.render(model.state.search)
}
const controlBookmarks =  function(){
  bookmarksView.render(model.state.bookmarks)
}
const controlAddRecipe = async function(newRecipe){
  try{

    await model.uploadRecipe(newRecipe)
    // render recipe

    recipeView.render(model.state.recipe)

    // sucess mensage
    addRecipeView.renderMessage()

    // render bookmarkview
    bookmarksView.render(model.state.bookmarks)

    // change id in url

    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    // close form window 

    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC*1000)
  }catch(err){
    console.log(err)
    addRecipeView.renderError(err)
  }
  //upload the new recipe data
}
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  addRecipeView.addHandlerUpload(controlAddRecipe)

}
init()