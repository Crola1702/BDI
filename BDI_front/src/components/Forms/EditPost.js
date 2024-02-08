import React, { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams, useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from "react-intl";
import { getData2, postImage, putData } from "../../utils/requests";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";

function EditPost() {
  const { userId, postId } = useParams();
  const [contractType, setContractType] = useState("rent");
  const [images, setImages] = useState(null);
  const [post, setPost] = useState({});

  const intl = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("post")) {
        setPost(JSON.parse(localStorage.getItem("post")));
      }
    } else {
    // Aquí realizas una petición al backend para obtener los datos del post con el ID especificado
      getData2(`users/${userId}/posts/${postId}`).then((data) => {
      // Aquí asignas los datos del post a las variables de estado
      console.log(data);  
      setPost(data);
        
        localStorage.setItem("post", JSON.stringify(data));
      });
    }
  }, [userId, postId]);


  function editPostCb(postResponse) {
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
      notifySuccess("Post updated successfully");
      navigate("/profile");

      // Aquí realizas una petición al backend para editar el post con el ID especificado

    } else {
      let message = "Error editing post";
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

    // Aquí realizas una petición al backend para editar el post con el ID especificado
    putData(editPostCb, `posts/${postId}`, {
      title: payload.title,
      price: parseFloat(payload.price),
      contactPhone: payload.contactPhone,
      description: payload.description,
      contractType: payload.contractType,
      tags: payload.tags.split(",").filter((tag) => tag !== "").map((tag) => tag.trim()).join(","),
      property: {
        area: parseFloat(payload.area),
        address: payload.location,
      }
    });
  }

  return (
    <Container>
      <Form onSubmit={submitForm}>
        <h1>
          <FormattedMessage id="EditPost" />
        </h1>
        <Row>
          <Form.Group className="col-md-6 col-sm-12">
            <Form.Label>
              <FormattedMessage id="PostTitle" />
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              defaultValue={post.title} // Asignas el valor del título del post a defaultValue
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
              defaultValue={post.property && post.property.address} // Asignas el valor de la ubicación del post a defaultValue
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
              defaultValue={post.price} // Asignas el valor del precio del post a defaultValue
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
              defaultValue={post.property && post.property.area} // Asignas el valor del área del post a defaultValue
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
              defaultValue={contractType} // Asignas el valor del tipo de contrato del post a defaultValue
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
              defaultValue={post.contactPhone} // Asignas el valor del teléfono de contacto del post a defaultValue
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
            defaultValue={post.description} // Asignas el valor de la descripción del post a defaultValue
            rows={3}
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
            defaultValue={post.tags} // Asignas el valor de las características del post a defaultValue
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
            <FormattedMessage id="Update" />
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default EditPost;
