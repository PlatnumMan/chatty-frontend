import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { Utils } from '@services/utils/utils.service';

import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { useEffect, useState } from 'react';

import '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay.scss';
import { toggleCommentsModal, toggleReactionsModal } from '@redux/reducers/modal/modal.reducer';
import { updatePostItem } from '@redux/reducers/post/post.reducer';

const ReactionsAndCommentsDisplay = ({ post }) => {
  const { reactionModalIsOpen, commentsModalIsOpen } = useSelector((state) => state.modal);
  const [postReactions, setPostReactions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [postCommentNames, setPostCommentNames] = useState([]);
  const dispatch = useDispatch();

  const getPostReactions = async () => {
    try {
      const response = await postService.getPostReactions(post?._id);
      setPostReactions(response.data.reactions);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const getpostCommentNames = async () => {
    try {
      const response = await postService.getPostCommentsNames(post?._id);
      console.log(response.data.comments);
      setPostCommentNames([...new Set(response.data.comments.names)]);
    } catch (error) {
      Utils.dispatchNotification(error?.response?.data?.message, 'error', dispatch);
    }
  };

  const sumAllReactions = (reactions) => {
    if (reactions?.length) {
      const result = reactions.map((item) => item.value).reduce((prev, next) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
  };

  const openReactionsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionModalIsOpen));
  };

  const openCommentsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(!commentsModalIsOpen));
  };

  useEffect(() => {
    setReactions(Utils.formatedReactions(post?.reactions));
  }, [post]);

  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactions.length > 0 &&
              reactions.map((reaction) => (
                <div className="tooltip-container" key={reaction?.type}>
                  <img
                    data-testid="reaction-img"
                    className="reaction-img"
                    src={`${reactionsMap[reaction.type]}`}
                    alt=""
                    onMouseEnter={getPostReactions}
                  />
                  <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                    <p className="title">
                      <img className="title-img" src={`${reactionsMap[reaction?.type]}`} alt="" />
                      {reaction?.type.toUpperCase()}
                    </p>
                    <div className="likes-block-icons-list">
                      {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                      {postReactions.length && (
                        <>
                          {postReactions.slice(0.19).map((postReaction) => (
                            <div key={Utils.generateString(10)}>
                              {postReaction?.type === reaction?.type && (
                                <span key={postReaction?._id}>{postReaction?.username}</span>
                              )}
                            </div>
                          ))}
                          {postReactions.length > 1 && <span>and {postReactions.length - 20} others...</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <span
            data-testid="reactions-count"
            className="tooltip-container reactions-count"
            onMouseEnter={getPostReactions}
            onClick={() => openReactionsComponent()}
          >
            {sumAllReactions(reactions)}
            <div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
              {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
              {postReactions.length && (
                <>
                  {postReactions.slice(0.19).map((reaction) => (
                    <span key={Utils.generateString(10)}>{reaction?.username}</span>
                  ))}
                  {postReactions.length > 20 && <span>and {postReactions.length - 20} others</span>}
                </>
              )}
            </div>
          </span>
        </div>
      </div>
      <div
        className="comment tooltip-container"
        data-testid="comment-container"
        onClick={() => openCommentsComponent()}
      >
        {post?.commentsCount > 0 && (
          <span onMouseEnter={getpostCommentNames} data-testid="comment-count">
            {Utils.shortenLargeNumbers(post?.commentsCount)} {`${post?.commentsCount === 1 ? 'Comment' : 'Comments'}`}
          </span>
        )}
        <div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
          <div className="likes-block-icons-list">
            {postCommentNames.length === 0 && <FaSpinner className="circle-notch" />}
            {postCommentNames.length && (
              <>
                {postCommentNames.slice(0, 19).map((names) => (
                  <span key={Utils.generateString(10)}>{names}</span>
                ))}
                {postCommentNames.length > 20 && <span> and {postCommentNames.length - 20} others...</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ReactionsAndCommentsDisplay.propTypes = {
  post: PropTypes.object
};

export default ReactionsAndCommentsDisplay;
