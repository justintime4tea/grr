import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";

export class GrrTestLambda extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Define the Lambda function resource
    const testFunction = new lambda.Function(this, "GrrTestLambda", {
      runtime: lambda.Runtime.NODEJS_20_X, // Provide any supported Node.js runtime
      handler: "index.handler",
      code: lambda.Code.fromInline(`
          exports.handler = async function(event) {
            return {
              statusCode: 200,
              body: JSON.stringify('Grassroots Rocket Test Lambda!'),
            };
          };
        `),
    });

    // Define the Lambda function URL resource
    const functionUrl = testFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    // Define a CloudFormation output for your URL
    new cdk.CfnOutput(this, "GrrTestLambdaUrl", {
      value: functionUrl.url,
    });
  }
}
