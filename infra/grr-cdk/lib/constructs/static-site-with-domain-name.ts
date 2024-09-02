import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { aws_cloudfront_origins as origins } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { aws_certificatemanager as acm } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

interface Props {
    path: string;
    domainNames: string[];
    certificate: acm.ICertificate;
}

export class StaticSiteWithDomainName extends Construct {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id);

        const hostingBucket = new Bucket(this, 'S3Bucket', {
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        // Access identity that we can attach to the bucket to give it access
        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
            this,
            "OriginAccessIdentity"
        );
        hostingBucket.grantRead(cloudfrontOAI);


        const cdn = new Distribution(this, 'CloudfrontDistribution', {
            domainNames: props.domainNames,
            certificate: props.certificate,
            minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
            defaultBehavior: {
                origin: new origins.S3Origin(hostingBucket, {originAccessIdentity: cloudfrontOAI}),
                allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                compress: true,
            },
            defaultRootObject: 'index.html',
            errorResponses: [
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                },
            ],
        });

        new BucketDeployment(this, 'BucketDeployment', {
            sources: [Source.asset(props.path)],
            destinationBucket: hostingBucket,
            distribution: cdn,
            distributionPaths: ['/*'],
        });

        new CfnOutput(this, 'CloudFrontURL', {
            value: cdn.domainName,
            description: 'Static site distribution URL',
            exportName: 'CloudFrontURL',
        });

        new CfnOutput(this, 'BucketName', {
            value: hostingBucket.bucketName,
            description: 'Static site S3 bucket',
            exportName: 'BucketName',
        });
    }
}