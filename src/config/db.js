import mongoose from "mongoose";

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});
export const DB = mongoose.connection;

DB.on(
  "error",
  console.error.bind(console, "Error de conexión a la base de datos:")
);
DB.once("open", () => {
  console.log("Conexión exitosa a la base de datos");
});

DB.GenUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
