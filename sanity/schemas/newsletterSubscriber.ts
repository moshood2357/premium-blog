// /sanity/schemas/newsletterSubscriber.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscribers",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
