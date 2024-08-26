import React from "react";
import Form from "../components/Form"; // Make sure this path is correct

function Login() {
  return <Form route="/api/token/" method="login" />;
}

export default Login;
