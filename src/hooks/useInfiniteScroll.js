import { useCallback, useEffect } from 'react';

const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
    const { top: bottomLineTop } = bottomLineRef?.current?.getBoundingClientRect();
    if (bottomLineTop <= containerHeight) {
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    const bodyCurrent = bodyRef?.current;
    bodyCurrent?.addEventListener('scroll', handleScroll, true);

    return () => {
      bodyCurrent?.removeEventListener('scroll', handleScroll, true);
    };
  }, [bodyRef, handleScroll]);
};

export default useInfiniteScroll;
