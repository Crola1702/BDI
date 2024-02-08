import React from "react";
import { useParams } from "react-router";
import { getData } from "../utils/requests";
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Container, Card, Row, Col, Image, Carousel, Modal, Button } from "react-bootstrap";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import Comments from "./Comments";
import MapView from "./MapView";

const { useState, useEffect } = require("react");


function Post() {
    const intl = useIntl();
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [responses, setResponses] = useState({});

    const { id } = useParams();
    const imageBaseURL = "http://localhost:3000/";
    const images = getImages();
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);

    function mostrarNumero() {
        const numero = post.contactPhone;
        
        alert("El número de la persona es: " + numero);
    }

    console.log(post);
    function getImages() {
        if (post.images) {
            let imagesAux = post.images.split(",");
            for (let i = 0; i < imagesAux.length; i++) {
                imagesAux[i] = imageBaseURL + imagesAux[i];
            }
            return imagesAux;
        } else {
            return "https://via.placeholder.com/300x200";
        }
    }

    function getTagsToShow(tags) {
        if (tags) {
            let tagsList = tags.split(",")
            const pricemeter = (post.price / post.property.area);
            tagsList.push(pricemeter);
            return tagsList;
        } else {
            return []
        }
    }

    useEffect(() => {
        getData(setPost, `posts/${id}`).then(() => {
            localStorage.setItem("posts", JSON.stringify(post));
        });

        getData(setComments, `post/${id}/comments`).then(() => {
            localStorage.setItem(`post/${id}/comments`, JSON.stringify(comments));
        });

    }, []);


    useEffect(() => {
        const commentsIds = comments.map((comment) => comment.id);
        const responsesAux = {};
        commentsIds.forEach((commentId) => {
            getData((response) => {
                responsesAux[commentId] = response.comment;
                setResponses(responsesAux);
            }, `comments/${commentId}`);
        });
    }, [comments]);

    const handleImageClick = (imageIndex) => {
        setSelectedImageIndex(imageIndex);
        setShowModal(true);
    };

    const toggleDescription = () => {
        setExpanded(!expanded);
    };

    const descriptionToShow = expanded || !post.description || post.description.length < 500
        ? post.description
        : post.description.slice(0, 500) + '...';

    return (
        <div className="Container">
            <h1 className="mt-4"> {post.title} </h1>
            <hr className="my-4" />
            <Row>
                <Col>
                    <Carousel className="mt-3">
                        {Array.isArray(images) && images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <Image
                                    src={image}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onClick={() => handleImageClick(index)}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Col>

                <Col>{post.contractType &&
                    <h2> <FormattedMessage id="PriceOf" /> {" "}
                        {intl.formatMessage({ id: `${post.contractType}` })}
                        {":"} <FormattedNumber value={post.price} style="currency" currency="COP" /> </h2>}
                    <h4><FormattedMessage id="Description" /> </h4>
                    <p>{descriptionToShow}
                        {!expanded && post.description && post.description.length >= 500 && (
                            <button onClick={toggleDescription} className="btn btn-link"><FormattedMessage id="ReadMore" /></button>
                        )}</p>
                    <Container className="justify-content-center">
                        <Card style={{ width: 500 }}>
                            <Card>
                                <Row>
                                    <Col>
                                        <Row className="text-center">
                                            <h5 className="card-title">
                                                {post.publisher && post.publisher.username}
                                            </h5>
                                        </Row>
                                        <Row className="justify-content-center">
                                            <div className="col-6" style={{display: "flex", justifyContent: "flex-end"}}>
                                                <button type="button" className="btn btn-danger btn-lg" onClick={mostrarNumero}><FormattedMessage id="Contact" /> </button>
                                            </div>
                                            <div className="col-6 ">
                                                <button type="button" className="btn btn-success btn-lg"><i className="bi bi-whatsapp" onClick={mostrarNumero}></i></button>
                                            </div>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                           
                        </Card>
                    </Container>
                </Col>
            </Row>
            <Row style={{height: "50vh"}}>
            <MapView address={post.property && post.property.address}/>
            
            </Row>
            <hr className="my-4" />

            <h2><strong><FormattedMessage id="PostTags" /></strong>  </h2>
            <Container>
                <Row>
                    {post && getTagsToShow(post.tags).map((tag, index) => (

                        <Col md={6} key={index}>
                            <Card className="comment-card">
                                <div className="d-flex flex-row">
                                    <div className="d-flex flex-column">
                                        <Card.Body>
                                            {index === getTagsToShow(post.tags).length - 1 ? (
                                                <>
                                                    <FormattedMessage id="PricePerMeter" />{" "}
                                                    {":"} <FormattedNumber value={tag} style="currency" currency="COP" /> 
                                                </>
                                            ) : (
                                                <p>{tag}</p>
                                            )}
                                        </Card.Body>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <hr className="my-4" />
            <h2><strong><FormattedMessage id="Comments" /></strong>  </h2>
            <Comments comments={comments.filter(comment => comment.type === "comment")} />
            <Container className="mt-4">
                <h2><FormattedMessage id="Questions" />{" "}
                </h2>
                <Row>
                    <Col>
                        {comments.filter(comment => comment.type === "question").map((comment, index) => (
                            <Card className="mb-2" key={index}>
                                <Card.Body>
                                    <strong className="font-weight-bold">{comment.comment}</strong>
                                    {responses[comment.id] && (
                                        <Card className="mb-2" key={index}>
                                            <Card.Body>
                                                <p>{responses[comment.id]}</p>
                                            </Card.Body>
                                        </Card>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title><FormattedMessage id="Image" /> {selectedImageIndex + 1}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src={images[selectedImageIndex]}
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        <FormattedMessage id="Close" />
                    </Button>
                    <Button
                        variant="primary"
                        disabled={selectedImageIndex === 0}
                        onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                    >
                        <FormattedMessage id="Previous" />
                    </Button>
                    <Button
                        variant="primary"
                        disabled={selectedImageIndex === images.length - 1}
                        onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                    >
                        <FormattedMessage id="Next" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Post;
