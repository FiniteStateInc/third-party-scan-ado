const tl = require('azure-pipelines-task-lib/task');
const cp = require('child_process');
const path = require('path');
const { getVariables, getInputs, setEnvVariables, run } = require('./main.js');

jest.mock('azure-pipelines-task-lib/task');
jest.mock('child_process');

describe('main', () => {
  const mockInputs = {
    finiteStateClientId: 'client_id',
    finiteStateSecret: 'secret',
    finiteStateOrganizationContext: 'org_context',
    assetId: 'asset_id',
    version: 'version',
    filePath: 'file_path',
    testType: 'cyclonedx',
    automaticComment: 'automatic_comment',
    businessUnitId: 'business_unit_id',
    createdByUserId: 'user_id',
    productId: 'product_id',
    artifactDescription: 'artifact_description'
  };

  // Mock variables
  const mockVariables = {
    projectName: 'project_name',
    inputVersion: 'source_version',
    sourceBranch: 'source_branch',
    prSourceBranch: 'pr_source_branch',
    repositoryName: 'repository_name',
    organizationUrl: 'organization_url',
    prId: 'pr_id',
    buildReason: 'build_reason',
    isPr: true,
    prId1: 'pr_id_1',
    azureToken: 'azure_token'
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set environment variables correctly', () => {
    // Execute the function
    setEnvVariables(mockVariables, mockInputs);
    expect(process.env.INPUT_FINITE_STATE_CLIENT_ID).toEqual(mockInputs.finiteStateClientId);
    expect(process.env.INPUT_FINITE_STATE_SECRET).toEqual(mockInputs.finiteStateSecret);
    expect(process.env.INPUT_FINITE_STATE_ORGANIZATION_CONTEXT).toEqual(mockInputs.finiteStateOrganizationContext);
    expect(process.env.INPUT_ASSET_ID).toEqual(mockInputs.assetId);
    expect(process.env.INPUT_VERSION).toEqual(mockInputs.version);
    expect(process.env.INPUT_FILE_PATH).toEqual(mockInputs.filePath);
    expect(process.env.INPUT_QUICK_SCAN).toEqual(mockInputs.quickScan);

    expect(process.env.INPUT_AUTOMATIC_COMMENT).toEqual(mockInputs.automaticComment);
    expect(process.env.INPUT_BUSINESS_UNIT_ID).toEqual(mockInputs.businessUnitId);
    expect(process.env.INPUT_CREATED_BY_USER_ID).toEqual(mockInputs.createdByUserId);
    expect(process.env.INPUT_PRODUCT_ID).toEqual(mockInputs.productId);
    expect(process.env.INPUT_ARTIFACT_DESCRIPTION).toEqual(mockInputs.artifactDescription);

    expect(process.env.AZURE_TOKEN).toEqual(mockVariables.azureToken);
    expect(process.env.SOURCE_BRANCH).toEqual(mockVariables.sourceBranch);
    expect(process.env.ORGANIZATION_URL).toEqual(mockVariables.organizationUrl);
    expect(process.env.PROJECT_NAME).toEqual(mockVariables.projectName);
    expect(process.env.REPOSITORY_NAME).toEqual(mockVariables.repositoryName);
  });

  it('should execute Python script correctly', () => {
    run();
    expect(cp.spawn).toHaveBeenCalledWith('python', [path.join(__dirname, 'upload_test_results.py')], { shell: true });
  });

});
