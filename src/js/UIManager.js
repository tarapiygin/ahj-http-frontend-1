import moment from 'moment';
import FormTicketWidget from './FormTicketWidget';
import СonfirmPopupWidget from './СonfirmPopupWidget';

export default class UIManager {
  constructor() {
    this.ticketsContainer = document.querySelector('.tickets-container');
    this.addTicketEl = document.querySelector('.add-ticket-button');
    this.preview = document.querySelector('.preview');
    this.form = new FormTicketWidget();
    this.popup = new СonfirmPopupWidget();
    this.selectedTicket = null;
    this.createTicketListeners = [];
    this.editTicketListeners = [];
    this.clickEditFormListeners = [];
    this.deleteTicketListeners = [];
    this.showFullTicketListeners = [];
    this.registerEvents();
  }

  static renderTickets(tickets) {
    let HTML = '';
    tickets.forEach((t) => {
      moment.locale('ru');
      const tiketData = moment(t.created).format('lll');
      HTML += `
    <div class="ticket"
    data-id=${t.id}
    data-name=${t.name}
    data-status=${t.status}
    data-created=${t.created}
    data-description=${null}>
    <div class="ticket-column">
      <input class="ticket_checkbox" type="checkbox" name="status" ${t.status ? 'checked' : ''}>
      <div class="ticket-content_name">${t.name}</div>
    </div>
    <div class="ticket-column">
      <div class="ticket-content_created">${tiketData}</div>
      <div class="ticket-buttons">
        <button class="ticket_edit-button">✏</button>
        <button class="ticket_delete-button">X</button>
      </div>
    </div>
    <div class="ticket-content_description"></div>
  </div>`;
    });
    return HTML;
  }

  drawUI(tickets) {
    this.ticketsContainer.innerHTML = UIManager.renderTickets(tickets);
    const ticketsEl = this.ticketsContainer.querySelectorAll('.ticket');
    if (ticketsEl === null) return;
    ticketsEl.forEach((el) => {
      el.addEventListener('click', this.onClickTicket.bind(this));
    });
    this.hidePreview();
  }

  addCreateTicketListener(callback) {
    this.createTicketListeners.push(callback);
  }

  addEditTicketListener(callback) {
    this.editTicketListeners.push(callback);
  }

  addClickEditFormListener(callback) {
    this.clickEditFormListeners.push(callback);
  }

  addShowFullTicketListener(callback) {
    this.showFullTicketListeners.push(callback);
  }

  addDeleteTicketListener(callback) {
    this.deleteTicketListeners.push(callback);
  }

  showPreview() {
    this.preview.classList.add('preview_visible');
  }

  hidePreview() {
    this.preview.classList.remove('preview_visible');
  }

  showForm(e, name = '', description = '') {
    let header = 'Добавить тикет';
    if (this.selectedTicket !== null) {
      header = 'Изменить тикет';
    }
    this.form.showForm(header, name, description);
  }

  showFullTicket(fullticket) {
    const selector = `[data-id="${fullticket.id}"]`;
    const ticketEl = this.ticketsContainer.querySelector(selector);
    const description = ticketEl.querySelector('.ticket-content_description');
    description.classList.add('ticket-content_description__visible');
    description.innerText = fullticket.description;
  }

  onShowFullTicket(ticketEl) {
    const { id } = ticketEl.dataset;
    this.showFullTicketListeners.forEach((o) => o.call(null, id));
  }

  onClickEditForm(ticketEl) {
    const { id } = ticketEl.dataset;
    this.clickEditFormListeners.forEach((o) => o.call(null, id));
  }

  onClickDeleteTicket(ticketEl) {
    const { id } = ticketEl.dataset;
    const text = 'Вы уверены, что хотите удалить этот тикет? Это действие необратимо';
    this.popup.showPopup(text);
    this.popup.setConfirmListener(() => {
      this.deleteTicketListeners.forEach((o) => o.call(null, id));
    });
  }

  onResetTicketForm() {
    this.selectedTicket = null;
  }

  onSubmitTicketForm(name, description) {
    if (this.selectedTicket === null) {
      this.createTicketListeners.forEach((o) => o.call(null, name, description));
      return;
    }
    this.selectedTicket.querySelector('.ticket-content_name').innerText = name;
    this.selectedTicket.querySelector('.ticket-content_description').innerText = description;
    const { id, status } = this.selectedTicket.dataset;
    this.selectedTicket = null;
    this.editTicketListeners.forEach((o) => o.call(null, id, name, status, description));
  }

  onClickTicket(e) {
    const deleteBtn = e.target.closest('.ticket_delete-button');
    if (deleteBtn !== null) {
      this.onClickDeleteTicket(e.currentTarget);
      return;
    }
    const editBtn = e.target.closest('.ticket_edit-button');
    if (editBtn !== null) {
      this.selectedTicket = e.currentTarget;
      this.onClickEditForm(e.currentTarget);
      return;
    }
    const checkbox = e.target.closest('.ticket_checkbox');
    if (checkbox !== null) {
      const {
        id,
        name,
      } = e.currentTarget.dataset;
      const status = (e.currentTarget.dataset.status === 'false');
      e.currentTarget.dataset.status = status;
      this.editTicketListeners.forEach((o) => o.call(null, id, name, status));
      return;
    }
    const description = e.currentTarget.querySelector('.ticket-content_description');
    if (description.classList.contains('ticket-content_description__visible')) {
      description.classList.remove('ticket-content_description__visible');
    } else {
      description.classList.add('ticket-content_description__visible');
      this.onShowFullTicket(e.currentTarget);
    }
  }

  registerEvents() {
    this.addTicketEl.addEventListener('click', this.showForm.bind(this));
    this.form.addSubmitFormListener(this.onSubmitTicketForm.bind(this));
    this.form.addResetFormListener(this.onResetTicketForm.bind(this));
  }
}
