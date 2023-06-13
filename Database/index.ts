import { Sequelize, DataTypes } from "sequelize";
//@ts-ignore
export const database = new Sequelize(process.env.DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        }
    }
})

export const Songs = database.define("Songs", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    spotify: {
        type: DataTypes.STRING,
        allowNull: false,
        
    }, 
    youtube: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["spotify"]
        }
    ]
})

Songs.sync();