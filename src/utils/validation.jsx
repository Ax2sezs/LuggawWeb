export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{9,10}$/;
  return phoneRegex.test(phone);
};
