import Avatar from '@components/avatar/Avatar';
import { feelingsList, privacyList } from '@services/utils/static.data';
import { timeAgo } from '@services/utils/timeAgo.utils';
import { find } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import PostCommentSection from '@components/posts/post-comment-section/PostCommentSection';

import Dialog from '@components/dialog/Dialog';
import ImageModal from '@components/image-modal/ImageModal';
import '@components/posts/post/Post.scss';
import useLocalStorage from '@hooks/useLocalStorage';
import { openModal, toggleDeleteDialog } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import CommentInputBox from '../comments/comments-input/CommentInputBox';
import CommentsModal from '../comments/comments-modal/CommentsModal';
import ReactionsModal from '../reactions/reactions-modal/ReactionsModal';

const Post = ({ post, showIcons }) => {
  const { _id } = useSelector((state) => state.post);
  const { reactionModalIsOpen, commentsModalIsOpen, deleteDialogIsOpen } = useSelector((state) => state.modal);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const dispatch = useDispatch();

  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.image;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        Utils.dispatchNotification(response?.data?.message, 'success', dispatch);
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        dispatch(clearPost());
      }
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const openPostModal = () => {
    dispatch(openModal({ type: 'edit' }));
    dispatch(updatePostItem(post));
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };

  return (
    <>
      {reactionModalIsOpen && <ReactionsModal />}
      {commentsModalIsOpen && <CommentsModal />}
      {showImageModal && (
        <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstButtonHandler={() => deletePost()}
          secondButtonHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            dispatch(clearPost());
          }}
        />
      )}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={post?.profilePicture}
              />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div className="inline-display" data-testid="inline-display">
                      is feeling <img className="feeling-icon" src={`${getFeeling(post?.feelings)}`} alt="" />{' '}
                      <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt className="trash" onClick={openDeleteDialog} />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {timeAgo.transform(post?.createdAt)} &middot; {getPrivacy(post?.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
              {post?.post && post?.bgColor === '#ffffff' && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== '#ffffff' && (
                <div
                  data-testid="user-post-with-bg"
                  className="user-post-with-bg"
                  style={{ backgroundColor: `${post?.bgColor}` }}
                >
                  {post?.post}
                </div>
              )}

              {post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(Utils.getImage(post?.imgId, post?.imgVersion));
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img className="post-image" src={`${Utils.getImage(post?.imgId, post?.imgVersion)}`} alt="" />
                </div>
              )}

              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(post?.gifUrl);
                    setShowImageModal(!showImageModal);
                  }}
                >
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" />
                </div>
              )}
              {(post?.reactions.length > 0 || post?.commentsCount > 0) && <hr />}
              <PostCommentSection post={post} />
            </div>
          </div>

          {selectedPostId === post?._id && <CommentInputBox post={post} />}
        </div>
      </div>
    </>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool
};

export default Post;
