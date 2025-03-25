import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

backend.addOutput({
  storage: {
    aws_region: "ap-south-1",
    bucket_name: "lokmat-video-storage",
  },
});
