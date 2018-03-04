import KenoService, {
	KenoServiceRequest,
	KenoServiceResponse,
	METHODS
} from "app/services/Service";
import routesConfig from "app/config/routes";

class UserCreatePasswordRequest extends KenoServiceRequest {
	constructor ( password, confirmPassword ) {
		super( routesConfig.API.USER_CREATE_PASSWORD, METHODS.POST, {
			Password: password,
			ConfirmPassword: confirmPassword
		});
	}
}

class UserCreatePasswordResponse extends KenoServiceResponse {
	get isValid () {
		return (
			this.body.ValidationResponses &&
				this.body.ValidationResponses.IsValid ||
			false
		);
	}
	get errorResponses () {
		return (
			this.body.ValidationResponses &&
				this.body.ValidationResponses.FieldOrDatabaseValidationResponse
					.Responses ||
			null
		);
	}
}

class UserService extends KenoService {
	createPassword ( password, confirmPassword, callback ) {
		return this.doRequest(
			new UserCreatePasswordRequest( password, confirmPassword ),
			callback,
			UserCreatePasswordResponse
		);
	}
}

export default UserService;
