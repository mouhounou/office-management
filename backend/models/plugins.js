/**
 * Normalise la sérialisation JSON de tous les modèles : `_id` devient `id`,
 * `__v` et les champs sensibles disparaissent.
 */
function toJSONPlugin(schema, options = {}) {
  const hidden = options.hidden || [];

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = String(ret._id);
      delete ret._id;
      for (const field of hidden) delete ret[field];
      return ret;
    },
  });
}

module.exports = { toJSONPlugin };
