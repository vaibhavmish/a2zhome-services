import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';

export class ServerURLInterceptor implements Interceptor {

	public interceptBefore(request: InterceptedRequest): InterceptedRequest {
		// if (localStorage.getItem('isLoggedIn') === 'true'){
		//     console.log(request);
		//     request.options.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
		// }
		const data = { type: 'Interceptor-request', request: request };
		console.log(data);
		return request;
	}

	public interceptAfter(response: InterceptedResponse): InterceptedResponse {
		const data = { type: 'Interceptor-response', response: response };
		console.log(data);
		return response;
	}

}