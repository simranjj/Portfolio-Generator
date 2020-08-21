"use strict";
let dbQueries = {};

/**
 * Get data common function
 * @param model
 * @param criteria
 * @param projection
 * @param options
 * @returns {Promise<*>}
 */
dbQueries.getOneDoc = async (model, criteria, projection, options) => {
  return await model.findOne(criteria, projection, options);
};

/**
 * Update data common function
 * @param model
 * @param criteria
 * @param dataToUpdate
 * @param options
 * @returns {Promise<*>}
 */
dbQueries.updateData = async (model, criteria, dataToUpdate, options) => {
  return await model.findOneAndUpdate(criteria, dataToUpdate, options);
};

/**
 * remove one document common function
 * @param model
 * @param criteria
 * @returns {Promise<*>}
 */
dbQueries.removeOne = async (model, criteria) => {
  return await model.findOneAndRemove(criteria);
};

module.exports = dbQueries;
