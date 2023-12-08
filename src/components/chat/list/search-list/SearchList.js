import PropTypes from 'prop-types';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';

import Avatar from '@components/avatar/Avatar';
import '@components/chat/list/search-list/SearchList.scss';

const SearchList = ({
  result,
  isSearching,
  searchTerm,
  setSelectedUser,
  setSearch,
  setIsSearching,
  setSearchResult,
  setComponentType
}) => {
  const locaion = useLocation();
  const navigate = useNavigate();

  const addUsernameToUrlQuery = (user) => {
    setComponentType('searchList');
    setSelectedUser(user);
    const url = `${locaion.pathname}?${createSearchParams({ username: user?.username.toLowerCase(), id: user?._id })}`;
    navigate(url);
    setSearch('');
    setIsSearching(false);
    setSearchResult([]);
  };

  return (
    <div className="search-result">
      <div className="search-result-container">
        {!isSearching && result.length > 0 && (
          <>
            {result.map((user) => (
              <div className="search-result-container-item" key={user?._id} onClick={() => addUsernameToUrlQuery(user)}>
                <Avatar
                  name={user?.username}
                  bgColor={user?.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={user?.profilePicture}
                />
                <div className="username">{user?.username}</div>
              </div>
            ))}
          </>
        )}

        {searchTerm && isSearching && result.length === 0 && (
          <div className="search-result-container-empty">
            <span>Searching...</span>
          </div>
        )}

        {searchTerm && !isSearching && result.length === 0 && (
          <div className="search-result-container-empty">
            <span>Nothing found.</span>
            <p className="search-result-container-empty-msg">We could&apos;t find any match for {searchTerm}</p>
          </div>
        )}
      </div>
    </div>
  );
};

SearchList.propTypes = {
  result: PropTypes.array,
  isSearching: PropTypes.bool,
  searchTerm: PropTypes.func,
  setSelectedUser: PropTypes.func,
  setSearch: PropTypes.func,
  setIsSearching: PropTypes.func,
  setSearchResult: PropTypes.func,
  setComponentType: PropTypes.func
};

export default SearchList;
