export const captureRawBody = (req, _res, buffer) => {
  if (buffer?.length) {
    req.rawBody = buffer.toString("utf8");
  }
};
