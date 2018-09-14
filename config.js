function config(){
  switch(process.env.NODE_ENV){
      case 'dev':
          return {
            'NEO4J_DATABASE_URL': 'localhost',
            'NEO4J_DATABASE_USER': 'thumb_dev',
            'NEO4J_DATABASE_PASSWORD': 'thumb_dev',
            'ETHEREAL_CREDENTIALS': {'user': 'xy7acxpl7wtdjd5i@ethereal.email', 'password': 'ecNuxBSHZhnNqsuhtj'},
            'APP_SETTINGS': {
              'WELCOME_EMAIL_MINUTE_DELAY': 1
            }
          };
      case 'test':
          return {
            'NEO4J_DATABASE_URL': 'localhost',
            'NEO4J_DATABASE_USER': 'thumb_test',
            'NEO4J_DATABASE_PASSWORD': 'thumb_test',
            'ETHEREAL_CREDENTIALS': {'user': 'xy7acxpl7wtdjd5i@ethereal.email', 'password': 'ecNuxBSHZhnNqsuhtj'},
              'APP_SETTINGS': {
                'WELCOME_EMAIL_MINUTE_DELAY': 1
              }
          };
      case 'prod':
          return {
            'NEO4J_DATABASE_URL': process.env.NEO4J_DB_URL,
            'NEO4J_DATABASE_USER': process.env.NEO4J_DB_USER,
            'NEO4J_DATABASE_PASSWORD': process.env.NEO4J_DB_PASSWORD,
            'SENDGRID_API_KEY': process.env.SENDGRID_API_KEY,
            'APP_SETTINGS': {
              'WELCOME_EMAIL_MINUTE_DELAY': 1440
            }
          };
      default:
          throw "Invalid configuration choice. NODE_ENV include ('dev', 'test', 'prod')";
  }
}

module.exports = config();
