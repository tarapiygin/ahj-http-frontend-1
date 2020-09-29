export default class FormTicketWidget {
  constructor() {
    this.parentEl = document.body;
    this.bindToDOM();

    this.element = this.parentEl.querySelector('.ticket-form');
    this.containerEL = this.element.closest('.form-container');
    this.header = this.containerEL.querySelector('.form-header');
    this.resetButton = this.element.querySelector('.ticket-form_reset-button');
    this.fields = this.element.elements;
    this.errors = [];
    this.submitFormListeners = [];
    this.resetFormListeners = [];
    this.regitsterEvents();
  }

  static get markup() {
    return `<div class="form-container">
    <form novalidate class="ticket-form">
      <span class="form-header"></span>
      <label for="ticket-form_name">Краткое описание</label>
      <input id="ticket-form_name" type="text" class="ticket-form_name" name="name">
      <label for="ticket-form_description">Подробное описание</label>
      <textarea id="ticket-form_description" class="ticket-form_description" name="description"></textarea>
      <div class="ticket-form_buttons">
        <button class="ticket-form_reset-button btn" type="reset">Отмена</button>
        <button class="ticket-form_save-button btn" type="submit">Ок</button>
      </div>
    </form>
  </div>`;
  }

  bindToDOM() {
    this.parentEl.insertAdjacentHTML('beforeend', this.constructor.markup);
  }

  showForm(headerForm, name = '', description = '') {
    this.header.innerText = headerForm;
    this.fields.name.value = name;
    this.fields.description.value = description;
    this.containerEL.classList.add('form-container_visible');
  }

  hideForm() {
    this.hideErrors();
    this.header.innerText = '';
    this.fields.name.value = '';
    this.fields.description.value = '';
    this.containerEL.classList.remove('form-container_visible');
  }

  vildate() {
    this.hideErrors();
    if (this.fields.name.value === '') {
      this.errors.push({
        key: 'name',
        text: 'Поле не может быть пустым',
      });
      return false;
    }
    if (this.fields.description.value === '') {
      this.errors.push({
        key: 'description',
        text: 'Поле не может быть пустым',
      });
      return false;
    }
    return true;
  }

  showErrors() {
    this.errors.forEach((error) => {
      const errorEl = document.createElement('div');
      errorEl.classList.add('error');
      errorEl.innerText = error.text;
      this.fields[error.key].after(errorEl);
    });
  }

  hideErrors() {
    this.errors = [];
    const errorsEl = Array.from(this.element.getElementsByClassName('error'));
    errorsEl.forEach((element) => element.remove());
  }

  addSubmitFormListener(callback) {
    this.submitFormListeners.push(callback);
  }

  addResetFormListener(callback) {
    this.resetFormListeners.push(callback);
  }

  onSubmitForm(event) {
    event.preventDefault();
    if (this.vildate()) {
      const name = this.fields.name.value;
      const description = this.fields.description.value;
      this.hideForm();
      this.submitFormListeners.forEach((o) => o.call(null, name, description));
    } else this.showErrors();
  }

  onClickResetForm() {
    this.hideForm();
    this.resetFormListeners.forEach((o) => o.call(null));
  }

  regitsterEvents() {
    this.element.addEventListener('submit', this.onSubmitForm.bind(this));
    this.resetButton.addEventListener('click', this.onClickResetForm.bind(this));
  }
}
