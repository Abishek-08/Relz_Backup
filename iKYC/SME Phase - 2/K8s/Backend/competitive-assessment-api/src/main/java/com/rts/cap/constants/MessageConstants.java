package com.rts.cap.constants;

public class MessageConstants {

	private MessageConstants() {
		super();
	}

	// jwt
	public static final String JWT_SECRET_KEY = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
	public static final long JWT_EXPIRATION_TIME = 86400000;
	public static final String JWT_SECRET_KEY_ALGORITHM = "HmacSHA256";

	// Login
	public static final String USERID_VARIABLE = "userId";
	public static final String INVALID_USER = "Invalid User";
	public static final int TWO_VARIABLE = 2;
	public static final String ADMIN_VARIABLE = "Admin";
	public static final String USER_VARIABLE = "User";
	public static final String USER_CREATION_DATE_VARIABLE = "userCreationDate";
	public static final String USER_UPDATION_DATE_VARIABLE = "userUpdationDate";
	public static final String ROLE_VARIABLE = "role";
	public static final String OTP_VARIABLE = "otp";
	public static final String COUNT_VARIABLE = "count";
	public static final String NAME_VARIABLE = "userName";
	public static final String EMAIL_VARIABLE = "userEmail";
	public static final String MOBILE_VARIABLE = "userMobile";
	public static final String PROFILE_VARIABLE = "profile";

	public static final String FRESH_USER_VARIABLE = "freshUser";
	public static final String LOGIN_VERIFICATION_OTP = "Login Verification OTP for Your Account";
	public static final String LOGIN_OTP_BODY_LINE_ONE = "<p>Welcome Back.</p>";
	public static final String LOGIN_OTP_BODY_LINE_TWO = "<p>We are sending you this email to verify your login attempt. Your OTP (One-Time Password) for login verification is:</p>";
	public static final String LOGIN_OTP_BODY_LINE_THREE = "<p>Please use this OTP to complete your login. Note that the OTP is valid for 10 minutes from the time of this email. If you do not use it within these 10 minutes, you will need to generate a new OTP.</p>"
			+ "<p>For your security, please do not share this OTP with anyone. If you did not attempt to log in or have any concerns about your account, please contact our support team.</p>"
			+ "<p>Thank you... 😀</p></body></html>";

	public static final String LOGIN_OTP_FAILURE = "<html><body><p><strong>Failed to Generate OTP</strong></p><p>Please try again later.</p></body></html>";

	public static final String LOGIN_OTP_EXPIRE_TIME = "expireTime";
	public static final String OTP_EXPIRY_TIME_VARIABLE = "expiryTime";
	public static final String PASSWORD_CHANGE_MAIL_SUBJECT = "Notification!!!";
	public static final String PASSWORD_CHANGE_MAIL_SALUTATION = "<b>Dear </b> ";
	public static final String PASSWORD_RESET_MAIL_BODY = ",<p>This is to inform you that the password for your account has been reset successfully.</p> <p style= \"margin-bottom: 10%\">If you did not initiate this change, please contact our support team immediately or admin team.</p>";

	public static final String PASSWORD_CHANGE_MAIL_BODY = ",<p>This is to inform you that the password for your account has been changed successfully.</p> <p style= \"margin-bottom: 10%\">If you did not initiate this change, please contact our support team immediately or admin team.</p>";

	public static final String USER_REQUEST_MAIL_BODY = ",<p>This is to inform you that the request for enabling you account has been successfully made the admin team will review your account and get back to you with a mail.</p><b>Your request ID : </b>CAP00";
	public static final String BEST_REGARDS_MAIL_CONTENT = "<p><b>Thanks & Regards</b>,</p> Relevantz Competitive Assessment Team";

	// security
	public static final String ACCOUNT_EXPIRATION_TIME = "24 hours";

	// Admin
	public static final String SUCCESS = "Success";
	public static final String FAILURE = "Failure";
	public static final String NOT_AVAILABLE = "NA";
	public static final String USER_STATUS_ACTIVE = "ACTIVE";
	public static final String USER_STATUS_INACTIVE = "INACTIVE";
	public static final String USER_REGISTRATION_SUBJECT = "User Registration to the CAP Application";
	public static final String USER_REGISTRATION_BODY_STATEMENT0 = "Hi,";
	public static final String USER_REGISTRATION_BODY_STATEMENT1 = " You had successfully registered with the CAP Application.\nYour Temporary Login Credentials to login into the Application.\n\n";
	public static final String USER_REGISTRATION_BODY_STATEMENT2 = "\n\nYou can able to change the password, after login into the application.\n\n****Thank You****";
	public static final String USER_DELETION_SUBJECT = "Remove from CAP Application";
	public static final String USER_DELETION_BODY = "\n\nYou successfully removed from CAP Application.\n\n****Thank You****";
	public static final String DATE_FORMAT = "dd-MM-yyyy";
	public static final String DATE_FORMAT_2 = "MM/dd/yyyy";
	public static final String HOURS_FORMAT = "HH:mm";
	public static final String USER_REGISTRATION_ROLE = "USER";
	public static final int USER_REGISTRATION_COUNT = 5;
	public static final boolean TRUE_VARIABLE = true;
	public static final boolean FALSE_VARIABLE = false;
	public static final String USER_BATCH_ADD_SUBJECT = "You have been added to a batch";
	public static final String USER_BATCH_REMOVAL_SUBJECT = "You have been Removed from a batch";
	public static final String BATCH_COUNT_FAILURE = "User list size exceeds batch count limit";

	public static final int PASSWORD_MAXIMUM_LENGTH = 15;

	public static final String IS_ASSESSMENT_SCHEDULED = "Is Assessment scheduled";

	public static final String BAD_REQUEST = "Bad Request is made, Assessment cannot be cancelled";

	public static final String VALID_SECRETKEY_ERROR = "Error validation secret key";
	public static final String MESSAGE = "Dear";
	public static final String ASSESSMENT_SCHEDULE_SUBJECT = "Assessment Scheduled!";
	public static final String ASSESSMENT_CANCELLED_SUBJECT = "Assessment Cancelled";
	public static final String ASSESSMENT_CANCELLED_BODY_STATEMENT1 = "Your assessment";
	public static final String ASSESSMENT_CANCELLED_BODY_STATEMENT2 = "has been cancelled";
	public static final String ASSESSMENT_CANCELLED_BODY_STATEMENT3 = "Please contact the administrator for further information.\n\n";
	public static final String ASSESSMENT_CANCELLED_BODY_STATEMENT4 = "Best regards,\n Admin";
	public static final String ASSESSMENT_CANCELLED_BODY_STATEMENT5 = "It will reschedule on ";
	public static final String ASSESSMENT_SCHEDULE_BODY_STATEMENT1 = "Your assessment has been scheduled for the following date and time:";
	public static final String ASSESSMENT_SCHEDULE_BODY_STATEMENT2 = "We wish you the best of luck on your assessment. If you have any questions or concerns, please do not hesitate to reach out to us.\r\n";

	public static final String ASSESSMENT_SCHEDULE_BODY_STATEMENT3 = "To access the assessment, please visit the following URL:";
	public static final String ASSESSMENT_SCHEDULE_BODY_STATEMENT4 = "Login Credentials: Please use the following secret key to log in:";
	public static final String ASSESSMENT_SCHEDULE_STATUS = "scheduled";
	public static final String ASSESSMENT_CANCELLED_STATUS = "cancelled";
	public static final String ASSESSMENT_POSTPONED_STATUS = "postponed";
	public static final String ASSESSMENT_RESCHEDULED_STATUS = "rescheduled";
	public static final String ASSSESSMENT_SCHEDULE_FAILURE = "Schedule Assessment not found";
	public static final String ASSESSMENT_SCHEDULE_UPDATE_STATUS = "Assessment Postponed";
	public static final String ASSESSMENT_SCHEDULE_UPDATE_STATEMENT1 = " has been postponed.";
	public static final String ASSESSMENT_POSTPONED_MESSAGE = "Find the below changes and use the same secret key you received when assessment has been scheduled";
	public static final String SKILL_ASSESSMENT_URL = "http://localhost:3000/scheduled-assessments/skill";
	public static final String ASSESSMENT_RESCHEDULE_SUBJECT = "Assessment Rescheduled";
	public static final String ASSESSMENT_RESCHEDULE_STATEMENT1 = "has been rescheduled.\n Use the same secret key and assesment date, start time and duration";

	public static final String CAPITAL_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	public static final String LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
	public static final String SPECIAL_CHARACTERS = "!@#$";

	public static final String NUMBERES = "1234567890";
	public static final String LEVEL0_LEARNING_ASSESSMENT_TYPE = "L0";
	public static final String LEVEL1_LEARNING_ASSESSMENT_TYPE = "L1";
	public static final String LEVEL2_LEARNING_ASSESSMENT_TYPE = "L2";
	public static final String LEVEL3_LEARNING_ASSESSMENT_TYPE = "L3";

	public static final String USER_STATUS_ACTIVE_STATEMENT1 = "Your request has been accepted,Now you can attend your assessment";
	public static final String USER_STATUS_INACTIVE_STATEMENT1 = "Your request has been declined,you are unable to attend your assessment";
	public static final String USER_REQUEST_REJECTION_SUBJECT = "Request Rejection";

	// Mail

	public static final String HTML_OPEN_TAG = "<html>";
	public static final String HTML_CLOSE_TAG = "</html>";
	public static final String HEAD_OPEN_TAG = "<head>";
	public static final String HEAD_CLOSE_TAG = "</head>";
	public static final String BODY_OPEN = "<body>";
	public static final String BODY_CLOSE_TAG = "</body>";
	public static final String STYLE_OPEN_TAG = "<style>";
	public static final String STYLE_CLOSE_TAG = "</style>";
	public static final String DIV_OPEN_TAG = "<div>";
	public static final String DIV_CLOSE_TAG = "</div>";
	public static final String PARAGRAPH_OPEN_TAG = "<p>";
	public static final String PARAGRAPH_CLOSE_TAG = "</p>";
	public static final String HTML_WITH_BODY_OPEN_TAG = "<html><body style='font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;'>";
	public static final String DIV_WITH_STYLE_OPEN_TAG = "<div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;'>";
	public static final String PARAGRAPH_WITH_DEAR_OPEN_TAG = "<p>Dear ";
	public static final String PARAGRAPH_WITH_COMMA_CLOSE_TAG = ",</p>";
	public static final String PARAGRAPH_FOR_BEST_REGARDS_TAG = "<p>Best regards,<br>CAP Team</p>";

	// Mail Message

	public static final String BODY_OPEN_TAG = "<body style=\"font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e9ecef;\">";//
	public static final String ADD_USER_TABLE = "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #ffffff; padding: 30px; margin: 20px auto; max-width: 600px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);\">";
	public static final String TABLE_TAG_CLOSE = "</table>";
	public static final String TABLE_ROW_OPEN = "<tr>";
	public static final String TABLE_ROW_CLOSE = "</tr>";
	public static final String TABLE_DATA_OPEN = "<td style=\"padding: 20px;\">";
	public static final String TABLE_DATA_CLOSE = "</td>";
	public static final String HEAD2_OPEN_TAG = "<h2 style=\"color: #333333; font-size: 24px; margin-bottom: 20px;\">Hello ";
	public static final String HEAD2_CLOSE_TAG = ",</h2>";
	public static final String PARAGRAPH_STYLE_TAG1 = "<p style=\"color: #555555; font-size: 16px; line-height: 1.6;\">";
	
	// User Register
	public static final String USER_MAIL_REGISTER_STRONG = "strong { color: #4CAF50; }";
	public static final String USER_MAIL_REGISTER_H2_OPEN = "<h2>Welcome, ";
	public static final String USER_MAIL_REGISTER_H2_CLOSE = "!</h2>";
	public static final String USER_MAIL_REGISTER_P1 = "<p>Thank you for registering with us. We are thrilled to have you on board. Below are your account details:</p>";
	public static final String USER_MAIL_REGISTER_P2_OPEN = "<p><strong>Username:</strong> ";
	public static final String USER_MAIL_REGISTER_P3_OPEN = "<p><strong>Password:</strong> ";
	public static final String USER_MAIL_REGISTER_P4 = "<p>It is an system automated mail, please don't reply to this email</p>";
	 
	// Delete User
	public static final String USER_MAIL_DELETE_BODY = "body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }";
	public static final String USER_MAIL_DELETE_HIGHLIGHT = ".highlight { color: #E74C3C; font-weight: bold; }";
	public static final String USER_MAIL_DELETE_H2 = "<h2>Account Deletion Confirmation</h2>";
	public static final String USER_MAIL_DELETE_P1_OPEN = "<p>Dear <span class='highlight'>";
	public static final String USER_MAIL_DELETE_P2_OPEN = "<p>We regret to inform you that your account with the email address <span class='highlight'>";
	public static final String USER_MAIL_DELETE_P2_CLOSE = "</span> has been successfully deleted.</p>";
	public static final String USER_MAIL_DELETE_P3 = "<p>If this was done in error, or if you have any questions or need further assistance, please contact our support team.</p>";
	public static final String USER_MAIL_DELETE_P4 = "<p>Thank you for your time with us.</p>";

	// add user into batch
	public static final String ADD_USER_BODY_STATEMENT1 = "We’re excited to inform you that you have been added to a batch named:";
	public static final String STRONG_OPEN_TAG = " <strong style=\"color: #007BFF;\">";
	public static final String STRONG_CLOSE_TAG = "</strong>.";
	public static final String ADD_USER_BODY_STATEMENT2 = "Thank you for being part of our community.";
	public static final String PARAGRAPH_STYLE_TAG2 = "            <p style=\"font-size: 14px; color: #888888; margin-top: 20px;\">";
	public static final String ADD_USER_BODY_STATEMENT3 = "This is an automated message. Please do not reply directly to this email.";
	public static final String PARAGRAPH_STYLE_TAG3 = "            <p style=\"font-size: 14px; color: #007BFF; margin-top: 10px;\">";
	public static final String ADD_USER_BODY_STATEMENT4 = "If you have any questions or need further assistance, please do not hesitate to contact us.";

	// remove user into batch
	public static final String BODY_REMOVEUSER = "body { font-family: 'Arial', sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }";
	public static final String CONTAINER_REMOVEUSER = ".container { width: 80%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }";
	public static final String HEAD2_REMOVEUSER = "h2 { color: #333; font-size: 24px; margin-bottom: 20px; }";
	public static final String PARAGRAPH1_REMOVEUSER = "p { font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; }";
	public static final String HIGHLIGHT_REMOVEUSER = ".highlight { color: #4CAF50; font-weight: bold; }";
	public static final String FOOTER_REMOVEUSER = ".footer { margin-top: 30px; font-size: 14px; color: #777; text-align: center; }";
	public static final String BUTTON_REMOVEUSER = ".button { display: inline-block; font-size: 16px; color: #ffffff; background-color: #4CAF50; text-align: center; text-decoration: none; padding: 12px 20px; border-radius: 5px; margin-top: 20px; }";
	public static final String DIV1_OPEN_TAG = "<div class='container'>";
	public static final String DIV1_CLOSE_TAG = "</div>";
	public static final String STATEMENT1_REMOVEUSER = "<h2>Batch Removal Notification</h2>";
	public static final String PARAGRAPH2_OPEN_TAG_REMOVEUSER = "<p>Hello <span class='highlight'>";
	public static final String PARAGRAPH2_CLOSE_TAG_REMOVEUSER = "</span>,</p>";
	public static final String PARAGRAPH3_OPEN_TAG_REMOVEUSER = "<p>We regret to inform you that you have been removed from the <span class='highlight'>";
	public static final String PARAGRAPH3_CLOSE_TAG_REMOVEUSER = "</span> batch.</p>";
	public static final String STATEMENT2_REMOVEUSER = "<p>Thank you for being part of it. If you have any questions or need further assistance, please feel free to <a href='mailto:support@example.com' class='button'>Contact Us</a></p>";
	public static final String DIV2_OPEN_TAG = "<div class='footer'>";
	public static final String USER_STATEMENT3 = "<p>Best regards,<br>CAP Team</p>";
	public static final String DIV2_CLOSE_TAG = "</div>";

	// schedule assessment
	public static final String BODY_TAG_SCHEDULE_ASSESSMENT = "<body style='font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;'>";
	public static final String DIV_SCHEDULE_ASSESSMENT = "<div style='max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;'>";
	public static final String SCHEDULE_ASSESSMENT_SUBJECT = "<h2 style='color: #007BFF;'>Assessment Schedule</h2>";
	public static final String PARAGRAPH1_SCHEDULE_ASSESSMENT = "<p>Dear ";
	public static final String STATEMENT1_SCHEDULE_ASSESSMENT = "<p>We are pleased to inform you about your upcoming assessment.</p>";
	public static final String TABLE_TAG_SCHEDULE_ASSESSMENT = "<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>";
	public static final String SCHEDULE_ASSESSMENT_HEADING_STYLES = "<td style='padding: 8px; border: 1px solid #ddd; background-color: #f1f1f1;'>";
	public static final String SCHEDULE_ASSESSMENT_NAME = "Assessment Name";
	public static final String SCHEDULE_ASSESSMENT_DETAILS_STYLE = "<td style='padding: 8px; border: 1px solid #ddd;'>";
	public static final String SCHEDULE_ASSESSMENT_DATE = "Assessment Date";
	public static final String SCHEDULE_ASSESSMENT_STARTTIME = "Start Time";
	public static final String STATEMENT2_SCHEDULE_ASSESSMENT = "<p>Please click the link below to access the assessment:</p>";
	public static final String PARAGRAPH2_SCHEDULE_ASSESSMENT = "<p><a href='";
	public static final String SCHEDULE_ASSESSMENT_LINK = "' style='color: #007BFF; text-decoration: none;'>Start Assessment</a></p>";
	public static final String SCHEDULE_ASSESSMENT_SECRETKEY = "<p><strong>Secret Key:</strong> ";
	public static final String STATEMENT3_SCHEDULE_ASSESSMENT = "<p>For any inquiries, please do not hesitate to contact us.</p>";

	// update schedule assessment
	public static final String UPDATE_SCHEDULE_ASSESSMENT = "<h2 style='color: #007BFF;'>Assessment Update</h2>";
	public static final String SCHEDULE_ASSESSMENT_DURATION = "Duration";
	public static final String UPDATE_ASSESSMENT_STATEMENT1 = "Please, use the previous secret key for taking an Assessment";

	// Status Enable
	public static final String USER_MAIL_STATUS_ENABLE_H2 = "<h2 style='color: #28a745;'>Account Status Updated</h2>";
	public static final String USER_MAIL_STATUS_ENABLE_P1 = "<p>We are pleased to inform you that your account status has been successfully updated to active.</p>";
	public static final String USER_MAIL_STATUS_ENABLE_P2 = "<p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>";

	// Status Disable
	public static final String USER_MAIL_STATUS_DISABLE_H2 = "<h2 style='color: #dc3545;'>Account Status Inactive</h2>";
	public static final String USER_MAIL_STATUS_DISABLE_P1 = "<p>We regret to inform you that your account status has been updated to inactive.</p>";
	public static final String USER_MAIL_STATUS_DISABLE_P2 = "<p>If you have any questions or need further assistance, please contact our support team.</p>";
	public static final String USER_MAIL_STATUS_DISABLE_FOOTER = "<footer style='margin-top: 20px; font-size: 12px; color: #666;'>This is an automated message. Please do not reply.</footer>";

	// Re-Schedule Assessment
	public static final String USER_MAIL_ASSESSMENT_RESCHEDULE_H2 = "<h2 style='color: #007BFF;'>Assessment Rescheduled</h2>";
	public static final String USER_MAIL_ASSESSMENT_RESCHEDULE_P = "<p>If you have any questions or need further assistance, please feel free to contact us.</p>";

	// Cancel Assessment
	public static final String USER_MAIL_ASSESSMENT_CANCEL_CONTAINER = ".container { padding: 20px; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_HEADER = ".header { background-color: #f4f4f4; padding: 10px; text-align: center; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_CONTENT = ".content { padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 5px; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_FOOTER = ".footer { margin-top: 20px; font-size: 12px; color: #888888; text-align: center; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_H1_COLOR = "h1 { color: #333333; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P1 = "p { line-height: 1.6; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P2_OPEN_TAG = "<p>Hello <strong>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P2_CLOSE_TAG = "</strong>,</p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P3_OPEN_TAG = "<p>We regret to inform you that the assessment titled <span class=\"highlight\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P3_CLOSE_TAG = "</span> has been cancelled.</p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P4_OPEN_TAG = "<p>Reason for cancellation: ";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P5_OPEN_TAG = "<p>The assessment was originally scheduled for: <span class=\"highlight\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P5_CLOSE_TAG = "</span></p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P6 = "<p>We apologize for any inconvenience this may cause. If you have any questions or need further assistance, please contact us.</p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P7 = "<p>Thank you for your understanding.</p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_P8 = "<p>Best regards,<br>CAP Team</p>";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_HIGHLIGHT = ".highlight { color: #007bff; }";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_DIV1_OPEN_TAG = "<div class=\"container\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_DIV2_OPEN_TAG = "<div class=\"header\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_DIV3_OPEN_TAG = "<div class=\"content\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_DIV4_OPEN_TAG = "<div class=\"footer\">";
	public static final String USER_MAIL_ASSESSMENT_CANCEL_H1 = "<h1>Assessment Cancellation Notice</h1>";

	// User Request Rejection
	public static final String USER_MAIL_REQUEST_REJECTION_BODY = "body { font-family: Arial, sans-serif; margin: 0; padding: 0; }";
	public static final String USER_MAIL_REQUEST_REJECTION_CONTAINER = ".container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }";
	public static final String USER_MAIL_REQUEST_REJECTION_HEADER = ".header { background-color: #f5f5f5; padding: 10px; text-align: center; border-bottom: 1px solid #ddd; }";
	public static final String USER_MAIL_REQUEST_REJECTION_HEADER1 = ".header h1 { margin: 0; font-size: 24px; color: #333; }";
	public static final String USER_MAIL_REQUEST_REJECTION_CONTENT = ".content { padding: 20px; }";
	public static final String USER_MAIL_REQUEST_REJECTION_CONTENT_P = ".content p { margin: 0 0 10px; font-size: 16px; color: #555; }";
	public static final String USER_MAIL_REQUEST_REJECTION_FOOTER = ".footer { background-color: #f5f5f5; padding: 10px; text-align: center; border-top: 1px solid #ddd; margin-top: 20px; }";
	public static final String USER_MAIL_REQUEST_REJECTION_FOOTER_P = ".footer p { margin: 0; font-size: 14px; color: #777; }";
	public static final String USER_MAIL_REQUEST_REJECTION_DIV1_OPEN = "<div class='container'>";
	public static final String USER_MAIL_REQUEST_REJECTION_DIV2_OPEN = "<div class='header'>";
	public static final String USER_MAIL_REQUEST_REJECTION_DIV3_OPEN = "<div class='content'>";
	public static final String USER_MAIL_REQUEST_REJECTION_DIV4 = "<div class='footer'>";
	public static final String USER_MAIL_REQUEST_REJECTION_H1 = "<h1>Request Rejected</h1>";
	public static final String USER_MAIL_REQUEST_REJECTION_P2 = "<p>We regret to inform you that your recent request has been rejected. If you have any questions or need further assistance, please do not hesitate to contact us.</p>";
	public static final String USER_MAIL_REQUEST_REJECTION_P3 = "<p>Thank you for your understanding.</p>";
	public static final String USER_MAIL_REQUEST_REJECTION_P4 = "<p>&copy; 2024 CAP. All rights reserved.</p>";

	// User
	public static final String USER_REQUEST_STATUS_PENDING = "PENDING";
	public static final String USER_REQUEST_STATUS_RESOLVED = "RESOLVED";
	public static final String USER_REQUEST_STATUS_REJECTED = "REJECTED";
	public static final String USER_NOT_FOUND = "User not found with ID: ";
	public static final String RECORD_NOT_FOUND = "Record not found";
	public static final String DETAILS_NOT_FOUND = "Details not found";
	public static final String USER_UPDATED_SUCCESS = "User updated successfully!";
	public static final String USER_UPDATE_FAILED = "User update failed.";
	public static final String USER_UPDATE_SUBJECT = "Profile Updated";
	public static final String USER_UPDATE_BODY = "Details Updated successfully";
	public static final long NO_OF_SECURITY_QUESTRIONS = 3;
	public static final int INITIAL_COUNT_FOR_GENUNITY_CALCULATION = 0;

	// Skill assessment
	public static final String XML_EXTENSION = ".xml";
	public static final String DUMMY_FILE_EXTENSION = "Dummy.java";
	public static final String JAVA_FILE_EXTENSION = ".java";
	public static final String DEMO_ZIP_FILE = "/cap/reports/ReferenceDocument.zip";
	public static final String COMPILER_OPTION = "-proc:none";
	public static final String STATUS_PASS = "pass";
	public static final String STATUS_FAIL = "fail";
	public static final String CONTENT_TYPE = "application/zip";
	public static final String CONTENT_DISPOSITION = "Content-Disposition";
	public static final String REFERENCE_DOCUMENT_PATH = "attachment;filename=ReferenceDocument.zip";
	public static final String SOURCE_CODE = "sourceCode";
	public static final String STATUS_COMPLETED = "completed";
	public static final String STATUS_EVALUATING = "evaluating";
	public static final String INVALID_INPUT_MESSAGE = "Invalid input exception, It should not be: ";
	public static final String NULL_OR_EMPTY_MESSAGE = "null or empty";
	public static final String PARAMETER_OUT_OF_BOUND_EXCEPTION = "Parameter out of bound exception";
	public static final String INVALID_ARRAY_INPUT_EXCEPTION = "Exception for invalid array input: An array has to be defined with '[ARRAY VALUES...]'";
	public static final String CLASS_NAME_PATTERN_REGEX = "class\\s+(\\w+)";
	public static final String PYTHON_METHOD_NAME_PATTERN_REGEX = "def\\s+(\\w+)";
	public static final String SPACE_SPLIT_REGEX = "\\s";
	public static final String COMMA_SPLIT_REGEX = ",";
	public static final String UNSUPPORTED_PARAMETER_TYPE = "Unsupported parameter type exception: ";
	public static final String BASEDIRPATH = System.getProperty("user.home");
	public static final String JUNITJARPATH = BASEDIRPATH
			+ "\\.m2\\repository\\junit\\junit\\4.13.2\\junit-4.13.2.jar";
	public static final String COMPILERJARPATH = BASEDIRPATH
			+ "\\.m2\\repository\\org\\mdkt\\compiler\\InMemoryJavaCompiler\\1.3.0\\InMemoryJavaCompiler-1.3.0.jar";
	public static final String HAMCRESTJARPATH = BASEDIRPATH
			+ "\\.m2\\repository\\org\\hamcrest\\hamcrest-core\\2.2\\hamcrest-core-2.2.jar";
	public static final String JYTHONJARPATH = BASEDIRPATH
			+ "\\.m2\\repository\\org\\python\\jython-slim\\2.7.3b1\\jython-slim-2.7.3b1.jar";
	public static final String JAVA_LANGUAGE = "Java";
	public static final String PYTHON_LANGUAGE = "Python";
	public static final String PYTHON_INT_PARSING = "-?\\d+";
	public static final String PYTHON_FLOAT_PARSING = "-?\\d*\\.\\d+";
	public static final String PYTHON_PATH = "python.path";
	public static final String PYTHON_HOME = "python.home";
	public static final String PYTHON_PREFIX = "python.perfix";
	public static final String COLON_SYMBOL = ":";
	public static final String SEMI_COLON_SYMBOL = ";";
	
	// Learning assessment
	public static final String IS_ACTIVE = "yes";

	public static final String QUESTION_REASON = "Question content is empty";
	public static final String QUESTION_EXIST_REASON = "Question content is already exist !";
	public static final String QUESTION_CHARECTOR_REASON = "Question content exceeds 100 characters";
	public static final String COMPLEXITY_REASON = "Complexity is empty";
	public static final String COMPLEXITY_INVALID_REASON = "Invalid Complexity Type !";
	public static final String QUESTION_TYPE_REASON = "Question type is empty";
	public static final String QUESTION_TYPE_MISMATCH_REASON = "The type of question is Mismatch.";
	public static final String TOPIC_REASON = "Topic is empty";
	public static final String SUBTOPIC_REASON = "Subtopic is empty";
	public static final String MARK_REASON = "Mark is not positive";
	public static final String OPTION_REASON = "Less than 2 options provided";
	public static final String OPTION_DUPLICATE_REASON = "Duplicate Options Found";
	public static final String CORRECT_OPTION_REASON = "No correct options provided";
	public static final String CORRECT_OPTION_DUPLICATE_REASON = "Duplicate Correct Options Found";
	public static final String CORRECT_OPTION_NOT_FOUND_REASON = "There is no correct option in the option content";
	public static final String CORRECT_OPTION_EXCEEDS_LIMIT_REASON = "There is Correct Option is Exceeds the Limit (More than 3)";
	public static final int MAX_CORRECT_OPTIONS = 3;
	public static final String RESULT_PASS = "PASS";
	public static final String RESULT_FAIL = "FAIL";
	public static final String COMPLETION_STATUS = "completed";
	public static final String END_OF_QUESTION_XL_FILE = "End of Question";

	public static final String FILTER_BASE_QUERY = "SELECT mcq FROM MultipleChoiceQuestion mcq JOIN mcq.subtopic st JOIN st.topic t ";

	public static final String COMPLEXITY_BASIC = "Basic";
	public static final String COMPLEXITY_INTERMEDIATE = "Intermediate";
	public static final String COMPLEXITY_HARD = "Hard";

	public static final String TOPIC_ID = "topicId";
	public static final String SUBTOPIC_ID = "subtopicId";
	public static final String COMPLEXITY = "complexity";

	public static final int QUESTION_COLUMN = 0;
	public static final int COMPLEXITY_COLUMN = 1;
	public static final int QUESTION_TYPE_COLUMN = 2;
	public static final int TOPIC_COLUMN = 3;
	public static final int SUBTOPIC_COLUMN = 4;
	public static final int MARK_COLUMN = 5;
	public static final int OPTION_START_COLUMN = 6;
	public static final int CORRECT_OPTION_COLUMN = 14;
	public static final int HEADER_ROW = 1;
	public static final int END_OF_LINE = 0;
	public static final String SCHEDULE_ASSESSMENT_ID = "scheduleAssessmentId";

	public static final String LEARNING_ASSESSMENT_QUESTION = "question";
	public static final String LEARNING_ASSESSMENT_QUESTION_ID = "questionId";

	public static final boolean SKIPPED_ROW = false;

	public static final int ZERO_VARIABLE = 0;
	public static final String SKILL_ASSESSMENT_VARIABLE = "Skill";

	public static final String SKILL_ASSESSMENT_NAME = "skill";
	public static final String KNOWLEDGE_ASSESSMENT_NAME = "knowledge";

	public static final String GET_SKILL_ASSESSMENT_MESSAGE = "No skill assessment is fetched";
	public static final String GENERAL_ERROR_REASON = "Question Row should not be correct Format!";

}
