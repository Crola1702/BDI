import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

function LoginCard({ submitHandler }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const intl = useIntl();

  return (
    <Card className="p-3">
      <Form>
        <Form.Group className="p-3" controlId="formBasicUsername">
          <Form.Label>
            <FormattedMessage id="Username" />
          </Form.Label>
          <Form.Control
            type="username"
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

        <br />
        <div className="d-flex justify-content-center">
          <Button
            className="m-3 w-100"
            variant="primary"
            onClick={() => submitHandler(username, password)}
          >
            <FormattedMessage id="Login" />
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default LoginCard;
