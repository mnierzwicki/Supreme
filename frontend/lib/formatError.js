export default function(error) {
  if (!error || !error.message) {
    return null;
  }

  return error.message.replace("GraphQL error: ", "");
}
