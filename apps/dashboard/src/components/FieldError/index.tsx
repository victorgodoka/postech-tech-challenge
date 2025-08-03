type FieldErrorProps = {
  message?: string;
};

export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <span className="text-xs text-error font-sans">{message}</span>
  );
};
