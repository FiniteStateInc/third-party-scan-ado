import os
from unittest.mock import MagicMock, patch, ANY
import pytest

# Import functions to be tested
from utils import (
    parseValues,
    extract_asset_version,
)


# Define test cases for parseValues function
@pytest.mark.parametrize(
    "input_val, expected_output",
    [
        ("undefined", None),
        ("some_value", "some_value"),
        ("", ""),
    ],
)
def test_parseValues(input_val, expected_output):
    assert parseValues(input_val) == expected_output


# Define test cases for extract_asset_version function
@pytest.mark.parametrize(
    "input_string, expected_output",
    [
        (
            '"test_results/org=03b5e17b-aeda-42d4-9f2c-aeb144d96a93/asset_version=2722350854/08a3d2b9-c9a3-4b19-ab9b-d5237c7b952c"',
            "2722350854",
        ),
    ],
)
def test_extract_asset_version(input_string, expected_output):
    assert extract_asset_version(input_string) == expected_output


import unittest
from unittest.mock import patch, MagicMock, call
import utils
import os


class TestGenerateComment(unittest.TestCase):
    @patch("utils.comment_on_pr")  # Mocking the comment_on_pr function
    @patch("logging.Logger.info")  # Mocking the logger.info method
    @patch("logging.Logger.error")  # Mocking the logger.error method
    @patch("logging.getLogger")  # Mocking the getLogger method
    def test_generate_comment(
        self, mock_get_logger, mock_logger_error, mock_logger_info, mock_comment_on_pr
    ):
        # Set up test environment variables
        os.environ["ORGANIZATION_URL"] = "example.com"
        os.environ["PROJECT_NAME"] = "project"
        os.environ["REPOSITORY_NAME"] = "repo"
        os.environ["SOURCE_BRANCH"] = "source_branch"

        # Call the function with mock parameters
        azure_token = "fake_token"
        asset_version_url = "https://example.com/assets/123/versions/456"

        # Mock logger object
        logger_mock = MagicMock()
        # Configure getLogger to return logger_mock
        mock_get_logger.return_value = logger_mock

        utils.generate_comment(azure_token, asset_version_url, mock_get_logger)

        # Assert that comment_on_pr was called with the correct parameters
        expected_comment = (
            "**Hello**, Finite State is uploading your scan! :rocket:. \n"
            "Please, [click here](https://example.com/assets/123/versions/456) to see the progress of the analysis over your file."
            "<br />\n"
            "[Finite State](https://platform.finitestate.io/)"
        )

        mock_comment_on_pr.assert_called_once_with(
            ANY,
            expected_comment,
            "example.com",
            "fake_token",
            "project",
            "repo",
            "source_branch",
        )

        # Clear the environment variables to avoid affecting other tests
        os.environ.pop("ORGANIZATION_URL")
        os.environ.pop("PROJECT_NAME")
        os.environ.pop("REPOSITORY_NAME")
        os.environ.pop("SOURCE_BRANCH")


if __name__ == "__main__":
    unittest.main()
