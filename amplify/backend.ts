import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  storage,
});

backend.addOutput({
  storage: {
    aws_region: "ap-south-1",
    bucket_name: "lokmat-video-storage",
  },
});
