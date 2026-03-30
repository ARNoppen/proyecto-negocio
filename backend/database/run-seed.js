require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runSeed() {
    console.log('Iniciando creación de esquema y población de datos iniciales...');
    
    const dbConfig = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    };
    
    console.log('--- DB Config detectada ---');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`Port: ${dbConfig.port}`);
    console.log(`User: ${dbConfig.user}`);
    console.log('---------------------------');

    try {
        const connection = await mysql.createConnection(dbConfig);

        const sqlFilePath = path.join(__dirname, 'schema.sql');
        const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

        console.log('Ejecutando consultas...');
        await connection.query(sqlQuery);
        
        console.log('Esquema y datos iniciales creados correctamente ✅');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar el seed:', error);
        process.exit(1);
    }
}

runSeed();
