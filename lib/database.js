import mongoose from "mongoose";

mongoose.plugin(function dropVersionFromJSONPlugin(schema, options) {
  schema.options.toJSON = {
    transform: function (document, documentAsJSON, options) {
      return documentAsJSON;
    },
  };
});


export default function connect(){
    const { DB_USER, DB_PASS,DB_HOST, DB_NAME } = process.env
    const connectionStr = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`


    const { connection } = mongoose
    connection.on("connecting",      () => console.log("[DB] connecting"))
    connection.on("connected",       () => console.log("[DB] connected"))
    connection.on("disconnecting",   () => console.log("[DB] disconnecting"))
    connection.on("disconnected",    () => console.log("[DB] disconnected"))
    connection.on("reconnected",     () => console.log("[DB] reconnected"))
    connection.on("error",           error => console.log("[DB] error", error))

    
    mongoose.connect(connectionStr)
}