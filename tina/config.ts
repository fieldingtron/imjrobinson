import { defineConfig } from "tinacms";


const headingBlock = {
  name: "Heading",
  label: "Heading",
  ui: {
    defaultItem: {
      heading: "Lorem ipsum dolo",
    },
  },
  fields: [
    {
      type: "string",
      label: "Heading",
      name: "heading",
    },
  ],
};

const contentBlock = {
  name: "content",
  label: "Content",
  ui: {
    defaultItem: {
      textz:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Text",
      name: "textz",
    },
  ],
};

const imageBlock = {
  name: "image",
  label: "Image",
  fields: [
    {
      type: "image",
      label: "Image",
      name: "imgSrc",
    },
  ],
};



// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "object",
            list: true,
            name: "shows",
            label: "Shows Section",
            templates: [imageBlock, contentBlock, headingBlock],
          }
        ],
      },
    ],
  },
});
