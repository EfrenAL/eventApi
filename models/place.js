//We define new models
module.exports = function(sequelize, DataTypes){
    return sequelize.define('place', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [1, 50]
          }
        },
        description: {
          type: DataTypes.STRING(1234),
          allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 150]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 150]
            }
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 200]
            }
        },
        webUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 200]
            }
        },        
        coworking: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        surf: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        yoga: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
    });
};
