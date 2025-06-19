import { useForm, FormProvider } from "react-hook-form";

const FormProviderWrapper = ({ children, onSubmit, defaultValues }: any) => {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default FormProviderWrapper;
