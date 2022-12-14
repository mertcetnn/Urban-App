import React from "react";
import { Navigate, useParams } from "react-router-dom";

import StoryForm from "../components/StoryForm";
import StoryList from "../components/StoryList";
import FriendList from "../components/FriendList";

import { useQuery, useMutation } from "@apollo/client";
import { QUERY_USER } from "../utils/queries";
import { QUERY_ME } from "../utils/queries";
import { ADD_FRIEND } from "../utils/mutations";
import Auth from "../utils/auth";

const Profile = (props) => {
  const { username: userParam } = useParams();

  console.log(userParam);

  const [addFriend] = useMutation(ADD_FRIEND);
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });
  console.log(
    useQuery(QUERY_USER, {
      variables: { username: "rachel" },
    })
  );

  console.log({ username: userParam });

  console.log(typeof userParam);
  const user = data?.me || data?.user || {};
  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3 justify-center">
        <h2 className=" text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        {userParam && (
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className=" col-6 mb-3 col-lg-8">
          <StoryList
            stories={user.stories}
            title={`${user.username}'s stories...`}
          />
        </div>

        <div className="col-4 col-lg-3 m-3">
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
      <div className="mb-3">{!userParam && <StoryForm />}</div>
    </div>
  );
};

export default Profile;
