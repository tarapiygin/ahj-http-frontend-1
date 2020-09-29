import UIManager from './UIManager';

export default class TicketManager {
  constructor() {
    this.tikets = [];
    this.UIManager = new UIManager();
    this.url = 'https://calm-coast-44512.herokuapp.com/'; // http://localhost:7070/
    this.registerEvents();
  }

  redrawUI() {
    this.UIManager.showPreview();
    this.getTickets(this.onLoadTickets.bind(this));
  }

  onCreateTicket(name, description) {
    const params = new Map().set('method', 'createTicket');
    const data = {
      name,
      status: false,
      description,
    };
    this.UIManager.showPreview();
    this.sendRequest('POST', params, () => this.redrawUI(), data);
  }

  onDeleteTicket(id) {
    const params = new Map().set('method', 'deleteTicket');
    const data = { id };
    this.sendRequest('POST', params, () => this.redrawUI(), data);
  }

  onEditTicket(id, name, status, description = null) {
    const params = new Map().set('method', 'updateTicket');
    const data = {
      id,
      name,
      status,
      description,
    };
    this.sendRequest('POST', params, () => true, data);
  }

  onClickEditForm(id) {
    const ui = this.UIManager;
    this.getFullTicket(id, (data) => {
      const fullTicket = JSON.parse(data);
      ui.showForm(null, fullTicket.name, fullTicket.description);
    });
  }

  onShowFullTicket(id) {
    const ui = this.UIManager;
    this.getFullTicket(id, (data) => {
      ui.showFullTicket(JSON.parse(data));
    });
  }

  onLoadTickets(data) {
    const tickets = JSON.parse(data);
    this.UIManager.drawUI(tickets);
  }

  getTickets(callback) {
    const params = new Map().set('method', 'allTickets');
    this.sendRequest('GET', params, callback);
  }

  getFullTicket(id, callback) {
    const params = new Map().set('method', 'ticketById');
    params.set('id', id);
    this.sendRequest('GET', params, callback);
  }

  sendRequest(method, params, callback, body = '') {
    const xhr = new XMLHttpRequest();
    const query = new URLSearchParams();
    params.forEach((value, key) => query.append(key, value));

    xhr.open(method, `${this.url}?${query}`);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
        callback(xhr.response);
      }
    });
    xhr.addEventListener('error', () => {
    });
    if (method === 'GET') xhr.send();
    else xhr.send(JSON.stringify(body));
  }

  registerEvents() {
    this.UIManager.addShowFullTicketListener(this.onShowFullTicket.bind(this));
    this.UIManager.addCreateTicketListener(this.onCreateTicket.bind(this));
    this.UIManager.addDeleteTicketListener(this.onDeleteTicket.bind(this));
    this.UIManager.addEditTicketListener(this.onEditTicket.bind(this));
    this.UIManager.addClickEditFormListener(this.onClickEditForm.bind(this));
  }
}
