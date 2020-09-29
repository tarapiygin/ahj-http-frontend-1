export default class СonfirmPopupWidget {
  constructor() {
    this.parentEl = document.body;
    this.bindToDOM();
    this.containerEL = this.parentEl.querySelector('.confirm-popup-container');
    this.header = this.containerEL.querySelector('.confirm-popup_header');
    this.cancelButton = this.containerEL.querySelector('.confirm-popup_cancel-button');
    this.confirmButton = this.containerEL.querySelector('.confirm-popup_confirm-button');
    this.confirmListener = null;
    this.regitsterEvents();
  }

  static get markup() {
    return `<div class="confirm-popup-container">
    <div class="confirm-popup">
    <span class="confirm-popup_header"></span>
    <div class="confirm-popup_buttons">
      <button class="confirm-popup_cancel-button btn" type="reset">Отмена</button>
      <button class="confirm-popup_confirm-button btn" type="submit">Ок</button>
      </div>
      </div>
      </div>`;
  }

  bindToDOM() {
    this.parentEl.insertAdjacentHTML('beforeend', this.constructor.markup);
  }

  setConfirmListener(callback) {
    this.confirmListener = callback;
  }

  showPopup(header) {
    this.header.innerText = header;
    this.containerEL.classList.add('confirm-popup-container_visible');
  }

  hidePopup() {
    this.header.innerText = '';
    this.containerEL.classList.remove('confirm-popup-container_visible');
  }

  onClickCancelButton() {
    this.hidePopup();
  }

  onClickConfirmButton() {
    this.hidePopup();
    this.confirmListener.call(null);
  }

  regitsterEvents() {
    this.confirmButton.addEventListener('click', this.onClickConfirmButton.bind(this));
    this.cancelButton.addEventListener('click', this.onClickCancelButton.bind(this));
  }
}
