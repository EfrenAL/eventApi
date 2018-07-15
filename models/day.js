/**
 * Created by efren on 13/06/17.
 */

//We define new models
module.exports = function(sequelize, DataTypes){
    return sequelize.define('day', {
        start: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        end: {
            type: DataTypes.TIME,
            allowNull: false
        },
        wage: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        pauze: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        surtaxes: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        }
    });
};

