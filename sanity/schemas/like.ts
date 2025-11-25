const like = {
  name: "like",
  title: "Likes",
  type: "document",
  fields: [
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
    },
    {
      name: "ipAddress",
      type: "string",
    },
  ],
};

export default like;
