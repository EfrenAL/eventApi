//We define new models
module.exports = function(sequelize, DataTypes){
    return sequelize.define('country', {        
        uuid: {     //NAME IN CAPITAL LETTERS
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          primaryKey: true,
          validate: {
              len: [1, 50]
          }
        },        
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
