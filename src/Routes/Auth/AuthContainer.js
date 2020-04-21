import React, { useState } from "react";
import AuthPresent from "./AuthPrensenter";
import useInput from "../../Hooks/useInput";
import { useMutation } from "@apollo/react-hooks";
import {
  LOG_IN,
  CRERAT_ACCOUNT,
  CONFIRM_SECRET,
  LOCAL_LOG_IN,
} from "./AuthQueries";
import { toast } from "react-toastify";

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const secret = useInput("");
  const email = useInput("");
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: { email: email.value },
  });
  const [creatAccoutMutation] = useMutation(CRERAT_ACCOUNT, {
    variables: {
      email: email.value,
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value,
    },
  });
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      email: email.value,
      secret: secret.value,
    },
  });
  const [localLoginMutation] = useMutation(LOCAL_LOG_IN);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (action === "logIn") {
      if (email.value !== "") {
        try {
          const {
            data: { requestSecret },
          } = await requestSecretMutation();
          if (!requestSecret) {
            toast.error("You dont have an account yet, create one");
            setTimeout(() => setAction("signUP"), 3000);
          } else {
            toast.success("check your inbox for your login secret ");
            setAction("confirm");
          }
        } catch {
          toast.error("Can't request secret, try again");
        }
      } else {
        toast.error("Email is required");
      }
    } else if (action === "signUp") {
      if (
        email.value !== "" &&
        username.value !== "" &&
        firstName !== "" &&
        lastName !== ""
      ) {
        try {
          const {
            data: { createAccount },
          } = await creatAccoutMutation();
          if (!createAccount) {
            toast.error("Can't create account");
          } else {
            toast.success("Account created! Log in now");
            setTimeout(() => setAction("logIn"), 3000);
          }
        } catch (e) {
          toast.error(e.message);
        }
      } else {
        toast.error("All field are required");
      }
    } else if (action === "confirm") {
      if (secret.value !== "") {
        try {
          const {
            data: { confirmSecret: token },
          } = await confirmSecretMutation();
          if (token !== "" && token !== undefined) {
            localLoginMutation({ variables: { token } });
          } else {
            toast.Error();
          }
        } catch {
          toast.error("Cant confirm secret, check again");
        }
      }
    }
  };

  return (
    <AuthPresent
      setAction={setAction}
      action={action}
      username={username}
      firstName={firstName}
      lastName={lastName}
      email={email}
      secret={secret}
      onSubmit={onSubmit}
    />
  );
};
