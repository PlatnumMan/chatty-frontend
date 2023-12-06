import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Post from '@components/posts/post/Post';
import { Utils } from '@services/utils/utils.service';
import { useEffect, useState } from 'react';

import { PostUtils } from '@services/utils/post-utils.service';

import '@components/posts/Posts.scss';
import PostSkeleton from './post/PostSkeleton';

const Posts = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading, following, loading, profile]);

  return (
    <div className="posts-container">
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => (
          <div key={Utils.generateString(10)}>
            {(!Utils.checkIfUserIsFollowed(profile?.blockedBy, post?.userId) || post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={true} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      {loading &&
        !posts.length &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))}
    </div>
  );
};

Posts.propTypes = {
  allPosts: PropTypes.array.isRequired,
  userFollowing: PropTypes.array.isRequired,
  postsLoading: PropTypes.bool
};

export default Posts;
