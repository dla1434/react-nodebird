module.exports = (sequelize, DataTypes) => {
  import Hashtag from './../../../https/front/pages/hashtag';
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      //이모티콘을 사용하려면 utf8이 아닌 utf8mb4로 지정해야 한다.
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag);
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker' });
    db.Post.blongsTo(db.Post, { as: 'Retweet' });
  };

  return Post;
};
