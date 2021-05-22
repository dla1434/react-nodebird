import React, { useCallback, useRef, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';
import { REMOVE_IMAGE } from '../reducers/post';
import { ADD_POST_REQUEST } from '../reducers/post';

import { backUrl } from '../config/config';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');
  const { imagePaths, addPostLoading, addPostDone } = useSelector(
    (state) => state.post
  );

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    // setText("");
    // dispatch(addPost(text));

    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요');
    }

    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);

    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });

    //image가 없다면 formData 없이 json으로 해도 충분하다.
    // dispatch({
    //   type: ADD_POST_REQUEST,
    //   data: {
    //     imagePaths,
    //     content: text,
    //   },
    // });
  }, [text, imagePaths]);

  const imageInput = useRef();

  const onChangeImages = useCallback((e) => {
    //Input에서 선택한 이미지 정보를 가져오고
    console.log('images', e.target.files);
    //FormData를 만들면 멀티파트 형식으로 서버에 보낼 수 있다.
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });

    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  });

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있나요?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: 'right' }}
          htmlType="submit"
          loading={addPostLoading}
        >
          짹잭
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ dispaly: 'inline-block' }}>
            {/* <img src={`${backUrl}/${v}`} style={{ width: '200px' }} alt={v} /> */}
            <img
              src={v.replace(/\/thumb\//, '/original/')}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <button onClick={onRemoveImage(i)}>제거</button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
