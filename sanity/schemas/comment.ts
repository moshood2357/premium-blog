import { Rule } from "sanity";

const comment = {
  name: "comment",
  title: "Comments",
  type: "document",
  fields: [
    {
      name: "post",
      type: "reference",
      to: [{ type: "post" }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "parent",
      type: "reference",
      to: [{ type: "comment" }],
      description: "If this is a reply, store the parent comment here",
    },
    {
      name: "name",
      type: "string",
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "message",
      type: "text",
      validation: (Rule: Rule) => Rule.required().min(2),
    },
    {
      name: "createdAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};

export default comment;
