import React from "react";
import { PropTypes } from "prop-types";
import Link from "next/link";

const PostCardContent = ({ postData }) => {
  //첫 번째 게시글 #해시태그 #익스프레스
  return (
    <div>
      {postData.split(/(#[^\s#].+)/g).map((v, i) => {
        if (v.match(/(#[^\s#].+)/g)) {
          return (
            //v.slice(1)을 한 이유는 #을 제외하기 위해서다.
            //map 안에 있는 태그라서 key를 붙여줘야 한다.
            <Link href={`/hashtag/${v.slice(1)}`} key={i}>
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
