import PropTypes from 'prop-types';

import '@components/posts/modal-wrappers/post-wrapper/PostWrapper.scss';

const PostWrapper = ({ children }) => {
  return (
    <div className="modal-wrapper">
      {children[1]}
      {children[2]}
      {children[3]}
      <div className="modal-bg"></div>
    </div>
  );
};

PostWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PostWrapper;
