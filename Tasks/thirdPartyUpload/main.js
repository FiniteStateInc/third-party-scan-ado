const tl = require('azure-pipelines-task-lib/task');
const cp = require('child_process');
const path = require('path');

function getVariables() {
  function isPullRequestBuild() {
    // Check if SYSTEM_PULLREQUEST_PULLREQUESTID variable exists
    const pullRequestId = tl.getVariable('SYSTEM_PULLREQUEST_PULLREQUESTID');
    return !!pullRequestId;
  }

  function getPullRequestNumber() {
    // Get the pull request number if it's a pull request build
    return tl.getVariable('SYSTEM_PULLREQUEST_PULLREQUESTID');
  }
 
  const variables = {
    projectName: tl.getVariable('System.TeamProject'),
    inputVersion: tl.getVariable('Build.SourceVersion'), // '3b2bee6ba55751475bc1cd1cfb57d7ab45c8247a',
    sourceBranch: tl.getVariable('Build.SourceBranch'), // 'refs/pull/13/merge',
    prSourceBranch: tl.getVariable('System.PullRequest.SourceBranch'), // 'refs/heads/FEB-12'
    repositoryName: tl.getVariable('Build.Repository.Name'), // python-extension
    organizationUrl: tl.getVariable('System.CollectionUri'), // https://dev.azure.com/christianpfarher/
    prId: tl.getVariable('System.PullRequest.PullRequestId'), // 13
    buildReason: tl.getVariable('Build.Reason'), // PullRequest
    isPr: isPullRequestBuild(),
    prId1: getPullRequestNumber(),
    azureToken: tl.getVariable('System.AccessToken')
  }
  return variables;
}

function getInputs() {
  const inputs = {
    finiteStateClientId: tl.getInput('finiteStateClientId', true),
    finiteStateSecret: tl.getInput('finiteStateSecret', true),
    finiteStateOrganizationContext: tl.getInput('finiteStateOrganizationContext', true),
    assetId: tl.getInput('assetId', true),
    version: tl.getInput('version', true),
    filePath: tl.getInput('filePath', true),
    testType: tl.getInput('testType'),
    automaticComment: tl.getInput('automaticComment'),
    businessUnitId: tl.getInput('businessUnitId'),
    createdByUserId: tl.getInput('createdByUserId'),
    productId: tl.getInput('productId'),
    artifactDescription: tl.getInput('artifactDescription')
  };
  return inputs;
}

function setEnvVariables(variables, inputs) {
  process.env.INPUT_FINITE_STATE_CLIENT_ID = inputs.finiteStateClientId;
  process.env.INPUT_FINITE_STATE_SECRET = inputs.finiteStateSecret;
  process.env.INPUT_FINITE_STATE_ORGANIZATION_CONTEXT = inputs.finiteStateOrganizationContext;
  process.env.INPUT_ASSET_ID = inputs.assetId;
  process.env.INPUT_VERSION = inputs.version;
  process.env.INPUT_FILE_PATH = inputs.filePath;
  process.env.INPUT_TEST_TYPE = inputs.testType;
  
  // non required parameters:
  process.env.INPUT_AUTOMATIC_COMMENT = inputs.automaticComment;
  process.env.INPUT_BUSINESS_UNIT_ID = inputs.businessUnitId;
  process.env.INPUT_CREATED_BY_USER_ID = inputs.createdByUserId;
  process.env.INPUT_PRODUCT_ID = inputs.productId;
  process.env.INPUT_ARTIFACT_DESCRIPTION = inputs.artifactDescription;
  
  // auto get vars:
  process.env.AZURE_TOKEN = variables.azureToken;
  process.env.SOURCE_BRANCH = variables.sourceBranch;
  process.env.ORGANIZATION_URL = variables.organizationUrl;
  process.env.PROJECT_NAME = variables.projectName;
  process.env.REPOSITORY_NAME = variables.repositoryName;
}


function run() {
    try {
      setEnvVariables(getVariables(), getInputs());
    
      // Install dependencies
      cp.execSync(`pip install -r ${path.join(__dirname, 'requirements.txt')}`);
      const scriptPath = path.join(__dirname, 'upload_test_results.py');
  
      // Execute the predefined Python script
      const pythonProcess = cp.spawn('python', [scriptPath], { shell: true });
      
      // Log output of the Python script
      pythonProcess.stdout.on('data', (data) => {
        console.log(data.toString());
        tl.debug(`${data}`);
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.log(data.toString());
        // tl.error(`${data}`);
      });
  
      // Wait for the Python script to finish
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          tl.setResult(tl.TaskResult.Succeeded, 'Python script executed successfully');
        } else {
          tl.setResult(tl.TaskResult.Failed, `Python script exited with code ${code}`);
        }
      });
    } catch (err) {
      tl.setResult(tl.TaskResult.Failed, err.message);
      tl.setResult(tl.TaskResult.Failed, err);
    }
  }
  module.exports = { getVariables, getInputs, setEnvVariables, run };

  run();