import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../awsClients/s3Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { customAlphabet } from "nanoid";
import { NANOID_ALPHABET } from "../Config";

const nanoid = customAlphabet(NANOID_ALPHABET);

export const main = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log(event);

  // NOTE: File types are limited in the IAM policy, see cdk-stack -> lambda function resource
  const bucketParams: PutObjectCommandInput = {
    Bucket: process.env.BUCKET_NAME,
    Key: `images/${nanoid(40)}`,
    ContentLength: 10, // TODO
  };

  const command = new PutObjectCommand(bucketParams);

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Saul Goodman!",
        signedUrl,
        event,
      }),
    };
    // TODO types
  } catch (err) {
    console.log("Error creating presigned URL", err);
    return {
      statusCode: 500, // TODO AWS SDK docs has this
      body: JSON.stringify({
        error: err,
      }),
    };
  }
};
