import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("taller.db");

/* ===============================
   INICIALIZAR BASE DE DATOS
================================ */

export const initDB = () => {

  db.execSync(`

    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS programas (
      cod TEXT PRIMARY KEY,
      nombre1 TEXT,
      nombre2 TEXT,
      nombre3 TEXT,
      nombre4 TEXT
    );

    CREATE TABLE IF NOT EXISTS estudiantes (
      codigo TEXT PRIMARY KEY,
      nombre TEXT,
      email TEXT,
      programa_cod TEXT,
      FOREIGN KEY(programa_cod) REFERENCES programas(cod)
      ON DELETE CASCADE
    );

  `);

};


/* ===============================
   PROGRAMAS
================================ */

/* Crear programa */

export const crearPrograma = (
  cod:string,
  n1:string,
  n2:string,
  n3:string,
  n4:string
) => {

  db.runSync(
    `INSERT INTO programas (cod,nombre1,nombre2,nombre3,nombre4)
     VALUES (?,?,?,?,?)`,
    [cod,n1,n2,n3,n4]
  );

};


/* Obtener programas */

export const obtenerProgramas = () => {

  return db.getAllSync(
    `SELECT * FROM programas`
  );

};


/* Buscar programa */

export const buscarPrograma = (texto:string) => {

  return db.getAllSync(
    `SELECT * FROM programas
     WHERE cod LIKE ?
     OR nombre1 LIKE ?`,
    [`%${texto}%`,`%${texto}%`]
  );

};


/* Actualizar nombre programa */

export const actualizarPrograma = (
  cod:string,
  nombre:string
) => {

  db.runSync(
    `UPDATE programas
     SET nombre1 = ?
     WHERE cod = ?`,
    [nombre,cod]
  );

};


/* Eliminar programa */

export const eliminarPrograma = (cod:string) => {

  db.runSync(
    `DELETE FROM programas
     WHERE cod = ?`,
    [cod]
  );

};


/* ===============================
   ESTUDIANTES
================================ */

/* Crear estudiante */

export const crearEstudiante = (
  codigo:string,
  nombre:string,
  email:string,
  programa_cod:string
) => {
  const programa = programa_cod.trim();
  const programaValue = programa === "" ? null : programa;

  db.runSync(
    `INSERT INTO estudiantes (codigo,nombre,email,programa_cod)
     VALUES (?,?,?,?)`,
    [codigo,nombre,email,programaValue]
  );

};


/* Obtener estudiantes */

export const obtenerEstudiantes = () => {

  return db.getAllSync(`
    
    SELECT 
      estudiantes.codigo,
      estudiantes.nombre,
      estudiantes.email,
      estudiantes.programa_cod,
      programas.nombre1 as programa_nombre
      
    FROM estudiantes
    
    LEFT JOIN programas
    ON estudiantes.programa_cod = programas.cod

  `);

};


/* Buscar estudiante */

export const buscarEstudiante = (texto:string) => {

  return db.getAllSync(

    `SELECT * FROM estudiantes
     WHERE codigo LIKE ?
     OR nombre LIKE ?`,

     [`%${texto}%`,`%${texto}%`]

  );

};


/* Actualizar estudiante */

export const actualizarEstudiante = (
  codigo:string,
  nombre:string,
  programa:string
) => {
  const programaNormalizado = programa.trim();
  const programaValue = programaNormalizado === "" ? null : programaNormalizado;

  db.runSync(

    `UPDATE estudiantes
     SET nombre = ?, programa_cod = ?
     WHERE codigo = ?`,

    [nombre,programaValue,codigo]

  );

};


/* Eliminar estudiante */

export const eliminarEstudiante = (codigo:string) => {

  db.runSync(

    `DELETE FROM estudiantes
     WHERE codigo = ?`,

    [codigo]

  );

};
