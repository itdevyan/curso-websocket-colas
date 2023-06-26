const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = []; // pendientes
    this.ultimos4 = []; // últimos 4 pendientes

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    const { hoy, tickets, ultimo, ultimos4 } = require("../db/data.json");
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimo = ultimo;
      this.ultimos4 = ultimos4;
    } else {
      // es otro día
      this.guardarDB();
    }
  }

  siguiente() {
    this.ultimo += 1;
    // null significa que no tiene escritorio asignado
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);
    this.guardarDB();
    return "Ticket " + ticket.numero;
  }

  antenderTicker(escritorio) {
    // No tenemos tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift();
    // remueve el primer elemento y lo devuelve
    // también se podría hacer así
    // const ticket = this.tickets[0];
    // this.tickets.shift();

    ticket.escritorio = escritorio;

    this.ultimos4.unshift(ticket); // agrega un elemento nuevo al inicio

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1); // para eliminar el último elemento, y mantener sólo 4
    }

    this.guardarDB();

    return ticket;
  }

  pendientes() {
    return this.tickets.length;
  }

  guardarDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    // respecto a toJson, de porque no lleva parentesis, es porque es un getter
    // y la idea de los getter es que se llamen como si fueran propiedades
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }
}

module.exports = TicketControl;
