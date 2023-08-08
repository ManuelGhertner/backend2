import config from '../../config.js';
import MongoSingleton from './mongo.class.js';
import ProductsDB from './products.dbclass.js';
import ProductsLocal from './products.local.js';

let factoryProduct;

switch (config.PERSISTENCE) {
    case 'memory':
        factoryProduct = ProductsLocal;
        break;
    
    case 'mongo':
        MongoSingleton.getInstance();
        factoryProduct = ProductsDB;
        break;
    
    default:
}

export default factoryProduct;