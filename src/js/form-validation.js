export const showError = (input, message) => {
  const formControl = input.parentElement;
  const error = formControl.querySelector(".form__field-error");
  error.innerText = message;
  formControl.classList.add("error");
};

export const showSuccess = (input) => {
  const formControl = input.parentElement;
  const error = formControl.querySelector(".form__field-error");
  error.innerText = "";
  formControl.classList.remove("error");
};

export const isEmpty = (value) => {
  return value.trim().length === 0;
};

export const isBetween = (value, min, max) =>
  value.length >= min && value.length <= max;

export const getFieldName = (input) => {
  const name = input.id.split("-")[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export const checkTextarea = (textarea, min = 2, max = 400) => {
  let isValid = false;
  const textareaValue = textarea.value;
  if (isEmpty(textareaValue)) {
    showError(textarea, `${getFieldName(textarea)} is a required field.`);
  } else if (!isBetween(textareaValue, min, max)) {
    showError(
      textarea,
      `${getFieldName(textarea)} length must be between ${min} and ${max}.`
    );
  } else {
    isValid = true;
    showSuccess(textarea);
  }
  return isValid;
};
