import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Card, Popover, Button, Avatar, List, Comment } from "antd";
import {
  RetweetOutlined,
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import PostImages from "../components/PostImages";
import CommentForm from "../components/CommentForm";
import PostCardContent from "../components/PostCardContent";

const PostCard = ({ post }) => {
  // const { me } = useSelector((state) => state.user);
  // const id = me && me.id;
  //문법이 추가되서 이렇게 줄일 수 있다.
  // const id = me?.id;

  //좀 더 줄이려면
  const id = useSelector((state) => state.user.me?.id);

  const [liked, setLiked] = useState(false);
  const [commentForOpened, setCommentForOpened] = useState(false);

  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentForOpened((prev) => !prev);
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onToggleLike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onToggleLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger">삭제</Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentForOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
      {/* <CommentForm />
      <Comments /> */}
    </div>
  );
};

PostCard.propTypes = {
  // post: PropTypes.object.isRequired,
  //object 안에 모든 값을 정의하고 싶다면
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
