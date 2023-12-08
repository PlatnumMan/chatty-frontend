import doubleCheckMark from '@assets/images/double-checkmark.png';
import PropTypes from 'prop-types';
import React from 'react';
import { FaCheck, FaCircle } from 'react-icons/fa';

const ChatListBody = ({ data, profile }) => {
  return (
    <div className="conversation-message">
      <span>{data.body}</span>
      {!data.isRead ? (
        <>
          {data.receiverUsername === profile?.username ? (
            <FaCircle className="icon" />
          ) : (
            <FaCheck className="icon not-read" />
          )}
        </>
      ) : (
        <>{data.senderUsername === profile?.username && <img src={doubleCheckMark} alt="" className="icon read" />}</>
      )}
    </div>
  );
};

ChatListBody.propTypes = {
  data: PropTypes.object,
  profile: PropTypes.object
};

export default ChatListBody;
