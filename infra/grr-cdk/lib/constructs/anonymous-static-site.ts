import { Construct } from 'constructs';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

interface AnonymousStaticSiteProps {
    path: string;
}

export class AnonymousStaticSite extends Construct {
    constructor(scope: Construct, id: string, props: AnonymousStaticSiteProps) {
        super(scope, id);

        const hostingBucket = new Bucket(this, 'S3Bucket', {
            autoDeleteObjects: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const distribution = new Distribution(this, 'CloudfrontDistribution', {
            defaultBehavior: {
                origin: new S3Origin(hostingBucket),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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
            distribution,
            distributionPaths: ['/*'],
        });

        new CfnOutput(this, 'CloudFrontURL', {
            value: distribution.domainName,
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