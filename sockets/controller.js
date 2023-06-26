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
  socket.emit("ultimo-socket", ticketControl.ultimo);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();
    callback(siguiente);

    // TODO: Notificar que hay un nuevo ticket pendiente de asignar
  });
};

module.exports = {
  socketController,
};
