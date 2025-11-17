import Preview from "./previewView.js";
import icons from 'url:../../img/icons.svg';
class ResultView extends Preview {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'no recipes found for your query !';
  _message = '';
}
export default new ResultView();