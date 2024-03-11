import re
import os

from azure_utils import (
    comment_on_pr,
)


def parseValues(val):
    if val == "undefined":
        return None
    return val


def extract_asset_version(input_string):
    # Define a regular expression pattern to match the asset_version value
    pattern = r"asset_version=(\d+)"

    # Use re.search to find the first match in the input string
    match = re.search(pattern, input_string)

    # Check if a match was found and extract the value
    if match:
        asset_version_value = match.group(1)
        return asset_version_value
    else:
        return None  # Return None if asset version value is not found


def generate_comment(azure_token, asset_version_url, logger):
    comment = (
        "**Hello**, Finite State is uploading your scan! :rocket:. \n"
        "Please, [click here]({asset_version_url}) to see the progress of the analysis over your file."
        "<br />\n"
        "[Finite State](https://platform.finitestate.io/)"
    )
    formatted_comment = comment.format(asset_version_url=asset_version_url)

    # Azure DevOps organization URL
    organization_url = os.environ.get("ORGANIZATION_URL")

    # Personal access token (PAT) with "Code (read and write)" scope
    azure_path_token = azure_token

    # Project and repository information
    project_name = os.environ.get("PROJECT_NAME")
    repository_name = os.environ.get("REPOSITORY_NAME")
    source_branch = os.environ.get("SOURCE_BRANCH")
    response = comment_on_pr(
        logger,
        formatted_comment,
        organization_url,
        azure_path_token,
        project_name,
        repository_name,
        source_branch,
    )
    status_code = response["status_code"]
    if status_code == 201:
        logger.info("Comment posted successfully")
    else:
        status_text = response["status_text"]
        logger.error(
            f"Failed to post comment. Status code: {status_code} {status_text}"
        )
        logger.debug(response)
