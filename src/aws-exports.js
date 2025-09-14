const awsconfig = {
    "aws_project_region": process.env.REACT_APP_AWS_REGION || "ap-south-1",
    "aws_cognito_identity_pool_id": process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || "",
    "aws_cognito_region": process.env.REACT_APP_AWS_REGION || "ap-south-1",
    "aws_user_pools_id": process.env.REACT_APP_USER_POOLS_ID || "",
    "aws_user_pools_web_client_id": process.env.REACT_APP_USER_POOLS_WEB_CLIENT_ID || "",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": ["EMAIL"],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": ["SMS"],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": ["EMAIL"],
    "aws_user_files_s3_bucket": process.env.REACT_APP_S3_BUCKET || "",
    "aws_user_files_s3_bucket_region": process.env.REACT_APP_AWS_REGION || "ap-south-1",
    "aws_dynamodb_all_tables_region": process.env.REACT_APP_AWS_REGION || "ap-south-1",
    "aws_dynamodb_table_schemas": [
        {
            "tableName": process.env.REACT_APP_DYNAMODB_TABLE || "",
            "region": process.env.REACT_APP_AWS_REGION || "ap-south-1"
        }
    ],
    "aws_cloud_logic_custom": [
        {
            "name": "musicapi",
            "endpoint": process.env.REACT_APP_API_ENDPOINT || "",
            "region": process.env.REACT_APP_AWS_REGION || "ap-south-1"
        }
    ]
};

export default awsconfig;