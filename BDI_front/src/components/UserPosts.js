import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import PostCard from "./PostCard";

import { getData2, deleteData } from "../utils/requests";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { notifySuccess } from "../utils/notifications";


const { useState, useEffect } = require("react");

function UserPosts() {

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("userPosts")) {
        setUserPosts(JSON.parse(localStorage.getItem("userPosts")));
      }
    } else {
      // get user id from session storage
      const userId = sessionStorage.getItem("userId");
      // create user endpoint
      const userEndpoint = `users/${userId}/posts/`;
      console.log(userEndpoint);
      // get user posts
      getData2(userEndpoint).then((data) => {
        setUserPosts(data);
        localStorage.setItem("userPosts", JSON.stringify(data));
      });
    }
  }, []);


    const handleDelete = (id) => (e) => {
        e.preventDefault();
        // Show confirmation dialog
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }
        // delete post from user endpoint
        const userId = sessionStorage.getItem("userId");
        const userEndpoint = `users/${userId}/posts/${id}/`;
        deleteData(userEndpoint).then((data) => {
            if (data.status === 204) {
                // delete post from posts endpoint
                const postEndpoint = `posts/${id}/`;
                deleteData(postEndpoint).then((data) => {
                    if (data.status === 204) {
                        // Mostrar mensaje de éxito
                        notifySuccess("Post deleted successfully");
                        // Reload page
                        window.location.reload();
                    }
                });
            }
        });

    }
    

  return (
    <Container fluid>
      <h1>
        <FormattedMessage id="ManagePosts" />
      </h1>
      <hr />
      <Container>
      <Row>
        {userPosts.map((post) => (
          <>
            <Col className="my-2 d-flex align-items-center" md={8} sm={12} key={"PostCard-"+post.id}>
              <PostCard post={post}></PostCard>
            </Col>
            <Col className="my-2 d-flex justify-content-center align-items-center" md={2} sm={6} key={"Edit-"+post.id}>
                <Link to={`/users/${post.publisher.id}/posts/${post.id}/edit`}>
              <Button variant="success" className="btn-lg">
                <FormattedMessage id="EditPostButton" />
              </Button>
                </Link>
            </Col>
            <Col className="my-2 d-flex justify-content-center align-items-center" md={2} sm={6} key={"Delete-"+post.id}>
              <Button variant="danger" className="btn-lg" onClick={handleDelete(post.id)}>
                <FormattedMessage id="DeleteButton" />
              </Button>
            </Col>
          </>
        ))}
      </Row>
    </Container>
              
      
    </Container>
  );
}

export default UserPosts;
