import React from 'react';
import Card from "react-bootstrap/Card";
import '../css/Comments.css';

function Comments(props) {
    const { comments } = props;

    return (
        <div className="row">
            <div className="col comment-container">
                {comments.map((comment, index) => (
                    <Card key={index} className="comment-card">
                        <div className="d-flex flex-row">
                            <div className="d-flex flex-column">
                                <Card.Body>
                                    <p>{comment.comment}</p>
                                </Card.Body>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <hr className="my-4" />
        </div>
    );
}

export default Comments;