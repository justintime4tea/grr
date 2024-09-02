import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StaticSiteWithDomainName } from './constructs/static-site-with-domain-name';
import { aws_certificatemanager as acm } from 'aws-cdk-lib';

export class GrrLandingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificateArn = 'arn:aws:acm:us-east-1:235494779112:certificate/5ea8bebf-ea5e-4415-a51d-f9f098fced51';
    const certificate = acm.Certificate.fromCertificateArn(this, 'StaticSiteCertificate', certificateArn);
    const domainNames = ['grassrootsrocket.com'];
    const siteBuildPath = path.join(__dirname, '../../../build/grr-landing');

    const siteProps = {
      path: siteBuildPath,
      domainNames,
      certificate
    }

    new StaticSiteWithDomainName(this, 'GrrLanding', siteProps);
  }
}
