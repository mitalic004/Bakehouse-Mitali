#!/usr/bin/env node
import { BakehouseStack } from '../lib/bakehouse-stack.js';
import * as cdk from 'aws-cdk-lib';

// Local env, independent naming for stack
const stackName = process.env.BAKEHOUSE_STACK_NAME

if (!stackName || !stackName.trim()) {
  console.error('Environment variable BAKEHOUSE_STACK_NAME is not set')
  process.exit(1)
}

// Info for stack to provision resources
const settings = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || 'NOT_SET',
    region: process.env.CDK_DEFAULT_REGION || 'NOT_SET'
  },
  stackName: stackName,
  certArn: cdk.Fn.importValue('CTASharedCertArn'), // SSL cert for HTTPS, different stack that exports ARN val
  permissionsBoundaryPolicyName: 'scopePermissions',
  domainName: 'cta-training.academy', // Root domain
  subDomain: stackName.toLowerCase(),
  dbName: 'dev',
  vpcName: 'CTASharedVPC-vpc',
  sharedOriginRequestPolicyId: '6d7a8520-10b9-4b88-ae47-770229103b35'
}

// Initialize CDK application
const app = new cdk.App();

// Creating new stack with settings
new BakehouseStack(app,`${settings.stackName}-stack`,{
  env: settings.env,
  permissionsBoundaryPolicyName: settings.permissionsBoundaryPolicyName,
  subDomain: settings.subDomain,
  stackName: settings.stackName,
  certArn: settings.certArn,
  domainName: settings.domainName,
  dbName: settings.dbName,
  vpcName: settings.vpcName,
  sharedOriginRequestPolicyId: settings.sharedOriginRequestPolicyId
});

