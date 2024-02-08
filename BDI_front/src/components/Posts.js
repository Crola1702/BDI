import PostCard from "./PostCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { getData } from "../utils/requests";
import { FormattedMessage } from "react-intl";

const { useState, useEffect } = require("react");

function Posts({max, setMax, setMin, filterContract, filterTags}) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("posts")) {
        setPosts(JSON.parse(localStorage.getItem("posts")));
      }
    } else {
      getData(setPosts, "posts/").then(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
      });
    }
  }, []);

  useEffect(() => {
    if (posts.length > 1) {
      const prices = posts.map((post) => post.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMin(minPrice);
      setMax(maxPrice);
    } else {
    }
  }, [posts, setMin, setMax]);

  const filters = posts.filter((post) => {
    if (filterContract !== 'All') {
      filterContract = filterContract.toLowerCase();
      return post.contractType === filterContract;
    }
  });
  
  const filterPosts = posts.filter((post) =>{
    if (filterContract !== 'All') {
      filterContract = filterContract.toLowerCase();
      if(post.contractType === filterContract){
        if (filterTags.length > 0) {
          for (let i = 0; i < filterTags.length; i++) {
            if (post.tags.includes(filterTags[i])) {
              return post.price<=max;
            }
          }
        }
        else{
          return post.price<=max;
        }
      }
    }
    else{
      if (filterTags.length > 0) {
        for (let i = 0; i < filterTags.length; i++) {
          if (post.tags.includes(filterTags[i])) {
            return post.price<=max;
          }
        }
      }
      else{
        return post.price<=max;
      }
    }

  })
  
  return (
    <Container fluid>
      <h1>
        <FormattedMessage id="Posts" />
      </h1>
      <hr />
      <Container>
        <Row>
          {filterPosts.map((post) => (
            <Col className="my-2" md={12} lg={6} key={post.id}>
              <PostCard post={post}></PostCard>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Posts;
