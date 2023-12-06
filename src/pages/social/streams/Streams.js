import Posts from '@components/posts/Posts';
import PostForm from '@components/posts/post-form/PostForm';
import Suggestions from '@components/suggestions/Suggestions';
import useEffectOnce from '@hooks/useEffectOnce';
import { getUserSuggestions } from '@redux/api/suggestion';
import { postService } from '@services/api/post/post.service';
import { Utils } from '@services/utils/utils.service';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useInfiniteScroll from '@hooks/useInfiniteScroll';
import useLocalStorage from '@hooks/useLocalStorage';
import '@pages/social/streams/Streams.scss';
import { getPosts } from '@redux/api/posts';
import { addReactions } from '@redux/reducers/post/user-post-reaction.reducer';
import { PostUtils } from '@services/utils/post-utils.service';
import { orderBy, uniqBy } from 'lodash';

const Streams = () => {
  const { allPosts } = useSelector((state) => state);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  let appPosts = useRef([]);
  const dispatch = useDispatch();
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteSelectedPostId] = useLocalStorage('selectedPostId', 'delete');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostsData);
  const PAGE_SIZE = 8;

  function fetchPostsData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        appPosts = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts, '_id');
        const orderedPosts = orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(orderedPosts);
      }
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffectOnce(() => {
    getReactionsByUsername();
    deleteSelectedPostId();
  }, []);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getUserSuggestions());
  }, [dispatch]);

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const orderedPosts = orderBy(allPosts?.posts, ['createdAt'], ['desc']);
    setPosts(orderedPosts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef} style={{ backgroundColor: 'white' }}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={[]} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
