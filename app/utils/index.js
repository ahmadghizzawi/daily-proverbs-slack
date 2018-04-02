/**
 * Returns the result in JSON along with a HTTP status.
 * @param res the res object.
 * @param obj the json object to be returned.
 * @param status the status code (i.e. 200, 404, 500, ..)
 */
function respond(res, obj, status) {
  res.format({
    json() {
      if (status) {
        return res.status(status).json(obj);
      }
      return res.json(obj);
    },
  });
}

module.exports = {
  respond,
};
