//We define new models
module.exports = function(sequelize, DataTypes){
    return sequelize.define('event', {
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
                len: [1, 50]
          }
        },
        picture: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
              len: [1, 50]
          }
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        },
        thumbnailUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        }
    });
};
