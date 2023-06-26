const TicketControl = require("../models/ticket-control");

// Única cada vez que se reinicie el servidor
const ticketControl = new TicketControl();

const socketController = (socket) => {
  console.log("Cliente conectado", socket.id);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado", socket.id);
  });

  // Como estamos en un controlador, el socket que viene por parametro
  // sólo emitira a su cliente
  // Todos estos emit se realizan cuando un cliente se conecta
  socket.emit("ultimo-socket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);
  socket.emit("tickets-pendientes", ticketControl.pendientes());

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);
    socket.broadcast.emit("tickets-pendientes", ticketControl.pendientes());
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    // cual es el ticket que antender
    const ticket = ticketControl.antenderTicker(escritorio);

    // Se vuelve a notificar a todos los clientes
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
    socket.emit("tickets-pendientes", ticketControl.pendientes());
    socket.broadcast.emit("tickets-pendientes", ticketControl.pendientes());

    if (!ticket) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
