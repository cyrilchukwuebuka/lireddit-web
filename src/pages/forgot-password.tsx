import { Box, Flex, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";

const forgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [_, forgotPassword] = useForgotPasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          await forgotPassword(values);
          setComplete(true);
        //   if (response.data?.forgotPassword) {
        //     setErrors(toErrorMap(response.data.forgotPassword.errors));
        //   } else if (response.data?.forgotPassword.user) {
        //     // User logged in successfully;
        //     router.push("/");
        //   }
        }}
      >
        {({ isSubmitting }) => (
            complete ? (
                <Box>
                    if an account with that email exists, we sent you an email
                </Box>
            ) : (
          <Form>
            <InputField
              name="email"
              placeholder="email"
              label="Email"
              type="email"
            />
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              forgot password
            </Button>
          </Form>)
        )}
      </Formik>
      {/* <DarkModeSwitch /> */}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(forgotPassword);
