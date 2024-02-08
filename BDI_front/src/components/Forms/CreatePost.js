import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FormattedMessage, useIntl } from "react-intl";
import { postData, postImage } from "../../utils/requests";
import { notifySuccess, notifyError } from "../../utils/notifications";

import { Container } from "react-bootstrap";

import Row from "react-bootstrap/Row";

function CreatePost() {
  const [contractType, setContractType] = useState("rent");
  const [images, setImages] = useState(null);

  const intl = useIntl();
  const navigate = useNavigate();

  function createPostCb(postResponse) {
    if (postResponse.id) {
      if (images) {
        for (let image of images) {
          postImage(
            (imageData) => {
              console.log(imageData);
              if (imageData) {
                notifySuccess("Image uploaded successfully");
              }
            },
            postResponse.id,
            image
          );
        }
      }

      postData(
        (data) => {
          if (data.id) {
            notifySuccess("Post created successfully");
            navigate("/");
          }
        },
        `users/${sessionStorage.getItem("userId")}/posts/${postResponse.id}`,
        {}
      );
    } else {
      let message = "Error creating post";
      if (postResponse.message) {
        message += ": " + postResponse.message;
      }
      notifyError(message);
    }
  }

  function submitForm(e) {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    postData(createPostCb, "posts/", {
      title: payload.title,
      price: parseFloat(payload.price),
      contactPhone: payload.contactPhone,
      description: payload.description,
      contractType: payload.contractType,
      tags: payload.tags.split(",").filter((tag) => tag !== "").map((tag) => tag.trim()).join(","),
      property: {
        area: parseFloat(payload.area),
        address: payload.location,
      },
    });
  }

  return (
    <Container>
      <Form onSubmit={submitForm}>
        <h1>
          <FormattedMessage id="CreatePost" />
        </h1>
        <Row>
          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="PostTitle" />
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder={intl.formatMessage({ id: "EnterPostTitle" })}
              minLength={5}
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="Address" />
            </Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder={intl.formatMessage({ id: "EnterAddress" })}
              minLength={5}
              required
            />
          </Form.Group>
        </Row>
        <br />
        <Row>
          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="Price" />
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder={intl.formatMessage({ id: "EnterPrice" })}
              min={1}
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="Area" />
            </Form.Label>
            <Form.Control
              type="number"
              name="area"
              placeholder={intl.formatMessage({ id: "EnterArea" })}
              min={1}
              required
            />
          </Form.Group>
        </Row>
        <br />
        <Row>
          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="ContractType" />
            </Form.Label>
            <Form.Control
              name="contractType"
              as="select"
              value={contractType}
              onChange={(e) => setContractType(e.currentTarget.value)}
              required
            >
              <option value="rent">
                <FormattedMessage id="Rent" />
              </option>
              <option value="sale">
                <FormattedMessage id="Sale" />
              </option>
              <option value="vacational">
                <FormattedMessage id="Vacational" />
              </option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="ContactPhone" />
            </Form.Label>
            <Form.Control
              type="text"
              name="contactPhone"
              placeholder={intl.formatMessage({ id: "EnterContactPhone" })}
              minLength={5}
              pattern="\+?[0-9, ]+"
              required
            />
          </Form.Group>
        </Row>
        <br />
        <Form.Group>
          <Form.Label>
            <FormattedMessage id="Description" />
          </Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows={3}
            placeholder={intl.formatMessage({ id: "EnterDescription" })}
            minLength={5}
            required
          />
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>
            <FormattedMessage id="Characteristics" />
          </Form.Label>
          <Form.Control
            type="text"
            name="tags"
            placeholder={intl.formatMessage({ id: "CharacteristicsExample" })}
            required
          />
          <Form.Text className="text-muted">
            <FormattedMessage id="SeparateByCommas" />
          </Form.Text>
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Label>
            <FormattedMessage id="Images" />
          </Form.Label>
          <Form.Control
            name="images"
            type="file"
            multiple="multiple"
            onChange={(e) => e.target.files && setImages(e.target.files)}
          />
          <Form.Text className="text-muted">
            <FormattedMessage id="AddMultipleImages" />
          </Form.Text>
        </Form.Group>
        <br />
        <Form.Group>
          <Form.Check
            type="checkbox"
            name="terms"
            label={intl.formatMessage({ id: "AcceptTerms" })}
            required
          />
        </Form.Group>
        <br />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="submit" variant="success" style={{ width: "50%" }}>
            <FormattedMessage id="Publish" />
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CreatePost;
