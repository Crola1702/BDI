import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

function RegisterCard({ submitHandler }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const intl = useIntl();

  return (
    <Card className="p-3">
      <Form>
        <Form.Group className="p-3" controlId="formBasicUsername">
          <Form.Label>
            <FormattedMessage id="Username" />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: "EnterYourUsername" })}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="p-3" controlId="formBasicPassword">
          <Form.Label>
            <FormattedMessage id="Password" />
          </Form.Label>
          <Form.Control
            type="password"
            placeholder={intl.formatMessage({ id: "EnterYourPassword" })}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="p-3" controlId="formBasicPassword">
          <Form.Label>
            <FormattedMessage id="ConfirmPassword" />
          </Form.Label>
          <Form.Control
            type="password"
            placeholder={intl.formatMessage({ id: "ConfirmYourPassword" })}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <br />
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            className="m-3 w-100"
            onClick={() => submitHandler(username, password, confirmPassword)}
          >
            <FormattedMessage id="Register" />
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default RegisterCard;
