import Avatar from '@components/avatar/Avatar';
import { timeAgo } from '@services/utils/timeAgo.utils';
import PropTypes from 'prop-types';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

import '@components/gallery-image/GalleryImage.scss';

const GalleryImage = ({ post, showCaptions, showDelete, imgSrc, onClick, onRemoveImage }) => {
  return (
    <>
      <figure className="gallery-image" onClick={onClick}>
        <div className="gallery-image__crop">
          <img className="gallery-image__media" src={`${imgSrc}`} alt="" />
          {showDelete && (
            <span className="gallery-image__delete" onClick={onRemoveImage}>
              <FaTrash />
            </span>
          )}
        </div>
        {showCaptions && (
          <figcaption className="gallery-image__caption">
            <div className="figure-header">
              <Avatar
                name={post?.username}
                bgColor={post?.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={post?.profilePicture}
              />
              <div className="figure-body">
                <span className="figure-title">{post?.username}</span>
                <span className="figure-date">{timeAgo.transform(post?.createdAt)}</span>
              </div>
            </div>
          </figcaption>
        )}
      </figure>
    </>
  );
};

GalleryImage.propTypes = {
  post: PropTypes.object,
  showCaptions: PropTypes.bool,
  showDelete: PropTypes.bool,
  imgSrc: PropTypes.string,
  onClick: PropTypes.func,
  onRemoveImage: PropTypes.func
};

export default GalleryImage;
