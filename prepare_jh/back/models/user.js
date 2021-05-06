//User 객체명에서 대문자는 소문자로 변경되고...s가 붙는 형태
//즉 Mysql에서는 users로 변환해서 저장된다.
//컬럼 중 id는 mysql에서 자동으로 넣어주므로 정의할 필요 없다.
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, //false가 필수
        unique: true, //고유값 - 중복되는 값 있으면 안 됨
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      //아래 두 개 설정을 해야 한글을 쓸 수 있다..mysql 기본 설정으로 에러가 발생
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    // db.User.belongsToMany(db.Post, { through: 'Like' });
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers' });
    // db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings' });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followers',
      foreignKey: 'FollowingId',
    });
    db.User.belongsToMany(db.User, {
      through: 'Follow',
      as: 'Followings',
      foreignKey: 'FollowerId',
    });
  };

  return User;
};
