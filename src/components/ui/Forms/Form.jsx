import React from "react";
import { FormProvider, useForm } from "react-hook-form";

const Form = ({ children, onSubmit, resolver, defaultValues }) => {
  const formConfig = {};
  if (resolver) {
    formConfig["resolver"] = resolver;
  }
  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  const submit = (data) => {
    onSubmit(data);
    reset();
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>{children}</form>
      </FormProvider>
    </div>
  );
};

export default Form;
