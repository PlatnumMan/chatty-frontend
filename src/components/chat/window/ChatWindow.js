/* eslint-disable react-hooks/exhaustive-deps */
import Avatar from '@components/avatar/Avatar';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '@components/chat/window/ChatWindow.scss';
import { chatService } from '@services/api/chat/chat.service';
import { userService } from '@services/api/user/user.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { Utils } from '@services/utils/utils.service';
import { some } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import MessageDisplay from './message-display/MessageDisplay';
import MessageInput from './message-input/MessageInput';

const ChatWindow = () => {
  const { profile } = useSelector((state) => state.user);
  const { isLoading } = useSelector((state) => state.chat);
  const [receiver, setReceiver] = useState();
  const [conversationId, setConversationId] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();

  const getChatMessages = useCallback(
    async (receiverId) => {
      try {
        const response = await chatService.getChatMessages(receiverId);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    },
    [dispatch]
  );

  const getNewUserMessages = useCallback(() => {
    if (searchParams.get('id') && searchParams.get('username')) {
      setConversationId('');
      setChatMessages([]);
      getChatMessages(searchParams.get('id'));
    }
  }, [getChatMessages, searchParams]);

  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(searchParams.get('id'));
      setReceiver(response.data.user);
      ChatUtils.joinRoomEvent(response.data.user, profile);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, profile, searchParams]);

  const setChatMessage = async (message, gifUrl, selectedImage) => {
    try {
      const checkUserOne = some(
        ChatUtils.chatUsers,
        (user) => user?.userOne === profile?.username && user.userTwo === receiver?.username
      );
      const checkUserTwo = some(
        ChatUtils.chatUsers,
        (user) => user?.userOne === receiver?.username && user.userTwo === profile?.username
      );
      const messageData = ChatUtils.messageData({
        receiver,
        conversationId,
        message,
        searchParamsId: searchParams.get('id'),
        chatMessages,
        gifUrl,
        selectedImage,
        isRead: checkUserOne && checkUserTwo
      });
      await chatService.saveChatMessage(messageData);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(chatMessages, searchParams.get('username'), setConversationId, setChatMessages);
    }
    if (!rendered) setRendered(true);
    ChatUtils.usersOnline(setOnlineUsers);
    ChatUtils.usersOnChatPage();
  }, [searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(chatMessages, searchParams.get('username'), setConversationId, setChatMessages);
  }, [chatMessages, searchParams]);

  const updateMessageReaction = async (body) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const deleteChatMessage = async (senderId, receiverId, messageId, type) => {
    try {
      await chatService.markMessageAsDelete(messageId, senderId, receiverId, type);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  return (
    <div className="chat-window-container" data-testid="chatWindowContainer">
      {isLoading ? (
        <div className="message-loading"></div>
      ) : (
        <div data-testid="chatWindow">
          <div className="chat-title" data-testid="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver?.username}
                  bgColor={receiver?.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={receiver?.profilePicture}
                />
              </div>
            )}
            <div className="chat-title-items">
              <div
                className={`chat-name ${
                  Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) ? '' : 'user-not-online'
                }`}
              >
                {receiver?.username}
              </div>
              <span className="chat-active">
                {Utils.checkIfUserIsOnline(receiver?.username, onlineUsers) && (
                  <span className="chat-active">Online</span>
                )}
              </span>
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={setChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
