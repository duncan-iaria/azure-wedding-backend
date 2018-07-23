module.exports = {
  getConfigOptions: () => {
    const DB_URI = process.env.ENV === 'PROD' ? process.env.DB_PROD_URI : process.env.DB_DEV_URI;
    const DB_NAME = process.env.ENV === 'PROD' ? process.env.DB_PROD_NAME : process.env.DB_DEV_NAME;
    return [DB_URI, DB_NAME];
  }
};
