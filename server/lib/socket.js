let io;

export const initSocket = (socketServer) => {
  io = socketServer;

  io.on("connection", (socket) => {
    socket.on("invoice:watch", (invoiceId) => {
      if (invoiceId) socket.join(`invoice:${invoiceId}`);
    });

    socket.on("dashboard:watch", () => {
      socket.join("dashboard");
    });
  });

  return io;
};

export const getIo = () => io;

export const emitInvoicePaid = (invoice) => {
  if (!io) return;
  io.to(`invoice:${invoice.id}`).emit("payment:paid", invoice);
  io.to("dashboard").emit("dashboard:refresh", { reason: "payment_paid", invoiceId: invoice.id });
};
