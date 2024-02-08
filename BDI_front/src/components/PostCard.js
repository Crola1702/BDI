import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import { Link } from "react-router-dom";


function PostCard(props) {
  const intl = useIntl();
  const imageBaseURL = "http://localhost:3000/";

  function getImageToShow() {
    if (props.post.images) {
      return imageBaseURL + props.post.images.split(",")[0];
    } else {
      return "https://via.placeholder.com/300x200";
    }
  }

  function getTagsToShow() {
    if (props.post.tags) {
      let tagsList = props.post.tags.split(",")

      if (tagsList.length > 3) {
        tagsList = tagsList.slice(0, 3)
        tagsList.push("...")
      }
      
      return (
        <>
          {tagsList.map((tag) => (
            <Badge variant="primary" className="mx-1">
              {tag}
            </Badge>
          ))}
        </>
      )
    } else {
      return (
        <FormattedMessage id="NoTags" />
      )
    }
  }

  return (
    <Card>
      <Container className="d-flex flex-row flex-fill">
        <Col className="col-sm-6 col-md-5 col-lg-4 d-flex align-items-vertically">
          <Row>
            <Card.Img
              className="m-auto stretched-link"
              src={getImageToShow()}
            />
          </Row>
        </Col>
        <Card.Body className="col-sm-6 col-md-7 col-lg-8">
          <Col className="col-12 h-100">
            <Row className="justify-content-md-center">
              <Col md="auto">
                <Card.Title>
                  <strong>{props.post.title}</strong>
                </Card.Title>
              </Col>
            </Row>
            <hr />
            <Row className="m-auto">
              <Card.Subtitle style={{ color: "gray" }}>
                <FormattedMessage id="PriceOf" />{" "}
                {intl.formatMessage({ id: props.post.contractType })}
                {":"}
              </Card.Subtitle>
              <Card.Title>$ <FormattedNumber value={props.post.price} style="currency" currency="COP"/> </Card.Title>
            </Row>
            <Row className="m-auto">
              <Col className="col-sm-12 col-md-6">
                <Card.Subtitle style={{ color: "gray" }}>
                  <FormattedMessage id="Area" /> m<sup>2</sup>:
                </Card.Subtitle>
                <Card.Title>{props.post.property.area}</Card.Title>
              </Col>
              <Col className="col-sm-12 col-md-6">
                <Card.Subtitle style={{ color: "gray" }}>
                  <FormattedMessage id="Address" />:
                </Card.Subtitle>
                <Card.Title>{props.post.property.address}</Card.Title>
              </Col>
            </Row>
            <hr />
            <Row className="m-auto">
              <Col className="col-12">
                <Card.Title style={{ color: "gray" }}>
                  <FormattedMessage id="Characteristics" />
                </Card.Title>
                { getTagsToShow() }
              </Col>
            </Row>
          </Col>
          <Link
            to={{
              pathname: "/post/" + props.post.id
            }}
            className="stretched-link"
          > </Link>
        </Card.Body>
      </Container>
    </Card>
  );
}

export default PostCard;
