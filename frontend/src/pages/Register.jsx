import React from "react";
import Form from "../components/Form"; // Make sure this path is correct

function Register() {
  return <Form route="/api/user/register/" method="register" />;
}

export default Register;
