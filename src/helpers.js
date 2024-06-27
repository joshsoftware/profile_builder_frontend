export const isFieldInValid = (value) => {
  if (value.trim() === "") {
    return true;
  } else {return false;}
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};