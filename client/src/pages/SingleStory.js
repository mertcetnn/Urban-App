import React from 'react';
import { useParams } from 'react-router-dom';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import Like from '../components/Like'

import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_STORY } from '../utils/queries';
import { QUERY_ME_BASIC } from '../utils/queries';

const SingleStory = (props) => {
  const { id: storyId } = useParams();

  const { loading, data } = useQuery(QUERY_STORY, {
    variables: { id: storyId },
  });

  console.log(useQuery(QUERY_STORY, {
    variables: { id: storyId },
  }))



  const { data: userData } = useQuery(QUERY_ME_BASIC);

  console.log(data)
  const story = data?.story || {};
  // console.log(story.likeCount)
  // console.log(story)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-column">
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {story.username}
          </span>{' '}
          story posted on {story.createdAt}
        </p>
        <div className="card-body">
          <p>{story.storyTitle}</p>
          <p>{story.storyText}</p>
        </div>
      </div>
      <div className="mb-3">
        {Auth.loggedIn() ? (
              <>
              </>
            ) : (
              <>
<p className="dgreen text-italic text-right">Login to share your stories and make friends!</p> 
              </>
            )}
        
        {Auth.loggedIn() && <Like storyId={story._id} username = {userData.me.username} />}
        
      </div>

      {story.commentCount > 0 && (
        <CommentList comments={story.comments} />
      )}

      {Auth.loggedIn() && <CommentForm storyId={story._id} />}
    </div>
  );
};

export default SingleStory;