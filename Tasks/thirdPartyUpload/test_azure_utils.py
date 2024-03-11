from unittest.mock import MagicMock, patch
import pytest

from azure_utils import (
    is_pull_request,
    extract_pull_request_number,
    comment_on_pr,
)


@pytest.mark.parametrize(
    "branch_name, expected_result",
    [
        ("refs/pull/123/merge", True),
        ("refs/heads/feature/branch", False),
        ("refs/pull/abc/merge", False),  # Add more test cases as needed
    ],
)
def test_is_pull_request(branch_name, expected_result):
    assert is_pull_request(branch_name) == expected_result


@pytest.mark.parametrize(
    "branch_name, expected_result",
    [
        ("refs/pull/123/merge", 123),
        ("refs/heads/feature/branch", None),
        ("refs/pull/abc/merge", None),  # Add more test cases as needed
    ],
)
def test_extract_pull_request_number(branch_name, expected_result):
    assert extract_pull_request_number(branch_name) == expected_result


@pytest.fixture
def mock_azure_connection():
    with patch("azure_utils.Connection") as mock_conn:
        yield mock_conn.return_value


def test_comment_on_pr(mock_azure_connection):
    # Mock logger
    logger = MagicMock()

    # Mock the Azure DevOps client methods
    mock_git_client = MagicMock()
    mock_azure_connection.clients.get_git_client.return_value = mock_git_client
    mock_thread = MagicMock()
    mock_git_client.create_thread.return_value = mock_thread

    # Call the function
    result = comment_on_pr(
        logger,
        "Test comment",
        "https://dev.azure.com/example",
        "azure_token",
        "project",
        "repository",
        "refs/pull/123/merge",
    )

    # Assertions
    assert result == {"status_code": 201}
    assert mock_azure_connection.clients.get_git_client.called
    assert mock_git_client.create_thread.called
    assert logger.debug.called
