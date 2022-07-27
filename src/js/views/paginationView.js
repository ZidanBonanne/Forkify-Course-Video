import icons from 'url:../../img/icons.svg'; 
import View from "./View.js"

class PaginationView extends View{
   
    _parentElement = document.querySelector(".pagination");
    addHandlerClick(handler){
        this._parentElement.addEventListener("click", function(e){
            e.preventDefault()
            const btn = e.target.closest(".btn--inline")
            if (!btn) return 
            const goToPage = +btn.dataset.goto

            handler(goToPage)
        })
    }
    _generateMarkup(){
        const curPage = this._data.page;
        const numPages =Math.ceil( this._data.results.length / this._data.resultsPerPage)
        
        if(curPage === 1 && numPages>1){
            return this.goToNext(curPage) 
        }
        if(curPage === numPages && numPages>1){
            return this.goToPrev(curPage)
        }
        if(curPage<numPages){
            return [this.goToNext(curPage),this.goToPrev(curPage)]
        }
        return ``
      
    }
    goToNext(page){
        return `
        <button data-goto="${page+1}" class="btn--inline pagination__btn--next">
            <span>Page ${page+1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`
   }
   goToPrev(page){
     return `   
        <button data-goto="${page-1}" class="btn--inline pagination__btn--prev">
            <span>Page ${page-1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
         </button> `
    }
}

export default new PaginationView()