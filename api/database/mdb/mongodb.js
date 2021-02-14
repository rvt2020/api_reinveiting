const log = require("../../../utils/logger");
const mongoClient = require("mongodb").MongoClient;

// const conexionMongo = process.env.IP_MONGO ?
//     `mongodb://admin:password@${process.env.IP_MONGO}` :
//     "mongodb://admin:password@mongodb";

const conexionMongo = process.env.IP_MONGO ?
    `mongodb://${process.env.IP_MONGO}` :
    "mongodb://mongodb";

//FUNCION DE ACTUALIZAR JSON
exports.UPDATE_ONE = async (query, data, name_collection) => {
    try {
        log.info("update_mdb", query);

        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);

        const { result } = await collection.updateOne(query, {
            $set: {
                ...data,
                _updated: new Date()
            }
        });
        client.close();
        return result;
    } catch (error) {
        console.log("Falló editar mongo");
        console.log(error.message);
    }
};

exports.INSERT_ONE = async (data, name_collection) => {
    try {
        //log.info("INSERT_MDB");
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);
        const { result } = await collection.insertOne({
            ...data,
            _insert: new Date()
        });
        client.close();
        return result;
    } catch (error) {
        console.log("her");
        console.log(error);
        return false;
    }
};

exports.GET_ONE = async (query, name_collection) => {
    try {
        //log.info("GET_ONE");
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);
        const result = await collection.findOne(query);
        const output = { codRes: result ? "00" : "01", ...result };
        client.close();
        return output;
    } catch (error) {
        console.log("error");
        console.log(error);
    }
};

exports.GET_ALL = async (query, name_collection) => {
    try {
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("query ", query);
        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);
        const result = await collection.find(query).toArray();
        client.close();
        return { codRes: result ? "00" : "01", result };
    } catch (error) {
        console.log("error");
        console.log(error);
    }
};

exports.INSERT_ONE_INDEX = async (
    data,
    name_collection,
    index,
    contador_collection
) => {
    try {
        log.info("INSERT_MDB_INDEX");
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);
        const { result, insertedId } = await collection.insertOne({
            _id: await getNextSequence(index, contador_collection),
            ...data,
            _insert: new Date()
        });
        console.log(result);
        client.close();
        return insertedId;
    } catch (error) {
        console.log("her");
        console.log(error);
        return false;
    }
};

exports.GET_LATEST_TIME = async (imei, name_collection) => {
    try {
        log.info("GET_LATEST_TIME");
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(name_collection);
        const result = await collection
            .find({
                imei: imei
            })
            .sort({
                fechaGps: -1
            })
            .limit(1)
            .toArray();

        // console.log(result[0]);
        client.close();
        return result[0];
    } catch (error) {
        console.log("her");
        console.log(error);
        return false;
    }
};

const getNextSequence = async (name, contador_collection) => {
    try {
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(process.env.MDB_NAME);
        const collection = db.collection(contador_collection);

        const ret = await collection.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } });
        console.log("retornar_:", ret.value.seq);
        client.close();
        return ret.value.seq;
    } catch (error) {
        console.log("her");
        console.log(error);
    }
};

exports.GET_ONE = async (query, name_collection, database) => {
    try {
        const client = await mongoClient.connect(conexionMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = client.db(database);
        const collection = db.collection(name_collection);
        const result = await collection.findOne(query);
        const output = { codRes: result ? "00" : "01", ...result };
        client.close();
        return output;
    } catch (error) {
        console.log("error");
        console.log(error);
    }
};