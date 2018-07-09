module.exports = {
  getConfigOptions: () => {
    const DB_URI = process.env.ENV === 'DEV' ? process.env.DB_DEV_URI : process.env.DB_PROD_URI;
    const DB_NAME = process.env.ENV === 'DEV' ? process.env.DB_DEV_NAME : process.env.DB_PROD_NAME;
    return [DB_URI, DB_NAME];
  },
};
