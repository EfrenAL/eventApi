//We define new models
module.exports = function(sequelize, DataTypes){
    return sequelize.define('coworking', {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
              len: [1, 50]
          }
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
                len: [1, 260]
          }
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
                len: [1, 50]
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
                len: [1, 100]
            }
        },
        webUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        }
    });
};
